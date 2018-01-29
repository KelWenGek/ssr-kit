<template>
    <a :key="song.id" class="m-sgitem" :href="'/m/song/'+song.id">
        <div v-if="song.index" :class="['sgfl',song.index<=3?'sgfl-cred':'']">
            {{song.index<10?'0'+song.index:song.index}}
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
    export default {
        name: 'song-item',
        props: ['song']
    }
</script>