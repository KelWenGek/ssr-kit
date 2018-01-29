import createApp from './app';


const { app, router, store } = createApp();
//开发模式下首屏,为了更好的混合,将state直接挂在window上,首页上直接通过window上来取数据
if (window.__INITIAL_STATE__) {
    store.replaceState(window.__INITIAL_STATE__);
}
router.onReady(() => {
    //注册预解析钩子,路由变化时进行数据预取,只有预取完成页面才能跳转,准备好跳转页面的数据
    router.beforeResolve((to, from, next) => {
        const matched = router.getMatchedComponents(to);
        const prevMatched = router.getMatchedComponents(from);
        let diffed = false;
        const activated = matched.filter((c, i) => {
            return !diffed || (diffed = prevMatched[i] !== c);
        });
        if (!activated.length) {
            return next();
        }
        console.log('预取开始');
        console.log('activated:', activated);
        Promise.all(activated.map(c => {
            if (c.asyncData) {
                return c.asyncData({ store, route: to });
            }
        })).then(() => {
            console.log('预取完成');
            next();
        }).catch(next);
    });
    app.$mount('#app');
});

