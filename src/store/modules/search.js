import axios from 'axios';
import debounce from 'lodash/debounce';
import { completeModule } from '@/state-management-composer';
import { api } from '@/constant/api';
const debounceSpeed = 500;

export default completeModule({
    namespace: 'search',
    mapTargetsToModule: ['hots', 'suggestion', 'result'],
    mapTypesToModule: [
        'SET_KEYWORD',
        'GET_SUGGEST',
        'GET_HOT',
        'SET_RESULT',
        'GET_RESULT'
    ],
    mapDefinitionToModule(types) {
        return {
            state: {
                keyword: ''
            },
            getters: {
                hots(state) {
                    return state.hots.data;
                },
                suggestion(state) {
                    return state.suggestion.data;
                },
                result(state) {
                    return state.result.data;
                },
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
    }
});