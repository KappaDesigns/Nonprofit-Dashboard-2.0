const path = require('path');
const util = require('./src/util/');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const c = util.readConfigSync();
let webpackConfig = c.webpack;

module.exports = {
	output: {
		path: path.resolve(__dirname, webpackConfig.output),
		filename: `[name].${webpackConfig.filename}`,
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /(node_modules|bower_components)/,
			},
			{
				test: /\.jsx$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.css$/,
				use: [
					'style-loader',
					'css-loader',
				],
			},
			{
				test: /\.(png|svg|jpg|gif)$/,
				loader: 'file-loader',
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/,
				loader: 'file-loader',
			},
			{
				test: /\.html$/,
				loader: 'html-loader',
			},
		],
	},
	plugins: [
		new webpack.ProgressPlugin(),
		new HtmlWebpackPlugin({
			title: `${c.site} Admin Panel`,
			template: path.resolve(__dirname, './src/app/src/index.html'),
		}),
		new CleanWebpackPlugin(['build']),
	],
};