import Vue from 'vue';
import axios from 'axios';
import App from './App.vue';
import { createRouter } from './router';
import { createStore } from './store';
Vue.use({
    install(Vue) {
        Object.defineProperty(Vue.prototype, '$http', {
            value: axios,
            writable: false
        })
    }
});
axios.defaults.baseURL = 'http://127.0.0.1:3000/';
// import '@/App.scss';
export default function createApp() {
    const router = createRouter();
    const store = createStore();
    const app = new Vue({
        router,
        store,
        render: h => h(App)
    });
    return { app, router, store }
}