import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);
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
            }
        ]
    });
}