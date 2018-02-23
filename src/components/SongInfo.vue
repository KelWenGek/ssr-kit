<template>
    <div class="m-song-wrap">
        <div class="m-song-disc">
            <div class="m-song-turn">
                <div class="m-song-rollwrap" ref="turn" :style="transformStyle">
                    <div class="m-song-img" :class="circlingCls" ref="roll">
                        <img class="u-img" :src="song.al.picUrl" />
                    </div>
                </div>
                <div class="m-song-lgour" :style="transformStyle">
                    <div class="m-song-light" :class="circlingCls"></div>
                </div>
            </div>
            <span v-if="isPause" class="m-song-plybtn"></span>
        </div>
        <div class="m-song-clickarea" @click="changePlayStatus"></div>
    </div>
</template>
<script>
    import { createNamespacedHelpers } from 'vuex';
    import song from '@/store/modules/song';
    const {
        mapState,
        mapMutations
    } = createNamespacedHelpers(song.namespace);
    export default {
        name: 'song-info',
        data() {
            return {
                transformStyle: {}
            }
        },
        computed: {
            ...mapState(['song', 'songPlay']),
            isPause() {
                return !this.songPlay.playing;
            },
            circlingCls() {
                return {
                    'a-circling': !this.isPause
                }
            }
        },
        methods: {
            setTransformStyle() {
                let songImg = this.$refs.roll,
                    songWrap = this.$refs.turn,
                    transformKey = this.$parent.transform,
                    songImgTransform = getComputedStyle(songImg, null)[transformKey],
                    songWrapTransform = getComputedStyle(songWrap, null)[transformKey];
                let transform = songWrapTransform === 'none' ? songImgTransform : songImgTransform.concat(' ', songWrapTransform);
                this.transformStyle = { [transformKey]: transform }
            },
            ...mapMutations({
                setPlayStatus: song.types.SET_SONG_PLAY_STATUS
            }),
            changePlayStatus() {
                let currentStatus = this.isPause;
                let playWrapper = this.$parent.$refs.songAudio;
                if (!currentStatus && !playWrapper.el.ended) {
                    this.setTransformStyle();
                    this.setPlayStatus(false);
                    playWrapper.el.pause();
                } else {
                    this.setPlayStatus(true);
                    playWrapper.el.play();
                }
            }
        }
    }
</script>