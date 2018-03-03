const path = require('path');

module.exports = {
  mode: 'development',
  entry: [
    './assets/scripts/src/sholo.js',
  ],
  output: {
    publicPath: '/assets/scripts/dist/',
    path: path.join(__dirname, 'dist'),
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
    ],
  },
  stats: {
    colors: true,
  },
  devtool: 'source-map',
};
