const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const config = {
    entry: {
        app: ['./src/Popover.tsx'],
    },
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname + '/dist'),
        libraryTarget: 'umd',
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json'],
    },
    devServer: {
        contentBase: path.resolve(__dirname + '/dist'),
    },
    module: {
        rules: [
            { test: /\.tsx?$/, loader: 'awesome-typescript-loader' },
            { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' }
        ],
    },
    plugins: [
        new CopyWebpackPlugin([
            { from: './src/index.d.ts', to: './' },
        ]),
    ],
    externals: {
        'react': 'commonjs react',
        'react-dom': 'commonjs react-dom',
    },
};

module.exports = config;
