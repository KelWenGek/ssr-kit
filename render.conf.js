const { resolve } = require('path');
module.exports = {
    dev: process.env.NODE_ENV !== 'production',
    render: {
        ssr: true,
        bundleRenderer: {}
    },
    router: {
        base: '/'
    },
    srcDir: resolve(__dirname, 'src'),
    buildDir: resolve(__dirname, 'dist'),
    rootDir: resolve(__dirname),
    appTemplatePath: resolve(__dirname, 'src/index.html'),
    build: {
        filename: {
            app: '[name]:[hash:5].js',
            chunk: '[name]:[chunkHash:5].js',
            manifest: '[name]:[contentHash:5].js'
        },
        publicPath: '/',
        devMiddleware: {},
        hotMiddleware: {}
    },
    watchers: {
        webpack: {}
    }
}