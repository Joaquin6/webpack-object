
const getErrorMsg = (shouldBeAbsolute, data) =>
  (shouldBeAbsolute ? `The provided value ${JSON.stringify(data)} is not an absolute path!`
    : `A relative path is expected. The provided value ${JSON.stringify(data)} is an absolute path!`)

const getErrorFor = (shouldBeAbsolute, data, schema) => ({
  keyword: 'absolutePath',
  params: { absolutePath: data },
  message: getErrorMsg(shouldBeAbsolute, data),
  parentSchema: schema,
})

export default (ajv) => ajv.addKeyword('absolutePath', {
  errors: true,
  type: 'string',
  compile(expected, schema) {
    function callback(data) {
      const passes = expected === /^(?:[A-Za-z]:\\|\/)/.test(data)
      if (!passes) {
        callback.errors = [getErrorFor(expected, data, schema)]
      }
      return passes
    }
    callback.errors = []
    return callback
  },
})
