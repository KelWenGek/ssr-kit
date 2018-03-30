<template>
    <div class="m-song-info">
        <h2 class="m-song-h2">

            <span class="m-song-sname">{{song.name+' '+song.alia}}</span>

            <span class="m-song-gap">-</span>
            <b class="m-song-autr">{{song.ar.map(ar=>ar.name).join('/')}}</b>
        </h2>
        <div class="m-song-lrc f-pr">
            <p v-if="songLyricLoading" class="m-song-lremp">歌词正在加载...</p>
            <div v-else class="m-song-scroll" :class="lrcTransCls" :style="lrcScrollerStyle">
                <div class="m-song-iner" ref="lycScl" :style="scrollerTransform">
                    <p :key="line.tag" class="m-song-lritem j-lritem" v-for="line in songLyric.lines">
                        <span v-if="!songLyric.hasTrans">
                            {{line.lyric||`&nbsp;`}}
                        </span>
                        <template v-else>
                            <span class="m-song-lrori">{{line.lykelric||`&nbsp;`}}</span>
                            <span class="m-song-lrtra">{{line.tlyric||`&nbsp;`}}</span>
                        </template>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import { createNamespacedHelpers } from 'vuex';
    import findIndex from 'lodash/findIndex';
    import lyric from '@/shared/lyric';
    import song from '@/store/modules/song';
    const {
        mapState,
        mapGetters,
        mapMutations
    } = createNamespacedHelpers(song.namespace);
    export default {
        name: 'song-lyric',
        computed: {
            ...mapState(['lrcIndex', 'songLyricLoading']),
            ...mapState({
                songLyricLoaded(state) {
                    return state.songLyric.loaded;
                }
            }),
            ...mapGetters(['song', 'songLyric']),
            lrcTransCls() {
                return {
                    'm-song-lrtrans': this.songLyric.hasTrans
                }
            },
            lrcScrollerStyle() {
                return this.songLyric._other.outerHeight ? {
                    height: this.songLyric._other.outerHeight + 'px'
                } : {};
            },
            scrollerTransform() {
                let current = 0, transformKey = this.$parent.transform, heights = this.songLyric._other.heights;
                if (heights) {
                    for (var i = 0, len = heights.length; i < len; i++) {
                        if (i < this.lrcIndex - 1) {
                            current += heights[i];
                        } else {
                            break;
                        }
                    }
                    return {
                        [transformKey]: `translateY(-${current}px)`
                    };
                }
                return {
                    [transformKey]: `translateY(0px)`
                }
            }
        },
        watch: {
            songLyricLoaded(val) {
                this.$nextTick(() => {
                    val && this.resize();
                });
            }
        },
        methods: {
            resize() {
                let lritems = document.querySelectorAll('.j-lritem');
                if (!lritems || lritems.length === 0) {
                    return this.removeResize();
                }
                let _other = lyric.getOtherData({
                    lyric: this.songLyric,
                    lritems
                });
                this.setLyricOtherData(_other);
            },
            setLrcScrollerTimer() {
                let lines = this.songLyric.lines,
                    audio = this.$parent.$refs.songAudio.el;
                this.start = Date.now() - audio.currentTime * 1000
                this.lyrSclTimer = setInterval(() => {
                    this.now = Date.now();
                    let slaped = this.now - this.start,
                        current = findIndex(lines, (lyr, index) => {
                            return index === lines.length - 1 ||
                                (
                                    slaped >= lyr.time * 1000 &&
                                    slaped <= lines[index + 1].time * 1000
                                )
                        });
                    current !== this.last && (
                        this.last = current,
                        this.setLyricIndex(current),
                        this.setLrcScrollerTransform()
                    );
                }, 16);
            },
            removeLrcScrollerTimer() {
                this.lyrSclTimer && clearInterval(this.lyrSclTimer);
                this.lyrSclTimer = null;
            },
            setLrcScrollerTransform() {
                this.$nextTick(() => {
                    let scrollerEl = this.$refs.lycScl;
                    if (this.lrcIndex > 0) {
                        scrollerEl.childNodes[this.lrcIndex - 1].style.color = ``;
                    }
                    scrollerEl.childNodes[this.lrcIndex].style.color = `rgba(255,255,255,1)`;
                });
            },
            removeResize() {
                window.removeEventListener('resize', this.resize);
            },
            ...mapMutations({
                setLyricOtherData: song.types.SET_SONG_LYRIC_OTHER_DATA,
                setLyricIndex: song.types.SET_SONG_LYRIC_INDEX,
                setLyricLoaded: song.types.SET_SONG_LYRIC_LOADED
            })
        },
        mounted() {
            this.$nextTick(() => {
                this.resize();
            });
            window.addEventListener('resize', this.resize, false);
        },
        destroyed() {
            this.removeLrcScrollerTimer();
            this.removeResize();
            this.setLyricIndex(0);
            this.setLyricLoaded(false);
        }
    }
</script>