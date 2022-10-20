const  { baseConfig } = require('./webpack.base');
const { merge } = require('webpack-merge');
module.exports = merge(baseConfig, {
    devServer: {
        host: "localhost",
        port: 3000,
        open: true,
        hot: true,
    },
    mode: "development",
    devtool: 'cheap-module-source-map',
})