import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

//路由组件重用
Vue.mixin({
    //客户端渲染需要路由更新钩子
    beforeRouteUpdate(to, from, next) {
        const { asyncData } = this.$options;
        if (asyncData) {
            asyncData({
                store: this.$store, route: to
            }).then(() => {
                next();
            }).catch(next);
        } else {
            next();
        }
    }
});
export function createRouter() {
    return new Router({
        mode: 'history',
        routes: [
            {
                name: 'home',
                path: '/',
                component: () => import('@/components/Home')
            },
            {
                name: 'playlist',
                path: '/playlist/:id',
                component: () => import('@/components/Playlist')
            },
            {
                name: 'song',
                path: '/song/:id',
                component: () => import('@/components/Song')
            }
        ]
    });
}