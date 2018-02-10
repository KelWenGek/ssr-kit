<template>
    <form class="m-input f-bd f-bd-btm" method="get" action="#">
        <div class="inputcover">
            <i class="u-svg u-svg-srch"></i>
            <input type="search" name="search" class="input" placeholder="" :value="keyword" @input.trim="searchInput" autoComplete="off"
            />
            <label class="holder">{{!hasWord?'搜索歌曲、歌手、专辑':''}}</label>
            <figure class="close">
                <i :class="['u-svg','u-svg-empty',hasWord?'z-show':'']" @click="setKeyword('')"></i>
            </figure>
        </div>
    </form>
</template>
<script>
    import { createNamespacedHelpers } from 'vuex';
    import search from '@/store/modules/search';
    const { mapState, mapMutations, mapActions } = createNamespacedHelpers(search.namespace);
    export default {
        name: 'search-input',
        computed: {
            ...mapState(['keyword']),
            hasWord() {
                return this.keyword.length > 0;
            }
        },
        watch: {

        },
        methods: {
            ...mapMutations({
                setKeyword: search.types.SET_KEYWORD
            }),
            ...mapActions({
                doSuggest: search.types.GET_SUGGEST
            }),
            searchInput(event) {
                let value = event.target.value;
                this.setKeyword(value);
                if (value) {
                    this.doSuggest(value);
                }
            }
        }
    }
</script>