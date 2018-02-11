<template>
    <section v-show="show" class="m-hotlist">
        <h3 class="title">热门搜索</h3>
        <ul class="list">
            <li :key="index" class="item f-bd f-bd-full" v-for="(item,index) in hots" @click="getSearchResult(item.first)">
                <a class="link" href="javascript:void(0);">
                    {{item.first}}
                </a>
            </li>
        </ul>
    </section>
</template>
<script>
    import { createNamespacedHelpers } from 'vuex';
    import search from '@/store/modules/search';
    const { mapState, mapMutations, mapActions } = createNamespacedHelpers(search.namespace);
    export default {
        name: 'search-hot',
        computed: {
            ...mapState(['keyword', 'result', 'hots']),
            show() {
                return !this.keyword.length && !this.result.length;
            }
        },
        methods: {
            ...mapActions({
                getSearchHot: search.types.GET_HOT,
                getSearchResult: search.types.GET_RESULT
            })
        },
        mounted() {
            this.getSearchHot();
        }
    }
</script>