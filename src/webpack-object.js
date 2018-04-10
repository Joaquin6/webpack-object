import Joi from 'joi';
import fs from 'fs-extra';
import path from 'path';
import { isArray, isObject } from 'lodash';

import { validateOutputVersion, validateSchemas } from './validator';
const optionsValidationError = require('./utils/errors');

export const getWebpackOptionsSchema = async (version) => {
  let configSchema;

  try {
    configSchema = await fs.readJson(path.join(__dirname, `./schemas/${version}/webpackOptionsSchema.json`));
  } catch(e) {
    console.error(e);
    throw e;
  }

  return configSchema;
};

export default (version, options) => {
  const outputVersion = validateOutputVersion(version);
  if (!outputVersion) {
    throw new Error('webpack version does not exist');
  }

  const schema = getWebpackOptionsSchema(outputVersion);

  const { configs } = options;

  if (isObject(configs)) {
    configs = [configs];
  }

  const schemaValidationErrors = validateConfigs(version, schema, configs);
  if(schemaValidationErrors.length) {
    throw new optionsValidationError(schemaValidationErrors);
  }
}
