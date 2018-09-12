<template>
  <div class="jizwitsFooter">
    <div class="footer text-center">
      <p>
        <router-link to="/product">集贤云后台管理系统</router-link>
      </p>
      <p class="copyright">
        ©2018; 深圳市集贤科技有限公司(Uascent)
        <a href="#" target="_blank">粤ICP备11090211号</a>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'footerBar'
}
</script>

<style lang="less" scoped>
.jizwitsFooter{
  .footer{
  }
  .text-center {
    text-align: center;
  }
  a{
    color: #666;
    font-size: 12px;
  }
}
</style>
