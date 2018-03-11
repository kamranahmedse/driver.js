const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: [
    'webpack-dev-server/client?http://localhost:3000',
    './demo/demo.scss',
    './src/index.js',
  ],
  output: {
    path: path.join(__dirname, '/dist'),
    publicPath: '/dist/',
    filename: 'sholo.js',
    libraryTarget: 'umd',
    library: 'Sholo',
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
        loader: ExtractTextPlugin.extract(['css-loader', 'sass-loader']),
      },
    ],
  },
  plugins: [
    new ExtractTextPlugin({
      filename: 'demo.css',
      allChunks: true,
    }),
    new CopyWebpackPlugin([
      './demo/demo.js',
      './demo/emoji.js',
    ]),
  ],
  stats: {
    colors: true,
  },
  devtool: 'cheap-module-eval-source-map',
};
