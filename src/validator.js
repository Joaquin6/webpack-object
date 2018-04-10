import Ajv from 'ajv';
import Joi from 'joi';
import fs from 'fs-extra';
import AjvKeywords from 'ajv-keywords';
import { isArray, isNumber, isString } from 'lodash';

import ajvAbsolutePath from './schemas/ajv.absolutePath';

const ajv = new Ajv({
  errorDataPath: 'configuration',
  allErrors: true,
  verbose: true
});
AjvKeywords(ajv, ['instanceof']);
ajvAbsolutePath(ajv);

const v1Schema = Joi.object().keys({
  mode: Joi.string().default(process.env.NODE_ENV || 'none'),
  entry: Joi.any().optional(),
  output: Joi.object(),
  module: Joi.object(),
  performance: Joi.object(),
  devtool: Joi.string(),
  target: Joi.string(),
  externals: Joi.any(),
  stats: Joi.alternatives().try(Joi.string(), Joi.object()),
  devServer: Joi.object(),
  plugins: Joi.array(),
  resolveLoader: Joi.object(),
  parallelism: Joi.number(),
  profile: Joi.boolean(),
  bail: Joi.boolean(),
  cache: Joi.boolean(),
  watch: Joi.boolean(),
  watchOptions: Joi.object().keys({
    aggregateTimeout: Joi.number(),
    poll: Joi.boolean(),
    poll: Joi.number()
  }),
  node: Joi.object().keys({
    console: Joi.boolean(),
    global: Joi.boolean(),
    process: Joi.boolean(),
    __filename: Joi.string(),
    __dirname: Joi.string(),
    Buffer: Joi.boolean(),
    setImmediate: Joi.boolean()
  }),
  recordsPath: Joi.string(),
  recordsInputPath: Joi.string(),
  recordsOutputPath: Joi.string()
});

const v2Schema = Joi.object().keys({
  mode: Joi.string().default(process.env.NODE_ENV || 'none'),
  entry: Joi.any().optional(),
  output: Joi.object(),
  module: Joi.object(),
  performance: Joi.object(),
  devtool: Joi.string(),
  target: Joi.string(),
  externals: Joi.any(),
  stats: Joi.alternatives().try(Joi.string(), Joi.object()),
  devServer: Joi.object(),
  plugins: Joi.array(),
  resolveLoader: Joi.object(),
  parallelism: Joi.number(),
  profile: Joi.boolean(),
  bail: Joi.boolean(),
  cache: Joi.boolean(),
  watch: Joi.boolean(),
  watchOptions: Joi.object().keys({
    aggregateTimeout: Joi.number(),
    poll: Joi.boolean(),
    poll: Joi.number()
  }),
  node: Joi.object().keys({
    console: Joi.boolean(),
    global: Joi.boolean(),
    process: Joi.boolean(),
    __filename: Joi.string(),
    __dirname: Joi.string(),
    Buffer: Joi.boolean(),
    setImmediate: Joi.boolean()
  }),
  recordsPath: Joi.string(),
  recordsInputPath: Joi.string(),
  recordsOutputPath: Joi.string()
});

const v3Schema = Joi.object().keys({
  mode: Joi.string().default(process.env.NODE_ENV || 'none'),
  entry: Joi.any().optional(),
  output: Joi.object(),
  module: Joi.object(),
  performance: Joi.object(),
  devtool: Joi.string(),
  target: Joi.string(),
  externals: Joi.any(),
  stats: Joi.alternatives().try(Joi.string(), Joi.object()),
  devServer: Joi.object(),
  plugins: Joi.array(),
  resolveLoader: Joi.object(),
  parallelism: Joi.number(),
  profile: Joi.boolean(),
  bail: Joi.boolean(),
  cache: Joi.boolean(),
  watch: Joi.boolean(),
  watchOptions: Joi.object().keys({
    aggregateTimeout: Joi.number(),
    poll: Joi.boolean(),
    poll: Joi.number()
  }),
  node: Joi.object().keys({
    console: Joi.boolean(),
    global: Joi.boolean(),
    process: Joi.boolean(),
    __filename: Joi.string(),
    __dirname: Joi.string(),
    Buffer: Joi.boolean(),
    setImmediate: Joi.boolean()
  }),
  recordsPath: Joi.string(),
  recordsInputPath: Joi.string(),
  recordsOutputPath: Joi.string()
});

const v4Schema = Joi.object().keys({
  mode: Joi.string().default(process.env.NODE_ENV || 'none'),
  entry: Joi.any().optional(),
  output: Joi.object(),
  module: Joi.object(),
  performance: Joi.object(),
  devtool: Joi.string(),
  target: Joi.string(),
  externals: Joi.any(),
  stats: Joi.alternatives().try(Joi.string(), Joi.object()),
  devServer: Joi.object(),
  plugins: Joi.array(),
  resolveLoader: Joi.object(),
  parallelism: Joi.number(),
  profile: Joi.boolean(),
  bail: Joi.boolean(),
  cache: Joi.boolean(),
  watch: Joi.boolean(),
  watchOptions: Joi.object().keys({
    aggregateTimeout: Joi.number(),
    poll: Joi.boolean(),
    poll: Joi.number()
  }),
  node: Joi.object().keys({
    console: Joi.boolean(),
    global: Joi.boolean(),
    process: Joi.boolean(),
    __filename: Joi.string(),
    __dirname: Joi.string(),
    Buffer: Joi.boolean(),
    setImmediate: Joi.boolean()
  }),
  recordsPath: Joi.string(),
  recordsInputPath: Joi.string(),
  recordsOutputPath: Joi.string()
});

export const versionValue = (version) => version > 4 || version < 1 ? false : version;

export const validateOutputVersion = version => {
	if (isNumber(version)) {
    version = versionValue(version);
  }

  if (isString(version)) {
    version = versionValue(parseInt(version));
  }

  if (!version) {
    return false;
  }

  return `v${version}`;
};

export const filterErrors = errors => {
  let newErrors = [];

  errors.forEach((err) => {
    const dataPath = err.dataPath;

    let children = [];

    newErrors = newErrors.filter((oldError) => {
      if(oldError.dataPath.includes(dataPath)) {
        if(oldError.children) {
          children = children.concat(oldError.children.slice(0));
        }
        oldError.children = undefined;
        children.push(oldError);
        return false;
      }
      return true;
    });

    if(children.length) {
      err.children = children;
    }

    newErrors.push(err);
  });

  return newErrors;
};

export const validateObject = (version, schema) => {
  const validate = ajv.compile(schema);
  const valid = validate(options);
  return valid ? [] : filterErrors(validate.errors);
};

export const validateConfig = (version, schema, config) => {
  const validate = ajv.compile(confischemaSchema);
  const valid = validate(schema);

  return valid ? [] : filterErrors(validate.errors);
};

export const validateConfigs = (version, schema, configs) => {
  const errors = configs.map(config => validateConfig(version, schema, config));

  errors.forEach((list, idx) => {
    list.forEach(function applyPrefix(err) {
      err.dataPath = `[${idx}]${err.dataPath}`;
      if(err.children) {
        err.children.forEach(applyPrefix);
      }
    });
  });

  return errors.reduce((arr, items) => arr.concat(items), []);
};
