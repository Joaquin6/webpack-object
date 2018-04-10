import { DefinePlugin } from 'webpack'

export default {
  output: {
    library: 'History',
    libraryTarget: 'umd'
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: [{
        loader: 'babel-loader',
        options: {
          stage: 0,
          loose: 'all',
          plugins: ['dev-expression']
        }
      }]
    }]
  },
  node: {
    Buffer: false
  },
  plugins: [
    new DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    })
  ]
}

