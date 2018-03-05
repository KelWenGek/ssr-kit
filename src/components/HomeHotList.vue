<template>
    <div class="m-hmhot">
        <div class="hotcont">
            <div v-if="topLoading" class="u-spin"></div>
            <div v-else class="m-sglst">
                <song-item v-for="song in showHotList" :key="song.id" :song="song" />
            </div>
        </div>
        <div v-if="canCheckFull" class="hotdn">
            <span class="hotview" @click="checkFull">查看完整榜单</span>
        </div>
    </div>
</template>
<script>
    import { createNamespacedHelpers } from 'vuex';
    import home from '@/store/modules/home';
    import SongItem from './SongItem';
    const {
        mapState,
        mapGetters,
        mapMutations,
        mapActions
    } = createNamespacedHelpers(home.namespace);
    export default {
        name: 'home-hot-list',
        components: {
            SongItem
        },
        data() {
            return {
                pageIndex: 1,
                pageSize: 20,
                fullChecked: false
            }
        },
        computed: {
            ...mapState({
                topLoading: 'topLoading'
            }),
            ...mapGetters(['top', 'slicedHotList']),
            showHotList() {
                return this.slicedHotList(0, this.pageSize * this.pageIndex).map((item, index) => {
                    return {
                        index: index + 1,
                        highlight: true,
                        id: item.id,
                        name: item.name,
                        alias: item.alia,
                        artists: item.ar,
                        album: item.al
                    };
                })
            },
            hasItem() {
                return this.top.length > 0;
            },
            canCheckFull() {
                return this.hasItem && !this.fullChecked;
            }
        },
        methods: {
            ...mapActions({
                getHotList: home.types.GET_HOT_LIST
            }),
            checkFull() {
                this.pageIndex = Math.ceil(this.top.length / this.pageSize);
                this.fullChecked = true;
            }
        },
        mounted() {
            this.getHotList();
        }
    }
</script>