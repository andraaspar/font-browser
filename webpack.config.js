const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

module.exports = {
	mode: 'development',
	target: 'electron-renderer',
	devtool: 'inline-source-map',
	node: {
		global: false,
		__filename: true,
		__dirname: true,
	},
	entry: './src/main.tsx',
	module: {
		rules: [
			{
				test: /\.css$/i,
				use: ['style-loader', 'css-loader'],
			},
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
	},
	plugins: [
		new webpack.DefinePlugin({
			__filename: '',
		}),
		new HtmlWebpackPlugin({
			template: 'src/index.html',
			inject: 'body',
		}),
	],
	output: {
		filename: 'main.[contenthash].js',
		path: path.resolve(__dirname, 'dist'),
	},
}
