import schemaFn from '../../../../../src/schemas/properties/resolve'
import { allValid, allInvalid } from '../../../../utils'
import path from 'path'

const problematicRootPaths = [
  // These root paths have items in them that nameclash with node_module packages
  // The `ls` results for these paths have been stubbed in test/setup.js
  // The node_module contents have been stubbed out in rules/no-root-files-node-modules-nameclash
  path.join(__dirname, './exists-with-babel-cli-js'), // contains "babel-cli.js"
  path.join(__dirname, './exists-with-codecov-folder'), // contains "codecov/index.js"
  // contains "node_modules", will be skipped
  path.join(__dirname, './exists-with-node-modules/node_modules'),
]
const validModuleConfigs = [
  { input: { alias: { foo: 'bar' } } },
  { input: { modules: ['node_modules', 'bower_foo'] } },
  { input: { extensions: ['.foo', '.bar'] } },
  { input: { mainFields: ['webpack', 'browser', 'web', 'browserify', ['jam', 'main'], 'main'] } },
  { input: { aliasFields: 'browser' } },
  { input: { aliasFields: ['browser'] } },
  { input: { unsafeCache: [/foo/] } },
  { input: { unsafeCache: /foo/ } },
  { input: { unsafeCache: true } },
  // {
  //   input: {
  //     // These won't throw however because we disabled the rule
  //     root: problematicRootPaths,
  //   },
  //   schema: schemaFn({ rules: { 'no-root-files-node-modules-nameclash': false } }),
  // },
]

const invalidModuleConfigs = [
  { input: { alias: { foo: 1 } } },
  { input: { alias: ['foo'] } },
  // {
  //   // It exists but is not absolute
  //   // file existence stubbed out in test/setup.js
  //   input: { root: './exists' },
  //   schema: schemaFn({ rules: { 'no-root-files-node-modules-nameclash': false } }),
  // },
  // { input: { root: '/does-not-exist' } }, // must exist
  { input: { modulesDirectories: 'node_modules' } },
  { input: { extensions: ['foo', 'bar'] } }, // must have leading dot
  { input: { unsafeCache: false } }, // must have true
  {
    // input: { root: problematicRootPaths },
    error: { type: 'path.noRootFilesNodeModulesNameClash' },
  },
]

const schema = schemaFn({
  rules: {
    'no-root-files-node-modules-nameclash': true,
  },
})

describe('resolve', () => {
  allValid(validModuleConfigs, schema)
  // allInvalid(invalidModuleConfigs, schema)
})

