const ExtractTextPlugin = require('extract-text-webpack-plugin');
module.exports = {
    isUrl(url) {
        return (url.indexOf('http') === 0 || url.indexOf('//') === 0);
    },
    urlJoin() {
        return [].slice.call(arguments).join('/').replace(/\/+/g, '/').replace(':/', '://');
    },
    sequence(tasks, fn) {
        return tasks.reduce((promise, task) => promise.then(() => fn(task)), Promise.resolve());
    },
    async  waitFor(ms) {
        return new Promise(resolve => setTimeout(resolve, (ms || 0)));
    },

    cssLoaders(options) {
        options = options || {}

        const cssLoader = {
            loader: 'css-loader',
            options: {
                sourceMap: options.sourceMap
            }
        }

        const postcssLoader = {
            loader: 'postcss-loader',
            options: {
                // plugins: loader => {
                //   return [px2rem({ remUnit: 75 })];
                // },
                sourceMap: options.sourceMap
            }
        }

        // generate loader string to be used with extract text plugin
        function generateLoaders(loader, loaderOptions) {
            const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader]

            if (loader) {
                loaders.push({
                    loader: loader + '-loader',
                    options: Object.assign({}, loaderOptions, {
                        sourceMap: options.sourceMap
                    })
                })
            }

            // Extract CSS when that option is specified
            // (which is the case during production build)
            if (options.extract) {
                return ExtractTextPlugin.extract({
                    use: loaders,
                    fallback: 'vue-style-loader'
                })
            } else {
                return ['vue-style-loader'].concat(loaders)
            }
        }

        // https://vue-loader.vuejs.org/en/configurations/extract-css.html
        return {
            css: generateLoaders(),
            postcss: generateLoaders(),
            less: generateLoaders('less'),
            sass: generateLoaders('sass', { indentedSyntax: true }),
            scss: generateLoaders('sass'),
            stylus: generateLoaders('stylus'),
            styl: generateLoaders('stylus')
        }
    },
    // Generate loaders for standalone style files (outside of .vue)
    styleLoaders(options) {
        const output = []

        const loaders = this.cssLoaders(options)
        for (const extension in loaders) {
            const loader = loaders[extension]
            output.push({
                test: new RegExp('\\.' + extension + '$'),
                use: loader
            })
        }

        return output
    }
}