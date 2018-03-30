import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
import home from './modules/home';
import search from './modules/search';
import playlist from './modules/playlist';
import song from './modules/song';
export function createStore() {
    return new Vuex.Store({
        state: {},
        modules: {
            home: home.result,
            search: search.result,
            playlist: playlist.result,
            song: song.result
        }
    })
}