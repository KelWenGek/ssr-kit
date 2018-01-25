<template>
    <div>foo
        <p>{{count}}</p>
        <button @click="add">add</button>
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