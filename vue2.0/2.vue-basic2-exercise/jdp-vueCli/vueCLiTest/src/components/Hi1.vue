<template>
  <div class="hello">
    <h1>{{ msg }} - {{$route.params.username}}</h1>
  </div>
</template>
<script>
export default {
  name: 'hi1',
  data () {
    return {
      msg: 'Hi, I am Hi1!'
    }
  }
}
</script>
<style scoped>

</style>
