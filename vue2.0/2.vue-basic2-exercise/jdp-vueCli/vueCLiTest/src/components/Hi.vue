<template>
  <div>
    <h2>{{ msg }}</h2>
    <button @click="goBack">后退</button>
    <button @click="goHome">回到首页</button>
  </div>
</template>

<script>
export default {
  name: 'hi',
  data () {
    return {
      msg: "I'm Hi page!"
    }
  },
  beforeRouteEnter:(to,from,next)=>{
    console.log("准备进入路由模板");
    next();
  },
  beforeRouteLeave:(to,from,next)=>{
    console.log("准备离开路由模板");
    next();
  },
  methods:{
    goBack(){
      this.$router.go(-1)
    },
    goHome(){
      this.$router.push('/');
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
