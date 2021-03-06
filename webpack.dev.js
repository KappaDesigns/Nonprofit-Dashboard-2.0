const webpack = require('webpack');
const Common = require('./webpack.common');
const merge = require('webpack-merge');

module.exports = merge(Common, {
	entry: {
		client: ['./src/app/src/index.js','webpack-hot-middleware/client'],
	},
	output: {
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
	plugins: [
		new webpack.NamedModulesPlugin(),
		new webpack.HotModuleReplacementPlugin(),
	],
});