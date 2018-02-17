const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlStringReplace = require('html-string-replace-webpack-plugin');
const config = env => ({
    entry: {
        app: ['./src/index.tsx'],
    },
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname + '/dist'),
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json'],
    },
    devServer: {
        contentBase: path.resolve(__dirname + '/dist'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.html',
            inject: false,
        }),
        new HtmlStringReplace({
            enable: true,
            patterns: [
                {
                    match: /src=".\/dist\/index.js"/g,
                    replacement: () => 'src="index.js"',
                },
            ]
        }),
        ...(env === 'production' ? [
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify('production')
            }),
            new webpack.optimize.UglifyJsPlugin(),
        ] : []),
    ],
    module: {
        rules: [
            { test: /\.tsx?$/, loader: 'awesome-typescript-loader' },
            { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' }
        ],
    },
});

module.exports = config;