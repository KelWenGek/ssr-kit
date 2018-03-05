<template>
    <div class="m-home">
        <div class="m-tabarea m-tabarea-index">
            <home-nav></home-nav>
            <div class="m-tabct">
                <home-content></home-content>
            </div>
        </div>
    </div>
</template>
<script>
    import HomeNav from './HomeNav';
    import HomeReco from './HomeReco';
    import HomeHotList from './HomeHotList';
    import Search from './Search';
    import home from '@/store/modules/home';
    export default {
        name: 'home',
        components: {
            HomeContent: {
                name: 'home-content',
                render(h) {
                    let content;
                    switch (this.$store.state.home.curIndex) {
                        case 1: content = HomeHotList; break;
                        case 2: content = Search; break;
                        default: content = HomeReco; break;
                    }
                    return h(content);
                }
            },
            HomeNav
        },
        async asyncData({ store, route }) {
            await store.dispatch(home.namespacedTypes.GET_RECOMMEND);
        }
    }
</script>