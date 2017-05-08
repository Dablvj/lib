<template>
  <div id="app">
    <img src="./assets/logo.png">
    <p>
      导航 ：
      <router-link to="/">首页</router-link> |
      <router-link to="/test/99/119事件">119事件</router-link> |
      <router-link to="/redirect/100/重大发现">重大发现</router-link> |
      <router-link to="/redirect/1002/重大发现2">重大发现2</router-link> |
      <router-link to="/hi">三峡水库</router-link> |
      <router-link to="/evrygo">三峡水库2</router-link>
    </p>
    <transition name="fade" mode="in-out">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.fade-enter{
  opacity:0;
}

.fade-leave{
  opacity:1;
}
.fade-enter-active{
  transition:opacity 0.5s;
}

.fade-leave-active{
  opacity:0;
  transition:opacity 0.5s;
}
</style>
