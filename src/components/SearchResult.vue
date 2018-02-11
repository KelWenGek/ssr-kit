<template>
    <div class="m-searchresult">
        <div class="u-spin" v-if="resultLoading"></div>
        <section class="m-songlist" v-else>
            <div class="m-sglst">
                <song-item :key="item.id" v-for="item in showResult" :song="item" />
            </div>
        </section>
    </div>
</template>
<script>
    import { createNamespacedHelpers } from 'vuex';
    import search from '@/store/modules/search';
    import SongItem from './SongItem';
    const {
        mapState,
        mapGetters
    } = createNamespacedHelpers(search.namespace);
    export default {
        name: 'search-result',
        components: {
            SongItem
        },
        data() {
            return {
                pageIndex: 1,
                pageSize: 20
            }
        },
        computed: {
            ...mapState(['result', 'resultLoading']),
            ...mapGetters(['slicedResult']),
            showResult() {
                return this.slicedResult(0, this.pageSize * this.pageIndex).map((item, index) => {
                    let { id, name, artists, album, alias } = item;
                    return {
                        index: index + 1,
                        id,
                        name,
                        artists,
                        album,
                        alias
                    }
                });
            }
        }
    }
</script>