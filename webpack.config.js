const path = require('path');
const util = require('./src/util/');
const webpack = require('webpack');


const c = util.readConfigSync();
let wbpkConfig = c.webpack;

const config = {
	entry: path.resolve(__dirname, wbpkConfig.entry),
	output: {
		path: path.resolve(__dirname, wbpkConfig.output),
		filename: wbpkConfig.filename,
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
		],
	},
	plugins: [
		new webpack.ProgressPlugin(),
	],
};

module.exports = config;