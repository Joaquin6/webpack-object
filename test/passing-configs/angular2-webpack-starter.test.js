// @AngularClass

import path from 'path'

// Webpack Plugins
import { DefinePlugin, ProvidePlugin } from 'webpack'
import DirectoryNamedWebpackPlugin from 'directory-named-webpack-plugin'

const { NODE_ENV: ENV = 'test' } = process.env

// Helper functions
function root(args) {
  args = Array.prototype.slice.call(arguments, 0)
  return path.resolve(...[__dirname].concat(args))
}
function rootNode(args) {
  args = Array.prototype.slice.call(arguments, 0)
  return root.apply(path, ['node_modules'].concat(args))
}
function prepend(extensions, args = []) {
  if (!Array.isArray(args)) {
    args = [args]
  }
  return extensions.reduce((memo, val) =>
    memo.concat(val, args.map((prefix) => prefix + val)), [])
}


export default {
  resolve: {
    plugins: [new DirectoryNamedWebpackPlugin()],
    // cache: false,
    extensions: prepend(['.ts', '.js', '.json', '.css', '.html'], '.async'), // ensure .async.ts etc also works
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        enforce: 'pre',
        use: 'tslint-loader',
        exclude: [root('node_modules')],
      },
      {
        test: /\.js$/,
        enforce: 'pre',
        use: 'source-map-loader',
        exclude: [root('node_modules/rxjs')],
      },
      {
        test: /\.async\.ts$/,
        exclude: [/\.(spec|e2e)\.ts$/],
        use: [{ loader: 'es6-promise-loader' }, { loader: 'ts-loader' }],
      },
      {
        test: /\.ts$/,
        exclude: [/\.e2e\.ts$/],
        use: [
          {
            loader: 'ts-loader',
            query: {
              compilerOptions: {
                noEmitHelpers: true,
                removeComments: true,
              },
            },
          },
        ],
      },
      { test: /\.json$/, use: 'json-loader' },
      { test: /\.html$/, use: 'raw-loader' },
      { test: /\.css$/, use: 'raw-loader' },
      {
        test: /\.(js|ts)$/,
        enforce: 'post',
        include: root('src'),
        use: 'istanbul-instrumenter-loader',
        exclude: [
          /\.(e2e|spec)\.ts$/,
          /node_modules/,
        ],
      },
    ],
    noParse: /zone.js\/dist|angular2\/bundles/,
  },
  stats: { colors: true, reasons: true },
  // debug: false,
  plugins: [
    new DefinePlugin({
      // Environment helpers
      'process.env': {
        ENV: JSON.stringify(ENV),
        NODE_ENV: JSON.stringify(ENV),
      },
    }),
    new ProvidePlugin({
      // TypeScript helpers
      __metadata: 'ts-helper/metadata',
      __decorate: 'ts-helper/decorate',
      __awaiter: 'ts-helper/awaiter',
      __extends: 'ts-helper/extends',
      __param: 'ts-helper/param',
      Reflect: 'es7-reflect-metadata/src/global/browser',
    }),
  ],
  // we need this due to problems with es6-shim
  node: {
    global: false,
    module: false,
    clearImmediate: false,
    setImmediate: false,
  },
}
