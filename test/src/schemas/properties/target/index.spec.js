import schema from '../../../../../src/schemas/properties/target'
import { allValid, allInvalid } from '../../../../utils'

const validConfigs = [
  { input: 'web' },
]

const invalidConfigs = [
  {
    input: 'foo',
    error: {
      message: '"value" must be one of [web, webworker, node, async-node, node-webkit, electron]',
    },
  },
]

describe('target', () => {
  allValid(validConfigs, schema)
  // allInvalid(invalidConfigs, schema)
})

