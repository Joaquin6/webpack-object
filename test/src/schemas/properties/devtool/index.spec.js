import schema from '../../../../../src/schemas/properties/devtool'
import { allValid, allInvalid } from '../../../../utils'

const validModuleConfigs = [
  { input: 'eval' },
  { input: '#@eval' },
  { input: '#cheap-module-eval-source-map' },
  { input: '#cheap-module-inline-source-map' },
  { input: 'hidden-source-map' },
  { input: 'inline-source-map' },
  { input: 'eval-source-map' },
  { input: 'cheap-source-map' },
  { input: 'hidden-source-map' },
  { input: false },
]

const invalidModuleConfigs = [
  { input: 'foo', error: { } },
  { input: 'eval-source-map-foo', error: { } },
  { input: 'foo-cheap-source-map', error: { } },
  { input: '#@eval-foo', error: { } },
  { input: 'false', error: { } },
  { input: true, error: { } },
]

describe('devtool', () => {
  allValid(validModuleConfigs, schema)
  // allInvalid(invalidModuleConfigs, schema)
})
