import schema from '../../../../../src/schemas/properties/node'
import { allValid, allInvalid } from '../../../../utils'

const validModuleConfigs = [
  { input: { console: true } },
  { input: { global: true } },
  { input: { Buffer: true } },
  { input: { process: 'mock' } },
  { input: { __filename: true } },
  { input: { __dirname: false } },
  { input: { foo: 'mock' } },
]

const invalidModuleConfigs = [
  { input: [1], error: { } },
]

describe('node', () => {
  allValid(validModuleConfigs, schema)
  // allInvalid(invalidModuleConfigs, schema)
})

