<template>
    <div class="m-song-info">
        <h2 class="m-song-h2">
            <span class="m-song-sname">{{song.name}}</span>
            <span class="m-song-gap">-</span>
            <b class="m-song-autr">{{song.ar.map(ar=>ar.name).join('/')}}</b>
        </h2>
        <div class="m-song-lrc f-pr">
            <div class="m-song-scroll" :class="lrcTransCls" :style="lrcScrollerStyle">
                <lyric-scroller :index="lrcIndex" :lyric="songLyric" ref="lycScl" />
            </div>
        </div>
    </div>
</template>
<script>
    import { createNamespacedHelpers } from 'vuex';
    import findIndex from 'lodash/findIndex';
    import LyricScroller from './LyricScroller';
    import lyric from '@/shared/lyric';
    import song from '@/store/modules/song';
    const {
        mapState,
        mapMutations
    } = createNamespacedHelpers(song.namespace);
    export default {
        name: 'song-lyric',
        components: {
            LyricScroller
        },
        computed: {
            ...mapState(['song', 'songLyric', 'lrcIndex']),
            lrcTransCls() {
                return {
                    'm-song-lrtrans': this.songLyric.hasTrans
                }
            },
            lrcScrollerStyle() {
                return this.songLyric._other.outerHeight ? {
                    height: this.songLyric._other.outerHeight + 'px'
                } : {};
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
                console.log(this.songLyric.lines);
                console.log(_other);
                this.setLyricOtherData(_other);
            },
            setLrcScrollerTimer() {
                let lines = this.songLyric.lines, audio = this.$parent.$refs.songAudio.el;
                this.start = Date.now() - audio.currentTime * 1000
                this.lyrSclTimer = setInterval(() => {
                    this.now = Date.now();
                    let slaped = this.now - this.start,
                        current = findIndex(lines, (lyr, index) => {
                            return index === lines.length - 1 || (slaped >= lyr.time * 1000 && slaped <= lines[index + 1].time * 1000)
                        });
                    current !== this.last && (this.last = current, this.setLyricIndex(current), this.setLrcScrollerTransform());
                }, 16);
            },
            setLrcScrollerTransform() {
                this.$nextTick(() => {
                    let scrollerEl = this.$refs.lycScl.$el;
                    if (this.lrcIndex > 0) {
                        scrollerEl.childNodes[this.lrcIndex - 1].style.color = ``;
                    }
                    scrollerEl.childNodes[this.lrcIndex].style.color = `rgba(255,255,255,1)`;
                    scrollerEl.style.transform = this.getScrollerTransform();
                });
            },
            removeResize() {
                window.removeEventListener('resize', this.resize);
            },
            ...mapMutations({
                setLyricOtherData: song.types.SET_SONG_LYRIC_OTHER_DATA,
                setLyricIndex: song.types.SET_SONG_LYRIC_INDEX
            }),
            getScrollerTransform() {
                let current = 0, heights = this.songLyric._other.heights;
                for (var i = 0, len = heights.length; i < len; i++) {
                    if (i < this.lrcIndex) {
                        current += heights[i];
                    } else {
                        break;
                    }
                }
                return `translateY(-${current}px)`;
                // return {
                //     transform: `translateY(-${current}px)`
                // };
            }
        },
        mounted() {
            this.resize();
            this.$nextTick(() => {
                this.setLrcScrollerTimer();

            });
            window.addEventListener('resize', this.resize, false);
        }
    }
</script>