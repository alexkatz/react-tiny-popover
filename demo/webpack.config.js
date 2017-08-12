const path = require('path');

const config = {
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
    module: {
        rules: [
            { test: /\.tsx?$/, loader: 'awesome-typescript-loader' },
            { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' }
        ],
    },
};

module.exports = config;