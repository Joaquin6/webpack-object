import util from 'util'
import chalk from 'chalk'
import validate, { validateRoot, Joi } from '../../src/schemas'

/**
 * For all supplied configs (array of objects), check that they are invalid given a schema.
 */
export default (configs, schema) => {
  configs.forEach(({
    // The config object to be tested
    input: invalidConfig,
    // The expected error
    // Checks are possible on joi error `path`, `type` and `message` properties
    error: expectedError,
    // For debugging reasons: throw the error to inspect its toString output
    throwError = false,
    // Override the schema in order to test for non-default rule configurations
    schema: schemaOverride,
  }) => {
    it(`: ${chalk.gray(util.inspect(invalidConfig, false, null))} should be invalid`, () => {
      if (!invalidConfig) {
        throw new Error('Pass data as `input` property')
      }

      const result = validate(invalidConfig, {
        schema: schemaOverride || schema,
        returnValidation: true,
      })

      assert(result.error)
      const { error: { details } } = result

      console.log(details[0], '\n\n');
      console.log(expectedError);

      // if (throwError) {
      //   throw error
      // }

      assert(details[0])

      if (expectedError) {
        if (expectedError.path) {
          assert(details[0].path === expectedError.path)
        }

        if (expectedError.type) {
          assert(details[0].type === expectedError.type)
        }

        if (expectedError.message) {
          assert(details[0].message === expectedError.message)
        }
      }
    })
  })
}
