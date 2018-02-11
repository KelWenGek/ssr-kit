const { resolve } = require('path');
const isDev = process.env.NODE_ENV !== 'production';
module.exports = {
    dev: isDev,
    render: {
        ssr: true,
        bundleRenderer: {}
    },
    router: {
        base: '/'
    },
    cacheDir: resolve(__dirname, 'dll'),
    srcDir: resolve(__dirname, 'src'),
    buildDir: resolve(__dirname, 'dist'),
    rootDir: resolve(__dirname),
    appTemplatePath: resolve(__dirname, 'src/index.html'),
    build: {
        vendor: ['axios'],
        filename: {
            app: '[name].js',
            css: '[name].css',
            chunk: '[name].js',
            manifest: '[name].js',
            vendor: '[name]-dll.js'
        },
        publicPath: '/',
        extractCSS: isDev ? false : {
            fallback: 'vue-style-loader'
        },
        devMiddleware: {},
        hotMiddleware: {},
        dll: true,
        ssr: true
    },
    watchers: {
        webpack: {}
    },
    plugins: []
}