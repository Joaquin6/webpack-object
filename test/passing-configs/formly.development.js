/* eslint-env node */

import here from 'path-here'
import webpack from 'webpack'
import { filter, merge } from 'lodash'
import WebpackNotifierPlugin from 'webpack-notifier'

const packageJson = {
  name: 'formly',
  version: '0.0.0',
  contributors: [],
};

const getJavaScriptLoader = () => ({
  test: /\.js$/,
  exclude: /node_modules/,
  use: [{
    loader: 'ng-annotate-loader'
  }, {
    loader: 'babel-loader'
  }, {
    loader: 'eslint-loader',
    options: {
      configFile: './other/src.eslintrc'
    }
  }],
});

const getHtmlLoader = () => ({
  test: /\.html$/,
  exclude: /node_modules/,
  use: [{loader: 'raw-loader'}],
});

const getCommonPlugins = () => (filter([
  new webpack.BannerPlugin('string stuff'),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    VERSION: JSON.stringify(packageJson.version)
  }),
  process.env.CI ? undefined : new WebpackNotifierPlugin({
    title: 'angular-formly',
    contentImage: here('other/logo/angular-formly-logo-64px.png')
  })
]));

const getDevConfig = () => ({
  output: {
    filename: 'dist/formly.js'
  },
  module: {
    rules: [
      getJavaScriptLoader(),
      getHtmlLoader()
    ]
  },
  plugins: getCommonPlugins()
});

const getCommonConfig = () => ({
  context: process.cwd(),
  entry: './configs.js',
  output: {
    libraryTarget: 'umd',
    library: 'ngFormly'
  },
  stats: {
    colors: true,
    reasons: true
  },
  resolve: {
    extensions: ['.js'],
    alias: {
      'angular-fix': here('src/angular-fix')
    }
  },
  // eslint: {
  //   emitError: true,
  //   failOnError: true,
  //   failOnWarning: false,
  //   quiet: true
  // },
  externals: {
    angular: 'angular',
    'api-check': {
      root: 'apiCheck',
      amd: 'api-check',
      commonjs2: 'api-check',
      commonjs: 'api-check'
    }
  }
});

const getConfig = () => merge(getCommonConfig(), getDevConfig());

export default getConfig();
