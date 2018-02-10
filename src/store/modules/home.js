import Vue from 'vue';
import axios from 'axios';
import { createTypes, createStoreModule } from '../util';
import { api } from '@/constant/api';
const namespace = 'home';
const typesArray = [
    'GET_RECOMMEND',
    'SET_PLAYLIST',
    'SET_NEWSONG',
    'GET_HOT_LIST',
    'CHANGE_TAB_INDEX'
];
const home = createStoreModule(namespace, typesArray, function (types) {
    return {
        state: {
            curIndex: 0
        },
        getters: {
            slicedHotList(state) {
                return (start, end) => state.top.slice(start, end);
            }
        },
        actions: {
            //获取推荐列表
            async [types.GET_RECOMMEND]({ commit }) {
                await Promise.all([
                    axios.get(api.playlist),
                    axios.get(api.newsong)
                ]).then((res) => {
                    let playlist = res[0].data, newsong = res[1].data;
                    commit(types.SET_PLAYLIST, playlist.code === 200 ? playlist.result.slice(0, 6) : []);
                    commit(types.SET_NEWSONG, newsong.code === 200 ? newsong.result : []);
                });
            },
            //获取热门列表
            async [types.GET_HOT_LIST]({ commit }) {
                let target = 'top';
                commit(types.SET_LOADING, {
                    target
                });
                await axios({
                    url: api.top,
                    params: {
                        idx: '1'
                    }
                }).then(({ data }) => {
                    if (data.code === 200) {
                        commit(types.SET_SUCCESS, {
                            target,
                            data: data.playlist.tracks || []
                        })
                    }
                }).catch(error => {
                    commit(types.SET_FAILURE, {
                        target,
                        error
                    })
                });
            }
        },
        mutations: {
            [types.SET_PLAYLIST](state, payload) {
                Vue.set(state, 'playlist', payload);
            },
            [types.SET_NEWSONG](state, payload) {
                Vue.set(state, 'newsong', payload);
            },
            [types.CHANGE_TAB_INDEX](state, index) {
                state.curIndex = index;
            }
        }
    }
}, ['top']);
export default home;
