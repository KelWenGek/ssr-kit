import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
import home from './modules/home';
import search from './modules/search';
export function createStore() {
    return new Vuex.Store({
        state: {},
        modules: {
            home: home.mod,
            search: search.mod
        }
    })
}