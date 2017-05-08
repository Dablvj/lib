<template>
  <div class="hello">
    <h1>{{ msg }} - {{$route.params.id}} - {{$route.params.title}}</h1>
  </div>
</template>
<script>
export default {
  name: 'Params',
  data () {
    return {
      msg: 'Hi, I am params!'
    }
  }
}
</script>
<style scoped>

</style>
