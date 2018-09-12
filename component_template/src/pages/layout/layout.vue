<template>
  <el-container direction="vertical" v-if="isLogin">
    <navbar></navbar>
    <router-view></router-view>
  </el-container >
</template>
<script >
import Navbar from './navbar/navbar'
export default {
  name: 'layout',
  mounted () {
  },
  computed: {
    isLogin () {
      return JSON.parse(localStorage.getItem('user'))
    }
  },
  components: {
    Navbar
  }
}

</script>
<style lang="less" scoped>
  .el-container{
    height: 100%;
  }
</style>
