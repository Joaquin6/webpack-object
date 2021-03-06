// @AngularClass

/*
 * Helper: root(), and rootDir() are defined at the bottom
 */
const path = require('path')
const zlib = require('zlib')
// Webpack Plugins
let webpack,
  { DefinePlugin, ProvidePlugin } = require('webpack')
// var OccurenceOrderPlugin = require('webpack/lib/optimize/OccurenceOrderPlugin');
// var DedupePlugin = require('webpack/lib/optimize/DedupePlugin');
// var CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
const WebpackMd5Hash = require('webpack-md5-hash')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyWebpackPlugin = require('uglifyjs-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const DirectoryNamedWebpackPlugin = require('directory-named-webpack-plugin')

const { HOST = 'localhost', PORT = 8080, NODE_ENV: ENV = 'production' } = process.env

const metadata = {
  title: 'Angular2 Webpack Starter by @gdi2990 from @AngularClass',
  baseUrl: '/',
  host: HOST,
  port: PORT,
  ENV: ENV,
}

// Helper functions
function gzipMaxLevel(buffer, callback) {
  return zlib.gzip(buffer, { level: 9 }, callback)
}

function root(args) {
  args = Array.prototype.slice.call(arguments, 0)
  return path.resolve(...[__dirname].concat(args))
}

function rootNode(args) {
  args = Array.prototype.slice.call(arguments, 0)
  return root.apply(path, ['node_modules'].concat(args))
}

function prepend(extensions, args) {
  args = args || []
  if (!Array.isArray(args)) { args = [args] }
  return extensions.reduce((memo, val) => memo.concat(val, args.map((prefix) => prefix + val)), [])
}

export default {
  // static data for index.html
  // metadata: metadata,
  // for faster builds use 'eval'
  devtool: 'source-map',
  // debug: false,

  //entry: {
  //'polyfills':'./src/polyfills.ts',
  //'main':'./src/main.ts' // our angular app
  //},

  // Config for our build files
  output: {
    path: root('exists'),
    filename: '[name].[chunkhash].bundle.js',
    sourceMapFilename: '[name].[chunkhash].bundle.map',
    chunkFilename: '[id].[chunkhash].chunk.js',
  },

  resolve: {
    plugins: [new DirectoryNamedWebpackPlugin()],
    modules: [root('exists')],
    // cache: false,
    // ensure loader extensions match
    extensions: prepend(['.ts', '.js', '.json', '.css', '.html'], '.async'), // ensure .async.ts etc also works
  },

  module: {
    rules: [
      // Support Angular 2 async routes via .async.ts
      {
        test: /\.ts$/,
        enforce: 'pre',
        exclude: [root('node_modules')],
        use: [{
          loader: 'tslint-loader',
        }],
      },
      {
        test: /\.js$/,
        enforce: 'pre',
        exclude: [root('node_modules/rxjs')],
        use: [{
          loader: 'source-map-loader',
        }],
      },
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
        use: [
          {
            loader: 'ts-loader',
            query: {
              // remove TypeScript helpers to be injected below by DefinePlugin
              compilerOptions: {
                removeComments: true,
                noEmitHelpers: true,
              },
            },
          },
        ],
      },

      // Support for *.json files.
      { test: /\.json$/,
        use: [{ loader: 'json-loader' }] },

      // Support for CSS as raw text
      { test: /\.css$/,
        use: [{ loader: 'raw-loader' }] },

      // support for .html as raw text
      { test: /\.html$/,
        exclude: [root('src/index.html')],
        use: [{ loader: 'raw-loader' }] },

      // if you add a loader include the file extension
    ],
  },

  // optimization: {
  //   splitChunks: {
  //     name: 'polyfills',
  //     filename:
  //     'polyfills.[chunkhash].bundle.js',
  //     minChunks: Infinity
  //   }
  // },

  plugins: [
    new WebpackMd5Hash(),
    // new DedupePlugin(),
    // new OccurenceOrderPlugin(true),
    // new CommonsChunkPlugin({
    //   name: 'polyfills',
    //   filename: 'polyfills.[chunkhash].bundle.js',
    //   chunks: Infinity
    // }),
    // static assets
    new CopyWebpackPlugin([
      {
        from: 'src/assets',
        to: 'assets',
      },
    ]),
    // generating html
    new HtmlWebpackPlugin({ template: 'src/index.html' }),
    new DefinePlugin({
      // Environment helpers
      'process.env': {
        ENV: JSON.stringify(metadata.ENV),
        NODE_ENV: JSON.stringify(metadata.ENV),
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
    new UglifyWebpackPlugin({
      uglifyOptions: {
        output: {
          // disable mangling because of a bug in angular2 beta.1, beta.2 and beta.3
          // TODO(mastertinner): enable mangling as soon as angular2 beta.4 is out
          // mangle: { screw_ie8 : true },//prod
          mangle: false,
          beautify: false, //prod
          comments: false, //prod
        },
        // to debug prod builds uncomment //debug lines and comment //prod lines

        // beautify: true,//debug
        // mangle: false,//debug
        // dead_code: false,//debug
        // unused: false,//debug
        // deadCode: false,//debug
        // compress : { screw_ie8 : true, keep_fnames: true, drop_debugger: false, dead_code: false, unused: false, }, // debug
        // comments: true,//debug

        compress: { screw_ie8: true }, //prod
      },
    }),
    // include uglify in production
    new CompressionPlugin({
      algorithm: gzipMaxLevel,
      regExp: /\.css$|\.html$|\.js$|\.map$/,
      threshold: 2 * 1024,
    }),
  ],
  // Other module loader config
  // tslint: {
  //   emitErrors: true,
  //   failOnHint: true
  // },
  // don't use devServer for production

  // we need this due to problems with es6-shim
  node: {
    global: 'window',
    module: false,
    clearImmediate: false,
    setImmediate: false,
  },
}
