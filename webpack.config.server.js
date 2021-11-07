// Server-side Webpack configuration.
/*Webpack starts bundling from the server folder with server.js, then outputs the
bundled code in server.generated.js in the dist folder. During bundling, a CommonJS
environment will be assumed as we are specifying commonjs2 in libraryTarget, so the
output will be assigned to module.exports.
We will run the server-side code using the generated bundle in server.generated.js.*/

const path = require('path');
const webpack = require('webpack');
const CURRENT_WORKING_DIR = process.cwd();

const nodeExternals = require('webpack-node-externals')
const config = {
    name: "server",
    entry: [ path.join(CURRENT_WORKING_DIR , './server/server.js') ],
    target: "node",
    output: {
        path: path.join(CURRENT_WORKING_DIR , '/dist/'),
        filename: "server.generated.js",
        publicPath: '/dist/',
        libraryTarget: "commonjs2"
    },
    externals: [nodeExternals()],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [ 'babel-loader' ]
            },
            {
                test: /\.(ttf|eot|svg|gif|jpg|png)(\?[\s\S]+)?$/,
                use: 'file-loader'
            }
        ]
    }
}

module.exports = config;