<script>
    import { createNamespacedHelpers } from 'vuex';
    import song from '@/store/modules/song';
    const {
        mapState
    } = createNamespacedHelpers(song.namespace);
    export default {
        name: 'song-play',
        props: ['autoPlay'],
        computed: {
            ...mapState(['songPlay']),
            src() {
                return this.songPlay.url;
            },
            playing() {
                return this.songPlay.playing;
            }
        },
        watch: {
            playing(val, oldVal) {
                if (val && !this.el.ended) {
                    this.el.play();
                } else {
                    this.el.pause();
                }
            }
        },
        methods: {
            setSource(src) {
                this.el.src = src;
                this.autoPlay && this.el.play();
            }
        },
        render(h) {
            return h(null);
        },
        mounted() {
            let audio = this.el = new Audio(this.src);
            audio.autoPlay = this.autoPlay;
            this.src && this.setSource(this.src);
        }
    }
</script>