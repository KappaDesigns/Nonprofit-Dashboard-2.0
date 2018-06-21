const webpack = require('webpack');
const Common = require('./webpack.common');
const merge = require('webpack-merge');
const UglifyWebpackPlugin = require('uglifyjs-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');

module.exports = merge(Common, {
	devtool: 'source-map',
	plugins: [
		new UglifyWebpackPlugin({
			sourceMap: true,
		}),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify('production'),
		}),
		new ManifestPlugin(),
	],
});