const path = require('path');
const util = require('./src/util/');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const c = util.readConfigSync();
let webpackConfig = c.webpack;

module.exports = {
	entry: {
		vendor: ['react'],
		app: path.resolve(__dirname, webpackConfig.entry), 
	},
	output: {
		path: path.resolve(__dirname, webpackConfig.output),
		filename: '[name].[hash].js',
	},
	module: {
		loaders: [
			{
				test: /\.js?$/,
				loader: 'babel-loader',
				exclude: /(node_modules|bower_components)/,
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
		new webpack.HashedModuleIdsPlugin(),
		new CleanWebpackPlugin(['build']),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor',
			minChunks: Infinity,
		}),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'manifest',
		}),
	],
};