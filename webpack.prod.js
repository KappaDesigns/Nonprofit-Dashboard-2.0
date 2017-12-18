const webpack = require('webpack');
const Common = require('./webpack.common');
const merge = require('webpack-merge');
const UglifyWebpackPlugin = require('uglifyjs-webpack-plugin');
const path = require('path');
const util = require('./src/util/');

const c = util.readConfigSync();
let webpackConfig = c.webpack;

module.exports = merge(Common, {
	entry: {
		app: path.resolve(__dirname, webpackConfig.entry), 
	},
	devtool: 'source-map',
	plugins: [
		new UglifyWebpackPlugin({
			sourceMap: true,
		}),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify('production'),
		}),
	],
});