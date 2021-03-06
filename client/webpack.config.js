const webpack = require('webpack');
const childProcess = require('child_process');
const CopyWebpackPlugin = require('copy-webpack-plugin');
require('ts-node').register();

const VERSION = (process.env.SOURCE_VERSION || childProcess.execSync('git rev-parse HEAD').toString()).substring(0, 7);

module.exports = {
    entry: "./src/index.tsx",
    output: {
        filename: "bundle.js",
        path: __dirname + "/../cordova/www/dist"
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".json"]
    },

    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            {test: /\.tsx?$/, loader: "awesome-typescript-loader"},

            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            {enforce: "pre", test: /\.js$/, loader: "source-map-loader"}
        ]
    },

    plugins: [
        new webpack.DefinePlugin({
            'process.env.CLIENT_VERSION': JSON.stringify(VERSION)
        }),
        new CopyWebpackPlugin([{
            from: '../common/maps',
            to: 'maps',
            transform: require('./build/map').convert,
            cache: true,
        },{
            from: '../AUTHORS.md',
            to: 'authors.html',
            transform: require('./build/authors').convert,
            cache: true,
        }]),
    ],
    mode: "development"
};
