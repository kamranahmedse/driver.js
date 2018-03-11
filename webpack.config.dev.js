const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: [
    'webpack-dev-server/client?http://localhost:3000',
    './demo/styles/demo.scss',
    './src/index.js',
  ],
  output: {
    path: path.join(__dirname, '/dist'),
    publicPath: '/dist/',
    filename: 'driver.js',
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
          presets: ['env'],
          plugins: ['babel-plugin-add-module-exports'],
        },
      },
      {
        test: /.scss$/,
        loader: ExtractTextPlugin.extract(['css-loader?url=false', 'sass-loader']),
      },
    ],
  },
  plugins: [
    new ExtractTextPlugin({
      filename: 'demo.css',
      allChunks: true,
    }),
    new CopyWebpackPlugin([
      './demo/scripts/emoji.js',
      './demo/scripts/demo.js',
      './demo/images/separator.png',
    ]),
  ],
  stats: {
    colors: true,
  },
  devtool: 'cheap-module-eval-source-map',
};
