import schema from '../../../../../src/schemas/properties/plugins'
import { allValid, allInvalid } from '../../../../utils'

const validModuleConfigs = [
  {
    input: [
      () => {},
      {},
    ],
  },
]

const invalidModuleConfigs = [
  { input: 1, error: { } },
]

describe('plugins', () => {
  allValid(validModuleConfigs, schema)
  // allInvalid(invalidModuleConfigs, schema)
})

