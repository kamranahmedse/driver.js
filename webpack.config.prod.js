const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: [
    './src/index.js',
    './src/sholo.scss',
  ],
  output: {
    path: path.join(__dirname, '/dist'),
    publicPath: '/dist/',
    filename: 'sholo.min.js',
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
        },
      },
      {
        test: /.scss$/,
        loader: ExtractTextPlugin.extract([
          {
            loader: 'css-loader',
            options: { minimize: true },
          },
          'sass-loader',
        ]),
      },
    ],
  },
  plugins: [
    new ExtractTextPlugin({
      filename: 'sholo.min.css',
      allChunks: true,
    }),
  ],
  stats: {
    colors: true,
  },
  devtool: 'cheap-module-source-map',
};
