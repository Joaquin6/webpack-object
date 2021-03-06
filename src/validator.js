import Ajv from 'ajv'
import fs from 'fs-extra'
import buglog from 'buglog'
import AjvKeywords from 'ajv-keywords'
import { has, isArray, isNumber, isString } from 'lodash'

import { validateRoot } from './schemas'

import ajvAbsolutePath from './schemas/ajv.absolutePath'

const log = buglog('validator');
const ajv = new Ajv({
  errorDataPath: 'configuration',
  allErrors: true,
  verbose: true,
})
AjvKeywords(ajv, ['instanceof'])
ajvAbsolutePath(ajv)

export const versionValue = (version) => (version > 4 || version < 1 ? false : version)

export const getNumber = (number, defaultNumber = 4) =>
  isNaN(parseInt(number, 10)) ? defaultNumber : parseInt(number, 10);

export const validateOutputVersion = (version) => {
  log(`Validating Version: ${version}`);

  if (isNumber(version)) {
    version = versionValue(version)
  }

  if (isString(version)) {
    const parsedVersion = getNumber(version);
    log(`Validating Parsed Version: ${parsedVersion}`);

    version = versionValue(parsedVersions)
  }

  if (!version) {
    log(`Version Validation Failed: ${version}`);
    return false
  }

  return `v${version}`
}

export const filterErrors = (errors) => {
  let newErrors = []

  errors.forEach((err) => {
    const dataPath = err.dataPath

    let children = []

    newErrors = newErrors.filter((oldError) => {
      if (oldError.dataPath.includes(dataPath)) {
        if (oldError.children) {
          children = children.concat(oldError.children.slice(0))
        }
        oldError.children = undefined
        children.push(oldError)
        return false
      }
      return true
    })

    if (children.length) {
      err.children = children
    }

    newErrors.push(err)
  })

  return newErrors
}

export const validateObject = (version, schema) => {
  const validate = ajv.compile(schema)
  const valid = validate(options)
  return valid ? [] : filterErrors(validate.errors)
}

export const validateConfig = (version, schema, config) => {
  const validate = ajv.compile(schema)
  const valid = validate(config)

  return valid ? [] : filterErrors(validate.errors)
}

export const validateConfigs = (version, schema, configs) => {
  const errors = configs.map((config) => validateConfig(version, schema, config))

  errors.forEach((list, idx) => {
    list.forEach(function applyPrefix(err) {
      err.dataPath = `[${idx}]${err.dataPath}`
      if (err.children) {
        err.children.forEach(applyPrefix)
      }
    })
  })

  return errors.reduce((arr, items) => arr.concat(items), [])
}

export const validateOptions = (version, options) => {
  const { configs } = options
  const result = validateRoot(configs)

  return result
}
