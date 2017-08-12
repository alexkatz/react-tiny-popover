const path = require('path');

const config = {
    entry: {
        app: ['./src/Popover.tsx'],
    },
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname + '/dist'),
        libraryTarget: 'commonjs',
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
    externals: {
        'react': 'commonjs react',
    },
};

module.exports = config;
