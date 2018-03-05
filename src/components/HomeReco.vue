<template>
    <div class="tabctitem">
        <div class="m-homeremd">
            <h2 class="remd_tl">
                推荐歌单
            </h2>
            <div class="remd_songs">
                <div class="remd_ul">
                    <a :key="item.id" class="remd_li" :href="'/playlist/'+item.id" v-for="item in playlist.slice(0,3)">
                        <div class="remd_img">
                            <img class="u-img" :src="item.picUrl" />
                            <span class="u-earp remd_lnum">{{`${(item.playCount / 10e4).toFixed(1)}万`}}</span>
                        </div>
                        <p class="remd_text">{{item.name}}</p>
                    </a>
                </div>
                <div class="remd_ul">
                    <a :key="item.id" class="remd_li" :href="'/playlist/'+item.id" v-for="item in playlist.slice(3)">
                        <div class="remd_img">
                            <img class="u-img" :src="item.picUrl" />
                            <span class="u-earp remd_lnum">{{`${(item.playCount / 10e4).toFixed(1)}万`}}</span>
                        </div>
                        <p class="remd_text">{{item.name}}</p>
                    </a>
                </div>
            </div>
            <h2 class="remd_tl">
                最新音乐
            </h2>
            <div class="remd_newsg">
                <div class="m-sglst">
                    <song-item v-for="song in newsong" :key="song.id" :song="song" />
                </div>
            </div>
            <div>
            </div>
        </div>
    </div>
</template>
<script>
    import { mapState } from 'vuex';
    import home from '@/store/modules/home';
    import SongItem from './SongItem';
    export default {
        name: 'reco',
        components: {
            SongItem
        },
        data() {
            return {
                testProperty: {}
            }
        },
        computed: {
            ...mapState(home.namespace, {
                playlist(state) {
                    return state.playlist.data;
                },
                newsong(state) {
                    return state.newsong.data.map((item, index) => {
                        return item.song;
                    })
                }
            })
        }
    }
</script>