import webpackObject, { getWebpackOptionsSchema } from '../../src/webpack-object';

describe('Webpack Object', () => {
  it('should read correct webpackOptionsSchema.json file ', async () =>
    expect(await getWebpackOptionsSchema('v3'))
      .to.have.all.keys('additionalProperties', 'definitions', 'properties', 'required', 'type'));
});
