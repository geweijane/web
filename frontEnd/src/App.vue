<template>
  <div id="app">
    <auth-layout v-if="isAuth"></auth-layout>
    <layout v-else></layout>
  </div>
</template>
<script>
import Layout from './pages/layout/layout'
import AuthLayout from './pages/layout/authLayout'
export default {
  name: 'App',
  components: {
    Layout,
    AuthLayout
  },
  computed: {
    isAuth () {
      return this.$route.path.match('auth')
    }
  }
}
</script>
<style lang="less">
  @import "less/main";
  html, body{
    height: 100%;
    margin: 0;
    padding: 0;
    background: #E9EEF3;
  }
  #app {
    height: 100%;
  }
</style>
