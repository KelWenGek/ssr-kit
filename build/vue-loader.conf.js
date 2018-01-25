const utils = require('./utils')
const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
    loaders: utils.cssLoaders({
        sourceMap: false,
        extract: isProduction
    }),
    cssModules: {
        localIdentName: '[local]--[hash:base64:5]',
        camelCase: true
    },
    cssSourceMap: false,
    cacheBusting: true,
    transformToRequire: {
        video: ['src', 'poster'],
        source: 'src',
        img: 'src',
        image: 'xlink:href'
    }
}
