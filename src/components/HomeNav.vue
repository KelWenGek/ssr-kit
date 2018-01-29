<template>
    <nav class="f-bd f-bd-btm u-tab">
        <div :key="index" :class="['tabtitle', index===curIndex?'z-selected':'']" v-for="(selection,index) in selections" @click="changeTab(index)">
            <div class="tabtxt">
                <span>{{selection}}</span>
            </div>
        </div>
    </nav>
</template>
<script>
    import { mapState, mapMutations } from 'vuex';
    export default {
        name: 'home-nav',
        data() {
            return {
                selections: ['推荐歌曲', '热歌榜', '搜索']
            }
        },
        computed: {
            ...mapState('home/', ['curIndex'])
        },
        methods: {
            ...mapMutations('home/', {
                changeTab(commit, index) {
                    this.curIndex !== index && commit('changeTab', index)
                }
            })
        }
    }
</script>