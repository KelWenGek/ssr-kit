<template>
    <div>foo
        <p>{{count}}</p>
        <button @click="add">add</button> <br/>
        <button @click="goToHome">go to home</button>
    </div>
</template>
<script>
    export default {
        name: 'foo',
        data() {
            return {
                count: 0
            }
        },
        asyncData({ store, route }) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve();
                }, 100);
            })
        },
        methods: {
            add() {
                this.count += 1;
            },
            goToHome() {
                this.$router.push({
                    name: 'home'
                });
            }
        }
    }
</script>