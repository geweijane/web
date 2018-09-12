<template>
  <el-container class="home" direction="horizontal">
    <slider-bar @changeItem="changeSlider"></slider-bar>
    <router-view></router-view>
  </el-container>
</template>
<script>
import sliderBar from '../layout/slider/index'
export default {
  name: 'project',
  components: {
    sliderBar
  },
  data () {
    return {

    }
  },
  methods: {
    changeSlider (data) {
      let arr = data[data.length - 1]
      if (arr.area) {
        this.$router.push({path: '/project/' + arr.id + '/device'})
      } else {
        this.$router.push({path: '/project/' + arr.id})
      }
      sessionStorage.setItem('sliderData', JSON.stringify(data))
    }
  },
  beforeDestroy () {
    // sessionStorage.removeItem('sliderData')
  }
}
</script>
<style lang="less" scoped>
  .el-container{
    background: #fff;
  }
</style>
