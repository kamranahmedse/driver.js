const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';
const scriptFileName = isProduction ? 'driver-demo.min.js' : 'driver-demo.js';
const styleFileName = isProduction ? 'driver-demo.min.css' : 'driver-demo.css';

module.exports = {
  mode: isProduction ? 'production' : 'development',
  entry: [
    'webpack-dev-server/client?http://localhost:3000',
    './demo/styles/demo.scss',
    './demo/scripts/emoji.js',
    './demo/scripts/demo.js',
    './src/index.js',
  ],
  output: {
    path: path.join(__dirname, '/dist/demo'),
    publicPath: '/dist/demo/',
    filename: scriptFileName,
    libraryTarget: 'umd',
    library: 'Driver',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        enforce: 'pre',
        options: {
          failOnWarning: false,
          failOnError: true,
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [
            [
              'env',
              {
                useBuiltIns: 'usage',
              },
            ],
          ],
          plugins: [
            'babel-plugin-add-module-exports',
            'transform-object-rest-spread',
          ],
        },
      },
      {
        test: /.scss$/,
        loader: ExtractTextPlugin.extract([
          {
            loader: 'css-loader',
            options: { minimize: isProduction, url: false },
          },
          'sass-loader',
        ]),
      },
    ],
  },
  plugins: [
    new ExtractTextPlugin({
      filename: styleFileName,
      allChunks: true,
    }),
    new CopyWebpackPlugin([
      './demo/images/separator.png',
    ]),
  ],
  stats: {
    colors: true,
  },
  devtool: 'cheap-module-eval-source-map',
};
