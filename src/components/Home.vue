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
    export default {
        name: 'home',
        components: {
            HomeContent: {
                name: 'home-content',
                render(h) {
                    let content;
                    switch (this.$store.state.home.curIndex) {
                        case 1: content = HomeHotList; break;
                        case 2: content = HomeReco; break;
                        default: content = HomeReco; break;
                    }
                    return h(content);
                }
            },
            HomeNav
        },
        data() {
            return {

            }
        },
        computed: {

        },
        asyncData({ store, route }) {
            return new Promise((resolve, reject) => {
                store.dispatch('home/fetchReco').then((res) => {
                    // console.log(res);
                    store.commit('home/setPlaylist', res[0].data.code === 200 ? res[0].data.result.slice(0, 6) : []);
                    store.commit('home/setNewsongs', res[1].data.code === 200 ? res[1].data.result : []);
                    resolve();
                }).catch(reject)
            });
        },
        methods: {
            goToFoo() {
                this.$router.push({
                    name: 'foo'
                })
            }
        }
    }
</script>