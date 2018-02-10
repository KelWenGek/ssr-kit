<template>
    <div class="m-hmsrch">
        <search-input></search-input>
        <search-hot></search-hot>
        <search-suggest></search-suggest>
    </div>
</template>
<script>
    import SearchInput from './SearchInput';
    import SearchHot from './SearchHot';
    import SearchSuggest from './SearchSuggest';
    export default {
        name: 'search',
        components: {
            SearchInput,
            SearchHot,
            SearchSuggest
        }
    }
</script>