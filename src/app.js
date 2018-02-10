import Vue from 'vue';
import axios from 'axios';
import App from './App.vue';
import { createRouter } from './router/index';
import { createStore } from './store/index';
import { api, baseUrl } from '@/constant/api';

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

//axios config setting 
axios.defaults.baseURL = baseUrl;
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