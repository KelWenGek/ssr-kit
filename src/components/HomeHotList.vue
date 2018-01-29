<template>
    <div class="m-hmhot">
        <div class="hotcont">
            <div v-if="!hasItem" class="u-spin"></div>
            <div v-else class="m-sglst">
                <song-item v-for="song in hotList" :key="song.id" :song="song" />
            </div>
        </div>
        <div v-if="hasItem" class="hotdn">
            <span class="hotview">查看完整榜单</span>
        </div>
    </div>
</template>
<script>
    import { mapState, mapMutations } from 'vuex';
    import SongItem from './SongItem';
    export default {
        name: 'home-hot-list',
        components: {
            SongItem
        },
        computed: {
            ...mapState('home/', {
                hotList(state) {
                    return state.hotList.map((item, index) => {
                        return {
                            index: index + 1,
                            highlight: true,
                            id: item.id,
                            name: item.name,
                            alias: item.alia,
                            artists: item.ar,
                            album: item.al
                        };
                    }).slice(0, 20);
                }
            }),
            hasItem() {
                return this.hotList.length > 0;
            }
        },
        methods: {
            ...mapMutations('home/', {
                setHotList(commit, hotList) {
                    commit('setHotList', hotList);
                }
            })
        },
        mounted() {
            this.$http.get('/top/list?idx=1').then(({ data }) => {
                if (data.code === 200) {
                    this.setHotList(data.playlist.tracks);
                }
            })
        }
    }
</script>