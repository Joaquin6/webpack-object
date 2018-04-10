import util from 'util'
import chalk from 'chalk'
import validate from '../../src/schemas/index.js'

/**
 * For all supplied configs (array of objects), check that they are valid given a schema.
 */
export default (configs, schema) => {
  configs.forEach((input) => {
    if (!Object.prototype.hasOwnProperty.call(input, 'input')) {
      throw new Error(
        'Please supply the valid config object like `{ input: <valid-config-object> }`.' +
        `You passed ${JSON.stringify(input)}`
      )
    }

    const { input: validConfig, schema: schemaOverride } = input

    it(`: ${chalk.gray(util.inspect(validConfig, false, null))} should be valid`, () => {
      const result = validate(validConfig, {
        schema: schemaOverride || schema,
        returnValidation: true,
      })
      if (result.error) {
        throw new Error(result.error.annotate())
      }
    })
  })
}
