// @AngularClass

/*
 * Helper: root(), and rootDir() are defined at the bottom
 */
import path from 'path'

import webpack from 'webpack'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import DirectoryNamedWebpackPlugin from 'directory-named-webpack-plugin'

const { NODE_ENV: ENV = 'development' } = process.env

// Helper functions

function root(args) {
  args = Array.prototype.slice.call(arguments, 0)
  return path.resolve(...[__dirname].concat(args))
}

function prepend(extensions, args = []) {
  if (!Array.isArray(args)) { args = [args] }
  return extensions.reduce((memo, val) =>
    memo.concat(val, args.map((prefix) => prefix + val)), [])
}
function rootNode(args) {
  args = Array.prototype.slice.call(arguments, 0)
  return root.apply(path, ['node_modules'].concat(args))
}

const metadata = {
  ENV,
  title: 'Angular2 Webpack Starter by @gdi2990 from @AngularClass',
  baseUrl: '/',
  host: 'localhost',
  port: 3000,
}

export default {
  // static data for index.html
  // metadata: metadata,
  // for faster builds use 'eval'
  devtool: 'source-map',
  // debug: true,
  cache: false,

  // our angular app
  //entry: { 'polyfills': './src/polyfills.ts', 'main': './src/main.ts' },

  // Config for our build files
  output: {
    path: root('exists'),
    filename: '[name].bundle.js',
    sourceMapFilename: '[name].map',
    chunkFilename: '[id].chunk.js',
  },

  resolve: {
    // ensure loader extensions match
    extensions: prepend(['.ts', '.js', '.json', '.css', '.html'], '.async'), // ensure .async.ts etc also works
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        enforce: 'pre',
        use: 'tslint-loader',
        exclude: [root('node_modules')],
      },
      // TODO(gdi2290): `exclude: [ root('node_modules/rxjs') ]` fixed with rxjs 5 beta.2 release
      {
        test: /\.js$/,
        enforce: 'pre',
        exclude: [
          root('node_modules/rxjs'),
        ],
        use: 'source-map-loader',
      },
      // Support Angular 2 async routes via .async.ts
      {
        test: /\.async\.ts$/,
        exclude: [/\.(spec|e2e)\.ts$/],
        use: [{
          loader: 'es6-promise-loader',
        }, {
          loader: 'ts-loader',
        }],
      },
      // Support for .ts files.
      {
        test: /\.ts$/,
        exclude: [/\.(spec|e2e|async)\.ts$/],
        use: [{
          loader: 'ts-loader',
        }],
      },
      // Support for CSS as raw text
      {
        test: /\.css$/,
        use: [{
          loader: 'raw-loader',
        }],
      },
      // support for .html as raw text
      {
        test: /\.html$/,
        use: [{
          loader: 'raw-loader',
        }],
        exclude: [
          root('src/index.html'),
        ],
      },

      // if you add a loader include the resolve file extension above
    ],
  },

  // optimization: {
  //   splitChunks: { name: 'polyfills', filename: 'polyfills.bundle.js', minChunks: Infinity }
  // },

  plugins: [
    // new webpack.optimize.OccurenceOrderPlugin(true),
    // new webpack.optimize.CommonsChunkPlugin({ name: 'polyfills', filename: 'polyfills.bundle.js', minChunks: Infinity }),
    // static assets
    new CopyWebpackPlugin([{ from: 'src/assets', to: 'assets' }]),
    // generating html
    new HtmlWebpackPlugin({ template: 'src/index.html' }),
    // replace
    new webpack.DefinePlugin({
      'process.env': {
        ENV: JSON.stringify(metadata.ENV),
        NODE_ENV: JSON.stringify(metadata.ENV),
      },
    }),
  ],

  // Other module loader config
  // tslint: {
  //   emitErrors: false,
  //   failOnHint: false,
  //   resourcePath: 'src'
  // },

  // our Webpack Development Server config
  devServer: {
    port: metadata.port,
    host: metadata.host,
    // contentBase: 'src/',
    historyApiFallback: true,
    watchOptions: { aggregateTimeout: 300, poll: 1000 },
  },
  // we need this due to problems with es6-shim
  node: {
    global: 'window',
    module: false,
    clearImmediate: false,
    setImmediate: false,
  },
}
