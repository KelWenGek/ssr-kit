const webpack = require('webpack');
const { resolve } = require('path');
const ClientConfig = require('./webpack.client.conf');

module.exports = function webpackDllConfig(_refConfig) {
    const refConfig = _refConfig || new ClientConfig();

    const name = refConfig.name + '-dll';
    const dllDir = resolve(this.options.cacheDir, name);

    let config = {
        name,
        entry: this.vendorEntries(),
        resolve: refConfig.resolve,
        target: refConfig.target,
        module: refConfig.module,
        plugins: []
    };

    config.output = {
        path: dllDir,
        filename: '[name]_[hash].js',
        library: '[name]_[hash]'
    }

    config.plugins.push(
        new webpack.DllPlugin({
            path: resolve(dllDir, '[name]-manifest.json'),
            name: '[name]_[hash]'
        })
    )

    return config;
}