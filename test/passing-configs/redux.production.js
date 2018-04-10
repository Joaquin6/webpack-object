

const webpack = require('webpack')
const UglifyWebpackPlugin = require('uglifyjs-webpack-plugin')

const env = process.env.NODE_ENV
const config = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  output: {
    library: 'Redux',
    libraryTarget: 'umd',
  },
  plugins: [
    // new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env),
    }),
  ],
}

//if (env === 'production') {
config.plugins.push(
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

      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        screw_ie8: true,
        warnings: false,
      }, //prod
    },
  }),
)
//}

module.exports = config

