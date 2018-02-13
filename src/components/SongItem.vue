<template>
    <a :key="song.id" class="m-sgitem" :href="'/song/'+song.id">
        <div v-if="hasIndex" class="sgfl" :class="songClass">
            {{songIndex}}
        </div>
        <div class="sgfr f-bd f-bd-btm">
            <div class="sgchfl">
                <div class="f-thide sgtl">
                    {{song.name}}
                    <span class="sgalia">
                        {{song.alias[0]}}
                    </span>
                </div>
                <div class="f-thide sginfo">
                    <i class="u-hmsprt sghot"></i>
                    {{song.artists[0].name}}-
                    <p v-if="song.highlight" class="hcover">
                        <span class="highlight">
                            {{song.album.name}}
                        </span>
                    </p>
                    <span v-else>
                        {{ song.album.name}}
                    </span>
                </div>
            </div>
            <div class="sgchfr">
                <span class="u-hmsprt sgchply"></span>
            </div>
        </div>
    </a>
</template>
<script>
    import { pad } from '@/shared/util';
    export default {
        name: 'song-item',
        props: ['song'],
        computed: {
            songIndex() {
                return pad(this.song.index, '0');
            },
            hasIndex() {
                return this.song.index != undefined;
            },
            songClass() {
                return {
                    'sgfl-cred': this.hasIndex && parseInt(this.song.index) <= 3 && this.song.highlight
                }
            }
        }
    }
</script>