import schema from '../../../../../src/schemas/properties/context'
import { allValid, allInvalid } from '../../../../utils'

const validModuleConfigs = [
  { input: 'exists' }, // Absolute
]

const invalidModuleConfigs = [
  { input: './entry.js', error: { type: 'path.absolute' } }, // Relative
  { input: 1, error: { message: '"value" must be a string' } },
]

describe('context', () => {
  allValid(validModuleConfigs, schema)
  // allInvalid(invalidModuleConfigs, schema)
})

