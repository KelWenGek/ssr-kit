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
            app: '[name].js',
            chunk: '[name].js',
            manifest: '[name].js'
        },
        publicPath: '/',
        devMiddleware: {},
        hotMiddleware: {},
        ssr: true
    },
    watchers: {
        webpack: {}
    },
    plugins: []
}