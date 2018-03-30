import Vue from 'vue';
import axios from 'axios';
import { completeModule } from '@/state-management-composer';
import { api } from '@/constant/api';

export default completeModule({
    namespace: 'playlist',
    mapTypesToModule: [
        'SET_PLAYLIST',
        'SET_PLAYLIST_COMMENT',
        'GET_PLAYLIST'
    ],
    mapDefinitionToModule(types) {
        return {
            state: {},
            getters: {},
            mutations: {
                [types.SET_PLAYLIST](state, payload) {
                    Vue.set(state, 'playlist', payload);
                },
                [types.SET_PLAYLIST_COMMENT](state, payload) {
                    Vue.set(state, 'playlistCmt', payload);
                }
            },
            actions: {
                async [types.GET_PLAYLIST]({ commit }, id) {
                    await Promise.all([
                        axios({
                            url: api.album,
                            params: {
                                id
                            }
                        }),
                        axios({
                            url: api.album_comment,
                            params: {
                                id
                            }
                        })
                    ]).then(res => {
                        let playlist = res[0].data,
                            playlistCmt = res[1].data;
                        commit(types.SET_PLAYLIST, playlist.code === 200 ? playlist.playlist || [] : []);
                        commit(types.SET_PLAYLIST_COMMENT, playlistCmt.code === 200 ? playlistCmt || {} : {})
                    })
                }
            }
        }
    }
})
