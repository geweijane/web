<template>
  <el-container class="home" direction="horizontal ">
    <slider-bar></slider-bar>
    <el-container>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
      <el-footer>
        <footer-bar></footer-bar>
      </el-footer>
    </el-container>
  </el-container>
</template>
<script>
import footerBar from '../footer/footer'
import sliderBar from '../slider/index'
export default {
  name: 'home',
  components: {
    footerBar,
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
