const { resolve } = require('path');
const webpack = require('webpack')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');
const base = require('./webpack.base.conf');
module.exports = function webpackServerConfig() {
    let config = base.call(this);
    config = Object.assign(config, {
        target: 'node',
        node: false,
        devtool: 'source-map',
        entry: {
            app: resolve(this.options.srcDir, 'server.js')
        },
        output: Object.assign({}, config.output, {
            filename: 'server-bundle.js',
            libraryTarget: 'commonjs2'
        }),
        performance: {
            hints: false,
            maxAssetSize: Infinity
        },
        externals: [],
        plugins: (config.plugins || []).concat([
            new VueSSRServerPlugin({
                filename: 'server-bundle.json'
            })
        ])
    });
    return config;
}