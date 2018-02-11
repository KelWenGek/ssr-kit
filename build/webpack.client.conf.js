const { resolve } = require('path');
const webpack = require('webpack');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const base = require('./webpack.base.conf');
const utils = require('./utils');
const fs = require('fs');

module.exports = function webpackClientConfig() {
    let config = base.call(this, 'client');
    config.entry.app = resolve(this.options.srcDir, 'client.js');
    config.entry.vendor = this.vendor();
    config.module.rules = config.module.rules.concat(utils.styleLoaders({ sourceMap: false, usePostCSS: true }))
    commonChunksPlugin.call(this, config)
    config.plugins.push(
        new HtmlPlugin({
            filename: 'index.spa.html',
            template: this.options.appTemplatePath,
            inject: true,
            chunksSortMode: 'dependency'
        })
    );
    if (this.options.build.ssr) {
        config.plugins.push(
            new HtmlPlugin({
                filename: 'index.ssr.html',
                template: this.options.appTemplatePath,
                inject: false
            })
        );
    }
    config.plugins.push(
        new VueSSRClientPlugin({
            filename: 'vue-ssr-client-manifest.json'
        })
    );
    config.plugins.push(
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest',
            minChunks: Infinity,
            filename: this.options.build.filename.manifest
        })
    );

    if (this.options.dev) {
        config.plugins.push(new FriendlyErrorsWebpackPlugin())

        config.plugins.push(new webpack.NamedModulesPlugin())

        // Add HMR support
        config.entry.app = [
            // https://github.com/glenjamin/webpack-hot-middleware#config
            `webpack-hot-middleware/client?name=client&reload=true&timeout=30000&path=${this.options.router.base}/__webpack_hmr`.replace(/\/\//g, '/'),
            config.entry.app
        ]
        config.plugins.push(
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoEmitOnErrorsPlugin()
        )
        if (this.options.build.dll) {
            dllPlugin.call(this, config);
        }
    }

    return config;
}


function commonChunksPlugin(config) {
    const maybeVendor = [
        '/core-js/',
        '/regenerator-runtime/',
        '/es6-promise/',
        '/babel-runtime/',
        '/lodash/'
    ]
    config.plugins.unshift(
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: this.options.build.filename.vendor,
            minChunks(module, count) {
                if (module.context && maybeVendor.some(v => module.context.includes(v))) {
                    return true;
                }
                return (
                    /node_modules/.test(module.context) &&
                    !/\.(css|less|scss|sass|styl|stylus)$/.test(module.request) &&
                    count >= 2
                );
            }
        })
    )
}

function dllPlugin(config) {
    const _dll = [];
    const vendorEntries = this.vendorEntries();
    const dllDir = resolve(this.options.cacheDir, config.name + '-dll');
    Object.keys(vendorEntries).forEach(v => {
        const dllManifestFile = resolve(dllDir, v + '-manifest.json');
        if (fs.existsSync(dllManifestFile)) {
            _dll.push(v);
            config.plugins.push(
                new webpack.DllReferencePlugin({
                    manifest: dllManifestFile
                })
            )
        }
    });
}