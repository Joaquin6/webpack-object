const path = require('path')
const DirectoryNamedWebpackPlugin = require('directory-named-webpack-plugin');


/**
 * This is a minimal reproduction from https://github.com/caojinli/prodoc/blob/master/build/webpack.config.js
 * to reproduce the error that was discussed in https://github.com/reactjs/redux/issues/1681
 */

module.exports = {
  target: 'web',
  resolve: {
    // Will throw because babel-cli exists in mocked node_modules
    // (see rules/no-root-files-node-modules-nameclash at the top)
    // root: path.join(__dirname, 'exists-with-babel-cli-js'),
    modules: [path.join(__dirname, 'exists-with-babel-cli-js')],
    plugins: [new DirectoryNamedWebpackPlugin()],
    extensions: ['.js', '.jsx', '.json'],
  },
}
