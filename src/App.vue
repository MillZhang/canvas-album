<template>
  <div id="app">
    <router-view keep-alive transition transition-mode="out-in"></router-view>
  </div>
</template>
<script>
export default {}
</script>
<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
