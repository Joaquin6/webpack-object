import schemaFn, {
  CONDITION_MESSAGE,
  LOADERS_QUERY_MESSAGE,
  LOADER_IN_LOADERS_MESSAGE,
} from '../../../../../src/schemas/properties/module'
import { allValid, allInvalid } from '../../../../utils'

const validModuleConfigs = [
  {
    input: {
      rules: [
        { test: 'foo', include: /src/, use: 'babel-loader' },
      ],
    },
  },
  {
    input: {
      rules: [
        { test: /\.less$/, use: 'style-loader!css-loader!autoprefixer-loader!less-loader' },
      ],
    },
  },
  {
    input: {
      rules: [
        { test: /\.(?:eot|ttf|woff2?)$/, use: ['file-loader'] },
      ],
    },
  },
  {
    input: {
      rules: [
        { test: (absPath) => absPath && true, use: ['file-loader'] },
      ],
    },
  },
  {
    input: {
      rules: [
        { test: /foo/, use: ['file-loader'] },
      ],
    },
  },
  {
    // should allow both `include` and `exclude with the rule 'loader-enforce-include-or-exclude'
    input: {
      rules: [{ test: /foo/, use: 'foo', include: 'foo', exclude: 'bar' }],
    },
    schema: schemaFn({ rules: { 'loader-enforce-include-or-exclude': true } }),
  },
  {
    // should be fine with `include` with rule 'loader-enforce-include-or-exclude'
    input: {
      rules: [{ test: /foo/, loader: 'foo', include: 'foo' }],
    },
    schema: schemaFn({ rules: { 'loader-prefer-include': true } }),
  },
  {
    // should allow mix of objects and strings in `loaders` array
    input: {
      rules: [
        {
          test: /foo/,
          use: [{ loader: 'style-loader' }, { loader: 'file-loader' }],
        },
      ],
    },
  },
]

const invalidModuleConfigs = [
  {
    input: {
      rules: [
        { include: /bar/, use: 'babel' },
      ],
    },
    error: { message: '"test" is required' },
  },
  {
    input: {
      rules: [
        { test: 'foo', include: 1, use: 'babel' },
      ],
    },
    error: { message: `"include" ${CONDITION_MESSAGE}` },
  },
  {
    input: {
      rules: [
        { test: /\.less$/, use: 'style-loader!css-loader!autoprefixer-loader!less-loader' },
      ],
    },
    error: { message: '"loaders" must be an array' },
  },
  {
    input: {
      rules: [
        { test: /\.less$/, use: [1, 2] },
      ],
    },
    error: {
      message: LOADER_IN_LOADERS_MESSAGE,
      path: 'rules.0.use.0',
    },
  },
  {
    input: {
      rules: [{ test: /\.(?:eot|ttf|woff2?)$/, use: ['file-loader'] }],
    },
    error: { message: '"loader" must be a string' },
  },
  {
    input: {
      rules: [{ test: /\.(?:eot|ttf|woff2?)$/, use: ['file-loader'], loader: 'style' }],
    },
    error: { message: '"value" contains a conflict between exclusive peers [loaders, loader]' },
  },
  {
    input: {
      rules: [{ test: (foo, bar) => `${foo}-${bar}`, use: ['file-loader'] }],
    },
    // Only 1-arity functions are allowed
    error: { message: `"test" ${CONDITION_MESSAGE}` },
  },
  {
    input: {
      rules: [{ query: { foo: 'bar' }, use: ['file-loader'], test: /foo/ }],
    },
    // query can only be supplied when `loader` property is supplied
    error: { message: `"value" ${LOADERS_QUERY_MESSAGE}` },
  },
  {
    input: {
      rules: [{ test: /foo/ }],
    },
    error: { message: '"value" must contain at least one of [loaders, loader]' },
  },
  {
    input: {
      rules: [{ test: /foo/, use: 'foo', query: 'query' }],
    },
    error: { message: '"query" must be an object' },
  },
  {
    // doesn't include `include`
    input: {
      rules: [{ test: /foo/, use: 'foo' }],
    },
    schema: schemaFn({ rules: { 'loader-prefer-include': true } }),
  },
  {
    // includes `exclude` and `include`, should only use `include`
    input: {
      rules: [{ test: /foo/, use: 'foo', include: 'foo', exclude: 'bar' }],
    },
    schema: schemaFn({ rules: { 'loader-prefer-include': true } }),
  },
  {
    // includes `exclude`, should prefer `include`
    input: {
      rules: [{ test: /foo/, use: 'foo', exclude: 'bar' }],
    },
    schema: schemaFn({ rules: { 'loader-prefer-include': true } }),
  },
  {
    // should use either `include` or `exclude
    input: {
      rules: [{ test: /foo/, use: 'foo' }],
    },
    schema: schemaFn({ rules: { 'loader-enforce-include-or-exclude': true } }),
  },
  {
    // should enforce `loader` property, if object is found in `loaders` array
    input: {
      rules: [{
        test: /foo/,
        use: [
          { query: { foo: 'bar' } },
        ],
      }],
    },
    error: {
      message: LOADER_IN_LOADERS_MESSAGE,
      path: 'rules.0.use.0',
    },
  },
  {
    // should disallow properties, other than `loader` and `query`
    // in objects inside the `loaders` array
    input: {
      rules: [{
        test: /foo/,
        use: [
          { use: 'foo', query: { foo: 'bar' }, include: /foo/ },
        ],
      }],
    },
    error: {
      message: LOADER_IN_LOADERS_MESSAGE,
      path: 'rules.0.use.0',
    },
  },
]

const moduleSchema = schemaFn({
  rules: {
  },
})

describe('module', () => {
  allValid(validModuleConfigs, moduleSchema)
  // allInvalid(invalidModuleConfigs, moduleSchema)
})
