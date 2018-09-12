<template>
  <el-container class="home" direction="horizontal">
    <slider-bar @changeItem="changeSlider"></slider-bar>
    <router-view></router-view>
  </el-container>
</template>
<script>
import sliderBar from '../../layout/slider/index'
export default {
  name: 'sliderView',
  components: {
    sliderBar
  },
  data () {
    return {
    }
  },
  methods: {
    changeSlider () {
    }
  }
}
</script>
<style lang="less" scoped>
  .el-container{
    background: #fff;
  }
</style>
