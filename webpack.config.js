const path = require('path');
const util = require('./src/util/');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const c = util.readConfigSync();
let webpackConfig = c.webpack;

const developmetConfig = {
	entry: {
		app: path.resolve(__dirname, webpackConfig.entry),
	},
	output: {
		path: path.resolve(__dirname, webpackConfig.output),
		filename: `[name].${webpackConfig.filename}`,
		publicPath: '/',
	},
	devtool: 'inline-source-map',
	devServer: {
		contentBase: './build',
		hot: true,
		historyApiFallback: true,
		stats: 'errors-only',
		host: 'http://localhost:8080/',
		port: 8080,
		overlay: {
			errors: true,
			warnings: true,
		},
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
		new webpack.NamedModulesPlugin(),
		new webpack.HotModuleReplacementPlugin(),
	],
};

// console.log(path.resolve(__dirname, webpackConfig.entry, 'index.html'));	

module.exports = developmetConfig;