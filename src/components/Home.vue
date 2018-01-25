<template>
    <div class="m-home">
        <div class="m-tabarea m-tabarea-index">
            <div class="tabctitem">
                <div class="m-homeremd">
                    <h2 class="remd_tl">
                        推荐歌单
                    </h2>
                    <div class="remd_songs">
                        <div class="remd_ul">
                            <a :key="item.id" class="remd_li" :href="'/m/song/'+item.id" v-for="item in playlist">
                                <div class="remd_img">
                                    <img class="u-img" :src="item.picUrl" />
                                    <span class="u-earp remd_lnum">{{`${(item.playCount / 10e4).toFixed(1)}万`}}</span>
                                </div>
                                <p class="remd_text">{{item.name}}</p>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'home',
        data() {
            return {
            }
        },
        computed: {
            playlist() {
                return this.$store.state.playlist;
            }
        },
        asyncData({ store, route }) {
            return new Promise((resolve, reject) => {
                store.dispatch('fetchPlaylist').then(({ data }) => {
                    if (data.code === 200) {
                        resolve();
                        return store.commit('setPlaylist', data.result.slice(0, 6));
                    }
                    reject({
                        status: 500
                    });
                }).catch(reject)
            });
        },
        methods: {
            add() {
                this.$store.commit('addCount');
            },
            sayHello() {
                console.log('hello kel');
            },
            goToFoo() {
                this.$router.push({
                    name: 'foo'
                })
            }
        }
    }
</script>