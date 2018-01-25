<template>
    <div>home
        <button @click="sayHello">click hello</button>
    </div>

</template>
<script>
    export default {
        name: 'home',
        methods: {
            sayHello() {
                console.log('hello kel');
            }
        }
    }
</script>