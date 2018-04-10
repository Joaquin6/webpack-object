/**
 * https://github.com/jonathanewerner/pac
 * An Electron packager manager desktop app
 */

const path = require('path');
const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyWebpackPlugin = require('uglifyjs-webpack-plugin');

const lessModuleLoader = (prod) => {
  const useLoaders = [{ loader: 'style-loader' }];

  if (prod) {
    useLoaders.push(ExtractTextPlugin.extract('style-loader', {
      loader: 'css-loader',
      options: {
        modules: true,
        postcss: true,
        less: true,
      }
    }, {
      publicPath: ''
    }));
  } else {
    useLoaders.push({
      loader: 'css-loader',
      options: {
        modules: true,
        localIdentName: '[name]__[local]___[hash:base64:5]',
        postcss: true,
        less: true,
      }
    });
  }

  return {
    test: /\.less.module$/,
    use: useLoaders,
  };
};

export const makeConfig = ({production}) => ({
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: ['node_modules', 'src'],
  },
  entry: {
    app: production
      ? ['./configs.js']
      : ['webpack-hot-middleware/client?path=http://localhost:3000/__webpack_hmr&reload=true', './configs.js'],
  },
  output: {
    path: path.join(__dirname, 'exists'),
    publicPath: '/public/',
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: /src/,
        use: [{loader: 'babel-loader'}],
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'autoprefixer-loader',
            options: {
              browsers:['last 2 version']
            }
          },
          {
            loader: 'less-loader'
          }
        ]
      },
      {
        test: /\.(?:eot|ttf|woff2?)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name]-[hash:6].[ext]',
              context: 'assets'
            }
          }
        ]
      },
    ].concat([
      lessModuleLoader(false),
    ]),
  },
  // postcss: function() {
  //   return [autoprefixer({browsers: ['last 2 versions']})];
  // },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {NODE_ENV: JSON.stringify(process.env.NODE_ENV)},
    }),

    // Moment.js imports the locales dynamically which is why webpack will include all 60 locales (>300kb)
    // if we don't override this behaviour.
    // Here we "whitelist" the paths that will be imported when moment/locales/* is imported
    // We tell it that we are interested in de, en-gb, da & nl. Afrikaans etc. will stay out. :)
    // This results in a bundle size reduction of 300kb / 150KB minified
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /(de|en-gb|da|nl)$/),
  ].concat(production ? [
    new UglifyWebpackPlugin({
      // compress: {drop_console: true},
      sourceMap: false, // This means dropping build time from ~45 sec to ~32 sec
    })] : []),
  devtool: 'hidden-source-map',
});

export default makeConfig({production: true});
