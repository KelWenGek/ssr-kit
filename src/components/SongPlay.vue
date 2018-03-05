<script>
    import { createNamespacedHelpers } from 'vuex';
    import song from '@/store/modules/song';
    const {
        mapState,
        mapGetters,
        mapMutations
    } = createNamespacedHelpers(song.namespace);
    export default {
        name: 'song-play',
        // props: ['autoPlay'],
        computed: {
            ...mapGetters(['song', 'songPlay']),
            src() {
                return this.songPlay.url;
            },
            autoPlay() {
                return this.songPlay.playing;
            }
        },
        watch: {
            autoPlay(val) {
                val && this.el.play();
            }
        },
        methods: {
            ...mapMutations({
                setPlayStatus: song.types.SET_SONG_PLAY_STATUS,
                setLyricIndex: song.types.SET_SONG_LYRIC_INDEX
            }),
            // setSource(src) {
            //     this.el.src = src;
            //     this.autoPlay && this.el.play();
            // },
            createAudio() {

                // this.$nextTick(() => {
                let audio = this.el = new Audio(this.src);
                let self = this;
                audio.autoplay = this.autoPlay;
                let refs = self.$parent.$refs,
                    infoWrapper = refs.songImg,
                    lycWrapper = refs.songLyc;
                //音乐播放
                audio.onplay = function () {
                    lycWrapper.setLrcScrollerTimer();
                };
                //音乐暂停
                audio.onpause = function () {
                    lycWrapper.removeLrcScrollerTimer();
                };
                //音乐结束
                audio.onended = function () {
                    //设置旋转动画
                    infoWrapper.setTransformStyle();
                    self.setPlayStatus(false);
                    //设置歌词滚动序号
                    self.setLyricIndex(0);
                    //删除歌词滚动timer
                    lycWrapper.removeLrcScrollerTimer();
                }
                //todo 播放逻辑要放到歌词加载完成
                // this.src && this.setSource(this.src);
                // });
            }
        },
        render(h) {
            return h(null);
        },
        mounted() {
            this.createAudio();
        },
        destroyed() {
            let oldEl = this.el;
            if (oldEl) {
                oldEl.pause();
                oldEl.onplay = oldEl.onpause = oldEl.onended = null;
                oldEl = null;
            }
        }

    }
</script>