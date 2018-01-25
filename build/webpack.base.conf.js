const { cloneDeep } = require('lodash');
const { resolve } = require('path');
const { isUrl, urlJoin } = require('./utils');
const vueLoaderConfig = require('./vue-loader.conf')
module.exports = function webpackBaseConfig(name) {
    const config = {
        name,
        devtool: this.options.dev ? 'cheap-module-source-map' : 'nosources-source-map',
        entry: {
            app: null
        },
        output: {
            path: resolve(this.options.buildDir),
            filename: this.options.build.filename.app,
            chunkFilename: this.options.build.filename.chunk,
            // publicPath: isUrl(this.options.build.publicPath) ? this.options.build.publicPath : urlJoin(this.options.router.base, this.options.build.publicPath),
            publicPath: this.options.build.publicPath
        },
        // performance: {
        //     maxEntrypointSize: 1000000,
        //     maxAssetSize: 300000,
        //     hints: this.options.dev ? false : 'warning'
        // },
        module: {
            noParse: /es6-promise\.js$/,
            rules: [
                {
                    test: /\.js$/,
                    loader: 'babel-loader',
                    exclude: /node_modules/
                },
                {
                    test: /\.vue$/,
                    loader: 'vue-loader',
                    options: vueLoaderConfig
                }
            ]
        },
        resolve: {
            alias: {
                'vue$': 'vue/dist/vue.esm.js',
                '@': resolve(this.options.srcDir)
            },
            extensions: ['.js', '.json', '.vue', '.ts']
        },
        plugins: this.options.plugins || []
    };
    return cloneDeep(config);
}