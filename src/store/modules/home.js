import Vue from 'vue';
import axios from 'axios';
import { createTypes, createStoreModule } from '../util';
import { api } from '@/constant/api';
const namespace = 'home';
const typesArray = [
    'GET_RECOMMEND',
    'GET_RECO_PLAYLIST',
    'GET_NEWSONG',
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
            slicedHotList(state, getters) {
                return (start, end) => getters.top.slice(start, end);
            }
        },
        actions: {
            //获取推荐列表
            async [types.GET_RECOMMEND]({ commit, dispatch }) {
                await Promise.all([
                    dispatch(types.GET_RECO_PLAYLIST),
                    dispatch(types.GET_NEWSONG)
                ])
            },
            //获取推荐歌单
            async [types.GET_RECO_PLAYLIST]({ commit, state }) {
                let target = 'playlist';
                if (state[target].loaded) {
                    return await Promise.resolve();
                }
                let payload = {
                    target
                }
                commit(types.SET_LOADING, {
                    target
                });
                await axios.get(api.playlist)
                    .then(({ data }) => {
                        if (data.code === 200) {
                            commit(types.SET_SUCCESS, {
                                target,
                                data: {
                                    data: data.result.slice(0, 6) || [],
                                    loaded: true
                                }
                            });
                        }
                    }).catch(error => {
                        commit(types.SET_FAILURE, {
                            target,
                            error
                        })
                    });
            },
            //获取最新歌曲
            async [types.GET_NEWSONG]({ commit, state }) {
                let target = 'newsong';
                if (state[target].loaded) {
                    return await Promise.resolve();
                }
                commit(types.SET_LOADING, {
                    target
                });
                await axios.get(api.newsong)
                    .then(({ data }) => {
                        if (data.code === 200) {
                            commit(types.SET_SUCCESS, {
                                target,
                                data: {
                                    data: data.result || [],
                                    loaded: true
                                }
                            });
                        }
                    }).catch(error => {
                        commit(types.SET_FAILURE, {
                            target,
                            error
                        })
                    })
            },
            //获取热门列表
            async [types.GET_HOT_LIST]({ commit, state }) {
                let target = 'top';
                if (state[target].loaded) {
                    return await Promise.resolve();
                }
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
                            data: {
                                data: data.playlist.tracks || [],
                                loaded: true
                            }
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
            // [types.SET_PLAYLIST](state, payload) {
            //     Vue.set(state, 'playlist', payload);
            // },
            // [types.SET_NEWSONG](state, payload) {
            //     Vue.set(state, 'newsong', payload);
            // },
            [types.CHANGE_TAB_INDEX](state, index) {
                state.curIndex = index;
            }
        }
    }
}, ['top', 'playlist', 'newsong']);
export default home;
