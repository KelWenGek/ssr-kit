<template>
    <div class="m-newsong">
        <div class="m-song-bg" :style="bgStyle"></div>
        <div class="m-scroll_wrapper m-song_nor j-songsrl">
            <div class="m-scroll_scroller m-scroll_scroller_vertical">
                <div class="m-song_newfst">
                    <!-- <span class="m-logo"></span> -->
                    <song-info ref="songImg" />
                    <song-lyric ref="songLyc" />
                    <song-play :auto-play="true" ref="songAudio" />
                    <div>
                        <div class="m-giude" style="bottom: '-14px'">
                            <i class="arr ani"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import { createNamespacedHelpers } from 'vuex';
    import song from '@/store/modules/song';
    import SongInfo from './SongInfo';
    import SongLyric from './SongLyric';
    import SongPlay from './SongPlay';
    const {
        mapState,
        mapActions
    } = createNamespacedHelpers(song.namespace)
    export default {
        name: 'song',
        components: {
            SongInfo,
            SongLyric,
            SongPlay
        },
        computed: {
            ...mapState(['song', 'songLyric', 'songPlay']),
            bgStyle() {
                return {
                    backgroundImage: `url( "//music.163.com/api/img/blur/${this.song.al.pic_str}")`,
                    opacity: 1
                }
            }
        },
        mounted() {
            this.transform = function (e) {
                var t = ["transform", "webkitTransform", "msTransform", "MozTransform"];
                for (var n in t)
                    if (void 0 !== e.style[t[n]])
                        return t[n];
                return t[1];
            }(document.createElement("div"));
            // this.$nextTick(() => {
            //     document.querySelector('.song_newfst').style.height = document.querySelector('.j-songsrl').offsetHeight;
            // })
        },
        async asyncData({ store, route }) {
            await store.dispatch(song.namespacedTypes.GET_SONG_INFO, route.params.id);
        }
    }
</script>