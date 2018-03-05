import Vue from 'vue';
import axios from 'axios';
import App from './App.vue';
import { createRouter } from './router/index';
import { createStore } from './store/index';
import { api, baseUrl } from '@/constant/api';

//自定义错误处理函数阻止Vue默认在ssr端将错误抛出的行为,然后可以用renderError方法进行错误渲染
Vue.config.errorHandler = function (err, vm, info) {
    !Vue.config.silent && console.error(err);
}
//mount the $http property to vue prototype
Vue.use({
    install(Vue, name) {
        Object.defineProperty(Vue.prototype, name, {
            value: axios
        });
        Object.defineProperty(Vue.prototype, '$api', {
            value: api
        });
    }
}, '$http');

Vue.mixin({
    renderError(h, err) {
        return h('pre', { style: { color: 'red' } }, err.stack)
    }
})
//axios config setting 
axios.defaults.baseURL = baseUrl;
// import '@/App.scss';
export default function createApp() {
    const router = createRouter();
    const store = createStore();
    const app = new Vue({
        router,
        store,
        render: h => {
            try {
                return h(App);
            } catch (err) {

            }
        }
    });
    return { app, router, store }
}