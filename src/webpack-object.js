import path from 'path'

import Joi from 'joi'
import fs from 'fs-extra'
import buglog from 'buglog'
import { isArray, isObject } from 'lodash'

import { validateOutputVersion, validateConfigs, validateOptions } from './validator'
import optionsValidationError from './utils/errors'

const log = buglog('main');

export { default as Joi } from 'Joi'

export const getWebpackOptionsSchema = async (version) => {
  let configSchema

  try {
    configSchema = await fs.readJson(path.join(__dirname, `./schemas/${version}/webpackOptionsSchema.json`))
  } catch (e) {
    console.error(e)
    throw e
  }

  return configSchema
}

export default (version, options) => {
  log(`Receieved Desired Version: ${version}`);

  const outputVersion = validateOutputVersion(version)
  if (!outputVersion) {
    log('ERROR: webpack version does not exist');
    throw new Error('webpack version does not exist')
  }

  const results = validateOptions(version, options)

  return results

  // const schema = getWebpackOptionsSchema(outputVersion);

  // const { configs } = options;

  // if (isObject(configs)) {
  //   configs = [configs];
  // }

  // const schemaValidationErrors = validateConfigs(version, schema, configs);
  // if(schemaValidationErrors.length) {
  //   throw new optionsValidationError(schemaValidationErrors);
  // }
}
