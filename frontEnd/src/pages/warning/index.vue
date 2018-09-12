<template>
  <el-container class="home" direction="horizontal">
    <slider-bar @changeItem="changeSlider"></slider-bar>
    <router-view></router-view>
  </el-container>
</template>
<script>
import sliderBar from '../layout/slider/index'
export default {
  name: 'warning',
  components: {
    sliderBar
  },
  data () {
    return {

    }
  },
  methods: {
    changeSlider (data) {
      sessionStorage.setItem('sliderData', JSON.stringify(data))
      let arr = data[data.length - 1]
      if (arr.area) {
        this.$router.push({path: '/warning?project=' + arr.id})
      } else {
        this.$router.push({path: '/warning?area=' + arr.id})
      }
    }
  }
}
</script>
<style lang="less" scoped>
  .el-container{
    background: #fff;
  }
</style>
