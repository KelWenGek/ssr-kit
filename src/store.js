import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
Vue.use(Vuex);
export function createStore() {
    return new Vuex.Store({
        state: {},
        modules: {
            home: {
                namespaced: true,
                state: {
                    curIndex: 0,
                    hotList: []
                },
                actions: {
                    fetchReco({ commit }) {
                        return Promise.all([
                            axios.get('personalized'),
                            axios.get('personalized/newsong')
                        ]);
                    }
                },
                mutations: {
                    setPlaylist(state, payload) {
                        Vue.set(state, 'playlist', payload);
                    },
                    setNewsongs(state, payload) {
                        Vue.set(state, 'newsongs', payload);
                    },
                    changeTab(state, index) {
                        state.curIndex = index;
                    },
                    setHotList(state, payload) {
                        state.hotList = payload;
                    }
                }
            }
        }
    });
}