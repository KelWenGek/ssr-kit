import axios from 'axios';
import debounce from 'lodash/debounce';
import { createTypes, createStoreModule } from '../util';
import { api } from '@/constant/api';
const debounceSpeed = 500;
const search = createStoreModule('search', [
    'SET_KEYWORD',
    'SET_SUGGEST',
    'SET_SUGGEST_LOADING',
    'GET_SUGGEST',
    'SET_HOT',
    'GET_HOT',
    'SET_RESULT',
    'GET_RESULT'
], function (types) {
    return {
        state: {
            keyword: '',
            suggestLoading: false,
            suggestions: [],
            hots: [],
            result: []
        },
        mutations: {
            [types.SET_KEYWORD](state, keyword) {
                state.keyword = keyword;
            },
            [types.SET_SUGGEST](state, payload) {
                state.suggestions = payload;
            },
            [types.SET_SUGGEST_LOADING](state, payload) {
                state.suggestLoading = payload;
            },
            [types.SET_HOT](state, payload) {
                state.hots = payload;
            },
            [types.SET_RESULT](state, payload) {
                state.result = payload;
            }
        },
        actions: {
            async [types.GET_HOT]({ commit }) {
                await axios({
                    url: api.hot
                }).then(({ data }) => {
                    if (data.code === 200) {
                        commit(types.SET_HOT, data.result.hots);
                    }
                }).catch(e => {

                })
            },
            [types.GET_SUGGEST]: debounce(async function ({ commit }, keyword) {
                commit(types.SET_SUGGEST_LOADING, true);
                await axios({
                    url: api.suggest,
                    params: {
                        keywords: keyword
                    }
                }).then(({ data }) => {
                    if (data.code === 200) {
                        commit(types.SET_SUGGEST_LOADING, false);
                        commit(types.SET_SUGGEST, data.result.songs || []);
                    }
                }).catch(e => {

                });
            }, debounceSpeed),
            async [types.GET_RESULT]({ commit }, keyword) {
                await axios({
                    url: api.result,
                    params: {
                        keywords: keyword
                    }
                }).then(({ data }) => {
                    if (data.code === 200) {
                        commit(types.SET_RESULT, data.result.songs);
                    }
                }).catch(e => {

                })
            }
        }
    }
})
export default search; 