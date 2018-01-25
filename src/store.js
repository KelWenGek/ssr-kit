import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
Vue.use(Vuex);
axios.defaults.baseURL = 'http://127.0.0.1:3000/';
export function createStore() {
    return new Vuex.Store({
        state: {},
        actions: {
            fetchPlaylist({ commit }) {
                return axios.get('personalized');
            }
        },
        mutations: {
            setPlaylist(state, payload) {
                Vue.set(state, 'playlist', payload);
            },
            setCount(state, payload) {
                Vue.set(state, 'count', payload);
            },
            addCount(state) {
                state.count += 1;
            }
        }
    });
}