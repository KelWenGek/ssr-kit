<template>
    <div class="m-playlist u-paddlr u-paddbm">
        <section class="u-plhead pylst_header">
            <div class="plhead_bg" :style="{ backgroundImage: 'url('+playlist.coverImgUrl+')'}">
            </div>
            <div class="plhead_wrap">
                <div class="plhead_fl lsthd_fl">
                    <img class="u-img" :src="playlist.coverImgUrl" />
                    <span class="lsthd_icon">歌单</span>
                    <i class="u-earp lsthd_num">{{`${(playlist.playCount / Math.pow(10, 4 )).toFixed(1)}万`}}</i>
                </div>
                <div class="plhead_fr">
                    <h2 class="f-thide2 f-brk lsthd_title">{{playlist.name}}</h2>
                    <div class="lsthd_auth f-thide">
                        <a class="lsthd_link" :href="'/m/user/'+playlist.creator.userId" }>
                            <div class="u-avatar lsthd_ava">
                                <img class="u-img" :src="playlist.creator.avatarUrl" />
                            </div>{{playlist.creator.nickname}}
                        </a>
                    </div>
                </div>
            </div>
        </section>
        <section class="pylst_intro">
            <div class="lstit_tags">
                标签：
                <em :key="index" class="f-bd f-bd-full lstit_tag" v-for="(tag,index) in playlist.tags">{{tag}}</em>
            </div>
            <div class="u-intro">
                <div :class="['f-brk', !isExpanded? 'f-thide3':'' ]">
                    <span :key="index" v-for="(desc,index) in descriptions">
                        <i>
                            {{desc}}
                        </i>
                        <br v-if="index!==descriptions.length-1" />
                    </span>
                </div>
                <span :class="['intro_arrow', isExpanded ? 'u-arowup' : 'u-arowdown']" @click="toggleExpand"></span>
            </div>
        </section>
        <div class="pylst_list">
            <h3 class="u-smtitle">歌曲列表</h3>
            <ol class="u-songs">
                <song-item :key="item.id" :song="item" v-for="item in playlistSongs" />
            </ol>
        </div>
        <div class="m-talk">
            <div class="m-comments">
                <h4 class="cmt_title">精彩评论</h4>
                <playlist-comment :comments="hotComments" />
            </div>
            <div class="m-comments">
                <h4 class="cmt_title">{{`最新评论(${total})`}}</h4>
                <playlist-comment :comments="comments" />
            </div>
            <div class="cmt_more f-bd f-bd-top" v-if="playlistCmt.more">
                <span class="box">
                    {{`查看全部${total}条评论`}}
                    <i></i>
                </span>
            </div>
        </div>
    </div>
</template>
<script>
    import SongItem from './SongItem';
    import PlaylistComment from './PlaylistComment';
    import playlist from '@/store/modules/playlist';
    import { createNamespacedHelpers } from 'vuex';
    const { mapState } = createNamespacedHelpers(playlist.namespace);
    export default {
        name: 'playlist',
        components: {
            SongItem,
            PlaylistComment
        },
        data() {
            return {
                isExpanded: false
            }
        },
        computed: {
            ...mapState(['playlist', 'playlistCmt']),
            hotComments() {
                return this.playlistCmt.hotComments;
            },
            comments() {
                return this.playlistCmt.comments;
            },
            total() {
                return this.playlistCmt.total;
            },
            descriptions() {
                return this.playlist.description.split('\n');
            },
            playlistSongs() {
                return this.playlist.tracks.slice(0, 40).map((item, index) => ({
                    index: index + 1,
                    id: item.id,
                    name: item.name,
                    artists: item.ar,
                    alias: item.alia,
                    album: item.al,
                    highlight: true
                }))
            }
        },
        methods: {
            toggleExpand() {
                this.isExpanded = !this.isExpanded;
            }
        },
        asyncData({ store, route }) {
            return new Promise((resolve, reject) => {
                store.dispatch(playlist.namespacedTypes.GET_PLAYLIST, route.params.id).then(resolve).catch(reject);
            });
        }
    }
</script>