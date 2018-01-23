const { resolve, join } = require('path');
const Koa = require('koa');
const serveStatic = require('koa-static');
const _ = require('lodash');
const generateEtag = require('etag');
const fresh = require('fresh');
const fs = require('fs-extra');
const pify = require('pify');
const portfinder = require('portfinder');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const { createBundleRenderer } = require('vue-server-renderer');
const { sequence, waitFor } = require('./utils');

class WebpackDevSSR {
    constructor(options) {
        this.options = options;
        this.app = new Koa();
        this.compilers = [];
        this.compilersWatching = [];
        this.webpackDevMiddleware = null;
        this.webpackHotMiddleware = null;
        this.bundleRenderer = null;
        this.resources = {
            clientManifest: null,
            serverBundle: null,
            ssrTemplate: null,
            spaTemplate: null,
            errorTemplate: null
        };
        this.webpackStats = this.options.dev ? false : {
            chunks: false,
            children: false,
            modules: false,
            colors: true,
            excludeAssets: [
                /.map$/,
                /index\..+\.html$/,
                /vue-ssr-client-manifest.json/
            ]
        };
        this._buildStatus = STATUS.INITIAL;

    }
    async ready() {
        await this.build();
        this.setUpMiddlewares();
        this.listen();
    }
    listen() {
        portfinder.getPortPromise().then(port => {
            console.log(`Server is listening at port ${port}`);
            this.app.listen(port);
        }).catch(err => {
            console.log('Server initial fail')
            console.error(err);
        })
    }
    get noSSR() {
        return this.options.render.ssr === false;
    }
    get isReady() {
        if (this.noSSR) {
            return Boolean(this.resources.spaTemplate);
        }
        return Boolean(this.bundleRenderer && this.resources.ssrTemplate);
    }
    get isResourcesAvailable() {
        if (!this.resources.clientManifest) {
            return;
        }
        if (this.noSSR) {
            return Boolean(this.resources.spaTemplate);
        }
        return Boolean(this.resources.ssrTemplate && this.resources.serverBundle);
    }
    async build() {
        if (this._buildStatus === STATUS.BUILD_DONE && this.options.dev) {
            return this;
        }
        if (this._buildStatus === STATUS.BUILDING) {
            await waitFor(1000);
            return this.build();
        }
        this._buildStatus = STATUS.BUILDING;
        await this.webpackBuild();
        this._buildStatus = STATUS.BUILD_DONE;
        return this;
    }
    setUpMiddlewares() {
        //Dev build,file provided by webpack-dev-middleware
        if (this.options.dev) {
            this.app.use(async (ctx, next) => {
                let req = ctx.req, res = ctx.res;
                await this.webpackDevMiddleware(req, res);
                await this.webpackHotMiddleware(req, res);
                await next();
            })
        } else {
            //Production build
            this.app.use(serveStatic(resolve(this.options.buildDir)));
            this.app.use(serveStatic(resolve(this.options.srcDir, 'static')))
        }
        this.app.use(async (ctx, next) => {
            let result = await this.renderRoute(ctx);
            console.log(result);
        });

    }
    async renderRoute(ctx) {
        if (!this.isReady) {
            await waitFor(1000);
            return this.renderRoute(ctx);
        }
        await this.bundleRenderer.renderToString(ctx);
    }
    async webpackBuild() {
        const compilerOptions = [];
        //Client config
        let clientConfig = webpackClientConfig.call(this);
        compilerOptions.push(clientConfig);
        //Server config
        let serverConfig = null;
        if (this.options.build.ssr) {
            serverConfig = webpackServerConfig.call(this);
            compilerOptions.push(serverConfig);
        }
        // Initialize shared FS and Cache
        let sharedFS = this.options.dev && new MFS;
        let sharedCache = {};
        //Initial compilers
        this.compilers = compilerOptions.map(compilerOption => {
            let compiler = webpack(compilerOption);
            // In dev, write files in memory FS 
            if (sharedFS) {
                compiler.outputFileSystem = sharedFS;
            }
            compiler.cache = sharedCache;
            return compiler;
        });
        await sequence(this.compilers, (compiler) => new Promise((resolve, reject) => {
            compiler.plugin('done', async stats => {
                this.loadResources(sharedFS || fs);
                process.nextTick(resolve);
            });
            // --- Dev Build ---
            if (this.options.dev) {
                //Client dev build, watch is started by dev-middleware
                if (compiler.options.name === 'client') {
                    return this.webpackDev(compiler);
                }
                //Server dev build
                this.compilersWatching.push(
                    compiler.watch(this.options.watchers.webpack, err => {
                        if (err) return reject(err);
                        delete require.cache[require.resolve('vue')]
                        delete require.cache[require.resolve('vue-router')]
                    })
                )
                return;
            }
            //Product build
            compiler.run((err, stats) => {
                if (err) {
                    console.error(err);
                    return reject(err);
                }
                //Show build stats
                console.log(stats.toString(this.webpackStats));
                if (stats.hasErrors()) {
                    return reject(new Error('Webpack build exited with errors'));
                }
            });
        }))

    }
    webpackDev(compiler) {
        //Webpack dev middleware
        this.webpackDevMiddleware = pify(webpackDevMiddleware(compiler,
            Object.assign({
                publicPath: this.options.build.publicPath,
                stats: this.webpackStats,
                noInfo: true,
                quiet: true,
                watchOptions: this.options.watchers.webpack
            }, this.options.build.devMiddleware)
        ));
        this.webpackDevMiddleware.close = pify(this.webpackDevMiddleware.close);
        //Webpack hot middleware
        this.webpackHotMiddleware = pify(webpackHotMiddleware(compiler,
            Object.assign({
                log: false,
                heartbeat: 10000
            }, this.options.build.hotMiddleware)
        ));
    }
    loadResources(_fs = fs) {
        let distPath = resolve(this.options.buildDir);
        let updated = [];
        resourceMap.forEach(({ key, fileName, transform }) => {
            const rawKey = '$$' + key;
            let path = join(distPath, fileName);
            const rawData, data;
            if (!_fs.existsSync(path)) {
                //Resource not exist
                return;
            }
            rawData = _fs.readFileSync(path, 'utf8');
            if (!rawData || rawData === this.resources[rawKey]) {
                //no change
                return;
            }
            this.resources[rawKey] = rawData;
            data = transform(rawData);
            if (!data) {
                //Data invalid
                return;
            }
            this.resources[key] = data;
            updated.push(key);
        });
        //Updated
        if (updated.length) {
            this.createRenderer();
        }
    }
    createRenderer() {
        //Resources not available
        if (!this.isResourcesAvailable) {
            return;
        }

        if (this.noSSR) {
            return;
        }
        // Create bundle renderer for SSR
        this.bundleRenderer = createBundleRenderer(this.resources.serverBundle,
            Object.assign({
                clientManifest: this.resources.clientManifest,
                runInNewContext: false,
                basedir: this.options.rootDir
            }, this.options.render.bundleRenderer)
        );
    }
}
const STATUS = {
    INITIAL: 1,
    BUILD_DONE: 2,
    BUILDING: 3
}

const parseTemplate = templateStr => _.template(templateStr, {
    interpolate: /{{([\s\S]+?)}}/g
})

const resourceMap = [
    {
        key: 'clientManifest',
        fileName: 'vue-ssr-client-manifest.json',
        transform: JSON.parse
    },
    {
        key: 'serverBundle',
        fileName: 'server-bundle.json',
        transform: JSON.parse
    },
    {
        key: 'ssrTemplate',
        fileName: 'index.ssr.html',
        transform: parseTemplate
    },
    {
        key: 'spaTemplate',
        fileName: 'index.spa.html',
        transform: parseTemplate
    }
]