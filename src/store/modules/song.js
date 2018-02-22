import Vue from 'vue';
import axios from 'axios';
import { createTypes, createStoreModule } from '../util';
import { api } from '@/constant/api';
import lyricConverter from '@/shared/lyric';
const song = createStoreModule('song', [
    'SET_SONG',
    'SET_SONG_LYRIC',
    'SET_SONG_LYRIC_OTHER_DATA',
    'SET_SONG_LYRIC_INDEX',
    'SET_SONG_PLAY_STATUS',
    'SET_SONG_PLAY',
    'GET_SONG_INFO'
], function (types) {
    return {
        state: {
            lrcIndex: 0
        },
        mutations: {
            [types.SET_SONG](state, payload) {
                Vue.set(state, 'song', payload);
            },
            [types.SET_SONG_LYRIC](state, payload) {
                Vue.set(state, 'songLyric', payload);
            },
            [types.SET_SONG_PLAY](state, payload) {
                Vue.set(state, 'songPlay', payload);
            },
            [types.SET_SONG_LYRIC_OTHER_DATA](state, payload) {
                state.songLyric._other = payload;
            },
            [types.SET_SONG_PLAY_STATUS](state, payload) {
                state.songPlay.playing = payload;
            },
            [types.SET_SONG_LYRIC_INDEX](state, payload) {
                state.lrcIndex = payload;
            }
        },
        actions: {
            async [types.GET_SONG_INFO]({ commit }, id) {
                await Promise.all([
                    axios({
                        url: api.song_detail,
                        params: {
                            ids: id
                        }
                    }),
                    axios({
                        url: api.lyric,
                        params: {
                            id
                        }
                    }),
                    axios({
                        url: api.music_url,
                        params: {
                            id
                        }
                    })
                ]).then(res => {
                    let song_detail = res[0].data,
                        lyric = res[1].data,
                        music_url = res[2].data;
                    commit(types.SET_SONG, song_detail.code === 200 ? song_detail.songs[0] || {} : {});


                    commit(types.SET_SONG_LYRIC, lyric.code === 200 ? lyricConverter.parseFinalLyricMap(lyric) : {});


                    commit(types.SET_SONG_PLAY, music_url.code === 200 ?
                        Object.assign({}, music_url.data[0], { playing: true }) || {} : {})
                })
            }
        }
    }
});

export default song;