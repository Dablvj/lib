<template>
    <div>
        <h2>{{msg}}</h2>
        <hr/>
        <h3>{{count}}</h3>
        <div>
            <button @click="$store.commit('add')">+</button>
            <button @click="$store.commit('reduce')">-</button>
        </div>
    </div>
</template>
<script>
    import store from '@/vuex/store'
    export default{
        data(){
            return{
                msg:'Hello Vuex',

            }
        },
        computed:{
            count(){
                return this.$store.state.count
            }
        },
        store
    }
</script>
