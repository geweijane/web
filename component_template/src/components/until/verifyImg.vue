<template>
  <div @click="changeCode">
  <img :src="imgUrl + date" class="canvas" id="canvas">
  <input type="hidden" ref="input" :value="value">
  </div>
</template>
<script>
import {apiBase} from '@/api/api'
export default {
  name: 'verifyImage',
  props: ['value'],
  data () {
    return {
      imgUrl: apiBase + 'auth/verify?output=image&t=',
      date: new Date().getTime()
    }
  },
  methods: {
    changeCode () {
      this.date = new Date().getTime()
      this.$emit('input', '')
    }
  }
}
</script>
<style lang="less" scoped>
  .canvas{
    float: right;
    width: 90%;
    height: 3.2rem;
  }
</style>
