<script>
    import { createNamespacedHelpers } from 'vuex';
    import song from '@/store/modules/song';
    const {
        mapState,
        mapMutations
    } = createNamespacedHelpers(song.namespace);
    export default {
        name: 'song-play',
        props: ['autoPlay'],
        computed: {
            ...mapState(['song', 'songPlay']),
            src() {
                return this.songPlay.url;
            },
            playing() {
                return this.songPlay.playing;
            }
        },
        watch: {
            playing(val, oldVal) {
                if (val) {
                    this.el.play();
                } else {
                    this.el.pause();
                }
            }
        },
        methods: {
            ...mapMutations({
                setPlayStatus: song.types.SET_SONG_PLAY_STATUS,
                setLyricIndex: song.types.SET_SONG_LYRIC_INDEX
            }),
            setSource(src) {
                this.el.src = src;
                this.autoPlay && this.el.play();
            },
            setPlayEndTimer() {
                let interval = this.song.dt - this.el.currentTime * 1000;
                let lycWrapper = this.$parent.$refs.songLyc;
                this.endPlayTimer = setTimeout(() => {
                    this.setPlayStatus(false);
                    //设置旋转动画
                    this.$parent.$refs.songImg.setTransformStyle();
                    //设置歌词滚动序号
                    this.setLyricIndex(0);
                    //删除歌词滚动timer
                    lycWrapper.lyrSclTimer && clearInterval(lycWrapper.lyrSclTimer);

                }, interval);
            }
        },
        render(h) {
            return h(null);
        },
        mounted() {
            let audio = this.el = new Audio(this.src);
            audio.autoPlay = this.autoPlay;
            this.src && this.setSource(this.src);
            this.$nextTick(() => {
                this.setPlayEndTimer();
            })
        }
    }
</script>