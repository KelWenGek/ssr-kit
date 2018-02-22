<template>
    <div class="m-song-iner">
        <p :key="line.tag" class="m-song-lritem j-lritem" v-for="line in lyric.lines">
            <span v-if="!lyric.hasTrans">
                {{line.lyric||`&nbsp;`}}
            </span>
            <template v-else>
                <span class="m-song-lrori">{{line.lyric||`&nbsp;`}}</span>
                <span class="m-song-lrtra">{{line.tlyric||`&nbsp;`}}</span>
            </template>
        </p>
    </div>
</template>
<script>
    export default {
        name: 'lyric-scroller',
        props: ['lyric', 'index'],
        computed: {
            scrollerTransform() {
                let current = 0, heights = this.lyric._other.heights;
                for (var i = 0, len = heights.length; i < len; i++) {
                    if (i < this.index) {
                        current += heights[i];
                    } else {
                        break;
                    }
                }
                // return `translateY(-${current}px)`;
                return {
                    transform: `translateY(-${current}px)`
                };
            }
        },
        methods: {
            getScrollerTransform() {
                let current = 0, heights = this.lyric._other.heights;
                for (var i = 0, len = heights.length; i < len; i++) {
                    if (i < this.index) {
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
            // this.$nextTick(() => {
            //     this.$refs.lycScl.childNodes[this.index - 1].style.color = ``;
            //     this.$refs.lycScl.childNodes[this.index].style.color = `rgba(255,255,255,1)`;
            //     this.$refs.lycScl.style.transform = this.getScrollerTransform();
            // })
        }
    }
</script>