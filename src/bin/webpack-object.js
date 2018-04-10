#!/usr/bin/env node

import path from 'path'
import fs from 'fs-extra'

import log from 'npmlog'
import program from 'commander'

import validateConfig from './validate-config'
import validateAllScripts from './validate-all-scripts'

let configFile

program
  .arguments('<configFileName>')
  .option('-a, --all-scripts', 'Validate all configurations from package.json scripts')
  .option('-q, --quiet', 'Quiet output')
  .action((configFileName) => {
    configFile = configFileName
  })

program.parse(process.argv)

function errorHandler(err) {
  if (err.isJoi && err.name === 'ValidationError' && err.annotate) {
    log.error(err.annotate())
  } else {
    log.error(err.message)
  }
  process.exit(1)
}

function validateFile(config, quiet) {
  fs.stat(configFile, (err, stats) => {
    if (err) {
      err.message = `Could not find file "${configFile}"` // eslint-disable-line no-param-reassign
      errorHandler(err)
    } else if (stats.isFile()) {
      const validationResult = validateConfig(config, quiet)

      if (validationResult.error) {
        console.info(validationResult.error.annotate())
        process.exit(1)
      } else {
        if (!quiet) { console.info(`${config} is valid`) }
        process.exit(0)
      }
    } else {
      const error = new Error(`Could not find file "${configFile}"`)
      error.type = 'EISDIR'
      errorHandler(error)
    }
  })
}

if (program.allScripts) {
  const pkg = require(path.join(process.cwd(), './package.json'))

  validateAllScripts(pkg.scripts, program.quiet)
} else if (!configFile) {
  const error = new Error(['No configuration file given',
    'Usage: webpack-object-cli <configFileName>'].join('\n'))
  error.type = 'EUSAGE'
  errorHandler(error)
} else {
  validateFile(configFile, program.quiet)
}
