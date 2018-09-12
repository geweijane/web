<template>
  <el-container direction="vertical" class="bg">
    <router-view></router-view>
  </el-container>
</template>
<script>
export default {
  name: 'authLayout',
  components: {
  },
  computed: {
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
  background: url("../../assets/img/bg.jpg") no-repeat center center;
  background-size: cover;
}
</style>
