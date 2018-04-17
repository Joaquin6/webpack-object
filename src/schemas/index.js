import path from 'path'

import Joi from 'joi'
import sh from 'shelljs'
import chalk from 'chalk'
import semver from 'semver'
import { has, isArray, merge } from 'lodash'

import moduleSchemaFn from './properties/module'
import entrySchema from './properties/entry'
import contextSchema from './properties/context'
import devtoolSchema from './properties/devtool'
import externalsSchema from './properties/externals'
import nodeSchema from './properties/node'
import pluginsSchema from './properties/plugins'
import resolveSchemaFn from './properties/resolve'
import outputSchema from './properties/output'
import watchOptionsSchema from './properties/watchOptions'
import devServerSchema from './properties/devServer'
import performanceSchema from './properties/performance'
import { looksLikeAbsolutePath } from './types'

sh.config.silent = true

const defaultSchemaOptions = {
  rules: {
    'no-root-files-node-modules-nameclash': true,
    'loader-enforce-include-or-exclude': false,
    'loader-prefer-include': false,
  },
}

export { default as Joi } from 'Joi'

export const makeSchema = (schemaOptions, schemaExtension) => {
  const resolveSchema = resolveSchemaFn(schemaOptions)
  const moduleSchema = moduleSchemaFn(schemaOptions)

  const schema = Joi.object().keys({
    amd: Joi.object(),
    bail: Joi.boolean(),
    cache: Joi.boolean(),
    context: contextSchema,
    devServer: devServerSchema,
    devtool: devtoolSchema,
    entry: entrySchema,
    externals: externalsSchema,
    loader: Joi.any(), // ?
    module: moduleSchema,
    node: nodeSchema,
    output: outputSchema,
    plugins: pluginsSchema,
    profile: Joi.boolean(),
    mode: Joi.string(),
    recordsInputPath: looksLikeAbsolutePath,
    recordsOutputPath: looksLikeAbsolutePath,
    recordsPath: looksLikeAbsolutePath,
    resolve: resolveSchema,
    resolveLoader: resolveSchema.concat(Joi.object({
      moduleTemplates: Joi.array().items(Joi.string()),
    })),
    watch: Joi.boolean(),
    watchOptions: watchOptionsSchema,
    performance: performanceSchema,
    stats: Joi.any(),
    target: Joi.string(),
  })

  return schemaExtension ? schema.keys(schemaExtension) : schema
}

export const throwForWebpack2 = () => {
  const cwd = process.cwd()

  let satisifies = true

  try {
    const { version } = require(path.join(cwd, 'node_modules', 'webpack', 'package.json'))
    satisifies = semver.satisfies(version, '^1.x')
  } catch (error) {}

  if (!satisifies) {
    throw new Error(`
      It looks like you\'re using version 2 or greater of webpack.
      The official release of 2 of webpack was released with built-in validation.
      So webpack-validator does not support that version.
      Please uninstall webpack-validator and remove it from your project!
    `)
  }
}

const validate = (config, options = {}) => {
  const { returnValidation, schema: overrideSchema, schemaExtension, rules } = options
  // throwForWebpack2();

  const schemaOptions = merge(defaultSchemaOptions, { rules })

  const schema = overrideSchema || makeSchema(schemaOptions, schemaExtension)

  const validationResult = Joi.validate(config, schema, { abortEarly: false })
  validationResult.schemaOptions = schemaOptions // Mainly for having sth to assert on right now

  if (returnValidation) { return validationResult }

  if (validationResult.error) {
    console.error(validationResult.error.annotate())
    process.exit(1)
  }

  return config
}

export default validate

// Easier consumability for require (default use case for non-transpiled webpack configs)
export const validateRoot = (config, options = {}) => {
  const { quiet } = options

  let validationResult
  let multiValidationResults

  if (!isArray(config)) {
    validationResult = validate(config, options)
  } else {
    multiValidationResults = []

    config.forEach((cfg) => {
      multiValidationResults.push(validate(cfg, options))
    })
  }

  if (!quiet) {
    console.info(chalk.green('[webpack-object] Config is valid.'))
  }

  return validationResult || multiValidationResults
}

export const confirmSchemaVersion = (schema) => {
  let version = 1;

  const upgradeVersion = (old, newV) => old > newV ? old : newV;

  /** "debug" option was only available in webpack 1 */
  if (has(schema, 'debug')) {
    version = upgradeVersion(version, 1);
  }

  if (has(schema, 'optimize')) {
    /** "optimize.occurenceOrderPreferEntry" option was only available in webpack 1 */
    if (has(schema.optimize, 'occurenceOrderPreferEntry')) {
      version = upgradeVersion(version, 1);
    }
  }

  if (has(schema, 'resolveLoader')) {
    /** "resolveLoader.fastUnsafe" option was only available in webpack 1 */
    if (has(schema.resolveLoader, 'fastUnsafe')) {
      version = upgradeVersion(version, 1);
    }
  }

  if (has(schema, 'resolve')) {
    /** "resolve.fastUnsafe" option was only available in webpack 1 */
    if (has(schema.resolve, 'fastUnsafe')) {
      version = upgradeVersion(version, 1);
    }

    if (has(schema.resolve, 'modulesDirectories')
      || has(schema.resolve, 'modules')
      || has(schema.resolve, 'root')) {
      version = upgradeVersion(version, 2);
    }

    if (has(schema.resolve, 'mainFields')
      || has(schema.resolve, 'modules')
      || has(schema.resolve, 'concord')
      || has(schema.resolve, 'cacheWithContext')) {
      version = upgradeVersion(version, 3);
    }
  }

  /** "resolve.fastUnsafe" option was available until webpack 2 */
  if (has(schema, 'performance')) {
    version = upgradeVersion(version, 2);
  }

  if (has(schema, 'node')) {
    /** "resolve.fastUnsafe" option was available until webpack 2 */
    if (has(schema.node, 'Buffer')) {
      version = upgradeVersion(version, 2);
    }
  }

  if (has(schema, 'output')) {
    if (has(schema.output, 'chunkLoadTimeout')) {
        version = upgradeVersion(version, 2);
    }

    if (has(schema.output, 'library')
      || has(schema.output, 'libraryExport')) {
        version = upgradeVersion(version, 3);
    }
  }

  if (has(schema, 'module')) {
    /** "module.[loaders|preLoaders|postLoaders]" options were only available in webpack 2 */
    if (has(schema.module, 'loaders')
      || has(schema.module, 'preLoaders')
      || has(schema.module, 'postLoaders')) {
      version = upgradeVersion(version, 2);
    }
    if (has(schema.module, 'rules')) {
      version = upgradeVersion(version, 3);
    }
  }

  if (has(schema, 'mode') || has(schema, 'performance') || has(schema, 'optimization')) {
    version = upgradeVersion(version, 4);
  }
}
