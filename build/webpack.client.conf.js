const { resolve } = require('path');
const webpack = require('webpack');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const base = require('./webpack.base.conf');

module.exports = function webpackClientConfig() {
    let config = base.call(this, 'client');
    config.entry.app = resolve(this.options.srcDir, 'client.js');
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
        config.plugins.push(
            new FriendlyErrorsWebpackPlugin(),
            new webpack.NoEmitOnErrorsPlugin()
        )
    }
    return config;
}