<template>
  <el-container direction="vertical" v-if="isLogin" :style="styleClass">
    <navbar></navbar>
    <router-view></router-view>
    <footer-bar></footer-bar>
    <audio src="/static/notify.mp3" autoplay="autoplay" v-if="notifyPlay"></audio>
  </el-container >
</template>
<script >
import Navbar from './navbar/navbar'
import FooterBar from './footer/footer'
import notifyMixin from '@/until/notify'
export default {
  name: 'layout',
  mixins: [notifyMixin],
  data () {
    return {
      autoHeight: [/^\/home$/]
    }
  },
  mounted () {
    if (this.isLogin) {
      this.initNotify()
    }
  },
  computed: {
    isLogin () {
      return JSON.parse(sessionStorage.getItem('user'))
    },
    styleClass () {
      let path = this.$route.path
      let height = 'height: 100%;'
      this.autoHeight.forEach(n => {
        if (n.test(path)) {
          height = 'height: auto;'
        }
      })
      return height
    }
  },
  components: {
    FooterBar,
    Navbar
  }
}

</script>
<style lang="less" scoped>
  .el-container{
    height: 100%;
  }
</style>
