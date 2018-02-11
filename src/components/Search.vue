<template>
    <div class="m-hmsrch">
        <search-input></search-input>
        <search-hot></search-hot>
        <search-suggest></search-suggest>
        <search-result></search-result>
    </div>
</template>
<script>
    import SearchInput from './SearchInput';
    import SearchHot from './SearchHot';
    import SearchSuggest from './SearchSuggest';
    import SearchResult from './SearchResult';
    export default {
        name: 'search',
        components: {
            SearchInput,
            SearchHot,
            SearchSuggest,
            SearchResult
        }
    }
</script>