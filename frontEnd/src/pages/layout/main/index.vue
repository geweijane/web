<template>
  <el-container class="home" direction="horizontal ">
      <slider-bar></slider-bar>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
  </el-container>
</template>
<script>
import sliderBar from '../slider/index'
export default {
  name: 'home',
  components: {
    sliderBar
  }
}
</script>
<style lang="less" scoped>
  .home{
    background: #ffffff;
    &:after{
      clear: both;
    }
    .main{
      padding: 1rem;
    }
  }
</style>
