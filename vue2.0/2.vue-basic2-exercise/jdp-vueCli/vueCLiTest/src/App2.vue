<template>
  <div id="app">
    <img src="./assets/logo.png">
    <p>
      导航 ：
      <router-link to="/">首页</router-link> |
      <router-link to="/hi">Hi页面</router-link> |
      <router-link to="/hi/hi1">Hi页面1</router-link> |
      <router-link to="/hi/hi2">Hi页面2</router-link> |
      <router-link :to="{name:'/hello/hi/hi1',params:{username:'evrygo'}}">Hi页面</router-link> |
      <router-link to="/test/99/重大发现">test</router-link>
    </p>
    <p>{{ $route.name }}</p>
    <router-view></router-view>
    // <router-view name="left" style="float:left;width:50%;height:100px;background-color:gray;"></router-view>
    // <router-view name="right" style="float:left;width:50%;height:100px;background-color:#eee;"></router-view>
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
</style>
