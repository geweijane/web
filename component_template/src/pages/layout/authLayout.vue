<template>
  <el-container direction="vertical" :class="{bg: isLogin} ">
    <navbar v-if="!isLogin"></navbar>
    <router-view></router-view>
  </el-container>
</template>
<script>
import Navbar from './navbar/navbar'
export default {
  name: 'AuthLayout',
  components: {
    Navbar
  },
  computed: {
    isLogin () {
      return this.$route.meta.haveNavbar === false
    }
  },
  mounted () {
  }
}
</script>
<style lang="less" scoped>
@import url('../../less/_variables.less');
.el-container {
  height: 100%;
  background-color: #fff;
}
.bg{
  background: url("../../assets/img/bg.jpg") no-repeat center bottom;
  background-size: cover;
}
</style>
