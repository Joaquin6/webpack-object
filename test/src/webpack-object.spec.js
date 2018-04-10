import webpackObject, {
  getWebpackOptionsSchema,
} from '../../src/webpack-object'

import configs from '../passing-configs'
import failingConfigs from '../failing-configs'

describe('Webpack Object', () => {
  let options
  let version

  beforeEach(() => {
    version = 'v4'
    options = {}
  })

  configs.forEach(({ config, name }) => {
    it(`generate webpack config object from given options from "${name}"`, () => {
      options.configs = config
      assert(webpackObject(4, options))
    })
  })

  it('should read correct webpackOptionsSchema.json file ', async () =>
    expect(await getWebpackOptionsSchema('v3'))
      .to.have.all.keys('additionalProperties', 'definitions', 'properties', 'required', 'type'))
})
