import axios from 'axios';
import debounce from 'lodash/debounce';
import { createTypes, createStoreModule } from '../util';
import { api } from '@/constant/api';
const debounceSpeed = 500;
const search = createStoreModule('search', [
    'SET_KEYWORD',
    'GET_SUGGEST',
    'GET_HOT',
    'SET_RESULT',
    'GET_RESULT'
], function (types) {

    const definition = {
        state: {
            keyword: ''
        },
        getters: {
            slicedResult(state, getters) {
                return (start, end) => getters.result.slice(start, end);
            }
        },
        mutations: {
            [types.SET_KEYWORD](state, keyword) {
                state.keyword = keyword;
                state.result = {
                    data: []
                };
            }
            // ,
            // [types.SET_RESULT](state, payload) {
            //     state.result = payload;
            // }
        },
        actions: {
            async [types.GET_HOT]({ commit, state }) {
                let target = 'hots';
                if (state[target].loaded) {
                    return await Promise.resolve();
                }
                commit(types.SET_LOADING, {
                    target
                });
                await axios({
                    url: api.hot
                }).then(({ data }) => {
                    if (data.code === 200) {
                        commit(types.SET_SUCCESS, {
                            target,
                            data: {
                                data: data.result.hots || [],
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
            [types.GET_SUGGEST]: debounce(async function ({ commit, state }, keyword) {
                let target = 'suggestion';
                this._withCommit(() => {
                    state.result = {
                        data: []
                    };
                });
                commit(types.SET_LOADING, {
                    target
                });
                await axios({
                    url: api.suggest,
                    params: {
                        keywords: keyword
                    }
                }).then(({ data }) => {
                    if (data.code === 200) {
                        commit(types.SET_SUCCESS, {
                            target,
                            data: {
                                data: data.result.songs || []
                            }
                        });
                    }
                }).catch(error => {
                    commit(types.SET_FAILURE, {
                        target,
                        error
                    })
                });
            }, debounceSpeed),
            async [types.GET_RESULT]({ commit }, keyword) {
                let target = 'result';
                commit(types.SET_LOADING, {
                    target
                });
                await axios({
                    url: api.result,
                    params: {
                        keywords: keyword
                    }
                }).then(({ data }) => {
                    if (data.code === 200) {
                        commit(types.SET_SUCCESS, {
                            target,
                            data: {
                                data: data.result.songs || [],
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
            }
        }
    };
    return definition;
}, ['hots', 'suggestion', 'result']);
export default search; 