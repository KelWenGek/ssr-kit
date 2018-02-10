<template>
    <section v-show="showSuggest" class="m-recom">
        <h3 class="title f-bd f-bd-btm f-thide"> {{`搜索"${keyword}"`}}</h3>
        <div class="u-spin" v-if="suggestionLoading"></div>
        <ul v-else>
            <li :key="item.id" class="recomitem" v-for="item in suggestion">
                <i class="u-svg u-svg-search"></i>
                <span class="f-bd f-bd-btm f-thide">
                    {{item.name}}
                </span>
            </li>
        </ul>
    </section>
</template>
<script>
    import { createNamespacedHelpers } from 'vuex';
    import search from '@/store/modules/search';
    const { mapState } = createNamespacedHelpers(search.namespace);
    export default {
        name: 'search-suggest',
        computed: {
            ...mapState(['keyword', 'suggestionLoading', 'suggestion']),
            showSuggest() {
                return this.keyword.length > 0;
            },
            hasSuggest() {
                return this.suggestion.length > 0;
            }
        }
    }
</script>