import schema from '../../../../../src/schemas/properties/performance'
import { allValid } from '../../../../utils'

const validPerformanceConfigs = [
  { input: { hints: true } },
  { input: { hints: false } },
]

describe('performance', () => {
  allValid(validPerformanceConfigs, schema)
})
