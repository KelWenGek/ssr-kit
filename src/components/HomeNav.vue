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
    import { createNamespacedHelpers } from 'vuex';
    import home from '@/store/modules/home';
    const vuexHelper = createNamespacedHelpers(home.namespace);
    export default {
        name: 'home-nav',
        data() {
            return {
                selections: ['推荐歌曲', '热歌榜', '搜索']
            }
        },
        computed: {
            ...vuexHelper.mapState(['curIndex'])
        },
        methods: {
            ...vuexHelper.mapMutations({
                changeTab(commit, index) {
                    this.curIndex !== index && commit(home.types.CHANGE_TAB_INDEX, index)
                }
            })
        }
    }
</script>