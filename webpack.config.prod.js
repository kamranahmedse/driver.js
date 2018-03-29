const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
	mode: 'production',
	entry: [
		'./src/themes/default.scss',
		'./src/themes/material.scss',
		'./src/index.js'
	],
	output: {
		path: path.join(__dirname, '/dist'),
		publicPath: '/dist/',
		filename: 'driver.min.js',
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
				use: [
					{
						loader: 'file-loader',
						options: {
							name: 'driver.[name].min.css',
							context: './themes/'
						}
					},
					{
						loader: 'extract-loader',
						options: {
							publicPath: './'
						}
					},
					{
						loader: 'css-loader',
						options: {
							minimize: true,
							url: false
						}
					},
					{
						loader: 'sass-loader'
					}
				],
			},
		],
	},
	plugins: [
		new ExtractTextPlugin({
			filename: 'driver.min.[name].css',
			allChunks: true,
		}),
	],
	stats: {
		colors: true,
	},
	devtool: 'cheap-module-source-map',
};
