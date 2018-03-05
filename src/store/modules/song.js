import Vue from 'vue';
import axios from 'axios';
import { createTypes, createStoreModule } from '../util';
import { api } from '@/constant/api';
import lyricConverter from '@/shared/lyric';
const song = createStoreModule('song', [
    'SET_SONG_LYRIC_OTHER_DATA',
    'SET_SONG_LYRIC_INDEX',
    'SET_SONG_LYRIC_LOADED',
    'SET_SONG_PLAY_STATUS',
    'GET_SONG',
    'GET_SONG_LYRIC',
    'GET_SONG_PLAY',
    'GET_SONG_INFO'
], function (types) {
    return {
        state: {
            lrcIndex: 0
        },
        mutations: {
            [types.SET_SONG_LYRIC_OTHER_DATA](state, payload) {
                Vue.set(state.songLyric.data, '_other', payload);
            },
            [types.SET_SONG_PLAY_STATUS](state, payload) {
                state.songPlay.data.playing = payload;
            },
            [types.SET_SONG_LYRIC_INDEX](state, payload) {
                state.lrcIndex = payload;
            },
            [types.SET_SONG_LYRIC_LOADED](state, payload) {
                state.songLyric.loaded = payload;
            }
        },
        actions: {
            async [types.GET_SONG_INFO]({ commit, dispatch, state }, id) {

                await Promise.all([
                    dispatch(types.GET_SONG, id),
                    dispatch(types.GET_SONG_PLAY, id)
                ]).then(() => {
                    //歌曲信息和歌曲连接获取成功之后显示歌曲详情页面内容否则报错提示用户
                    this._withCommit(() => {
                        Vue.set(state.song, 'loaded', true);
                        // state.song.loaded = true
                    });
                });
                //歌曲存在则获取歌词
                if (!state.songError && !state.songPlayError) {
                    await dispatch(types.GET_SONG_LYRIC, id);
                }
            },
            //获取歌曲信息
            async [types.GET_SONG]({ commit, state }, id) {
                let target = 'song';

                commit(types.SET_LOADING, {
                    target
                })
                await axios({
                    url: api.song_detail,
                    params: {
                        ids: id
                    }
                }).then(({ data }) => {
                    if (data.code === 200) {
                        commit(types.SET_SUCCESS, {
                            target,
                            data: {
                                data: data.songs[0] || {}
                            }
                        })
                    }
                }).catch(error => {
                    commit(types.SET_FAILURE, {
                        target,
                        error
                    })
                })
            },
            //获取歌曲歌词 优化歌曲载入逻辑
            async [types.GET_SONG_LYRIC]({ commit, state }, id) {
                let target = 'songLyric';

                commit(types.SET_LOADING, {
                    target
                })
                await axios({
                    url: api.lyric,
                    params: {
                        id
                    }
                }).then(({ data }) => {
                    if (data.code === 200) {
                        commit(types.SET_SUCCESS, {
                            target,
                            data: {
                                data: lyricConverter.parseFinalLyricMap(data),
                                loaded: true
                            }
                        });
                        Vue.nextTick(() => {
                            commit(types.SET_SONG_PLAY_STATUS, true);
                        })
                    }
                }).catch(error => {
                    commit(types.SET_FAILURE, {
                        target,
                        error
                    })
                })
            },
            //获取歌曲连接
            async [types.GET_SONG_PLAY]({ commit, state }, id) {
                let target = 'songPlay';
                //获取歌曲连接不需要loading提示

                await axios({
                    url: api.music_url,
                    params: {
                        id
                    }
                }).then(({ data }) => {
                    if (data.code === 200) {
                        commit(types.SET_SUCCESS, {
                            target,
                            data: {
                                data: Object.assign({}, data.data[0], { playing: false }) || {},
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
    }
}, ['songPlay', 'song', 'songLyric']);

export default song;