const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  mode: 'production',
  entry: [
    './src/driver.scss',
    './src/index.js',
  ],
  output: {
    path: path.join(__dirname, '/../dist'),
    publicPath: '/dist/',
    filename: 'driver.min.js',
    libraryTarget: 'umd',
    library: 'Driver',
    libraryExport: 'default',
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
                '@babel/preset-env', {
                  targets: {
                    "chrome": "99",
                    "ie": "8"   // target for IE 8 ~ MS WebBrowser control
                  }, debug: false
                }
              ]
            ],
            "retainLines": true,
            "plugins": [ "@babel/plugin-transform-member-expression-literals" ],
            "cacheDirectory": true
          }
      },
      {
        test: /.scss$/,
        loader: ExtractTextPlugin.extract([
          {
            loader: 'css-loader',
            options: { url: false },
          },
          {
            loader: 'postcss-loader',
            options: { 
              postcssOptions: {
                ident: 'postcss',
                plugins: [require('autoprefixer')()], // eslint-disable-line global-require
              }
            },
          },
          'sass-loader',
        ]),
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({
          terserOptions: {
            compress: true,
            /* compress: {
              defaults: true,
              properties: false,    // important: don't rewrite property access using the dot notation, e.g. foo["bar"] → foo.bar
            },*/
            //mangle: true,
            keep_fnames: false,
            keep_classnames: true,
            ie8: true,
          }
        })],
  },
  plugins: [
    new ExtractTextPlugin({
      filename: 'driver.min.css',
      allChunks: true,
    }),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.min\.css$/g,
      // eslint-disable-next-line global-require
      cssProcessor: require('cssnano'),
      cssProcessorPluginOptions: {
        preset: [
          'default',
          {
            discardComments: { removeAll: true },
          },
        ],
      },
      canPrint: true, // A boolean indicating if the plugin can print messages to the console,
    }),
  ],
  stats: {
    colors: true,
  },
  devtool: 'cheap-module-source-map',
  node: {
    Buffer: false,
    process: false,
  },
};
