<template>
  <div class="canvas" @click="createCode">
    <canvas ref="canvas"></canvas>
    <input type="hidden" :value="code" id="verify"/>
  </div>
</template>
<script>
import {requestVerify} from '@/api/api'
export default {
  name: 'verifyCode',
  data () {
    return {
      code: ''
    }
  },
  props: ['value'],
  methods: {
    randomNum (min, max) {
      return Math.floor(Math.random() * (max - min) + min)
    },
    randomColor (min, max) {
      let r = this.randomNum(min, max)
      let g = this.randomNum(min, max)
      let b = this.randomNum(min, max)
      return 'rgb(' + r + ',' + g + ',' + b + ')'
    },
    createCode () {
      this.$refs.canvas.style.display = 'none'
      requestVerify().then(data => {
        this.$refs.canvas.style.display = ''
        let canvas = this.$refs.canvas
        let width = this.$refs.canvas.parentNode.offsetWidth
        let height = this.$refs.canvas.parentNode.offsetHeight
        // 设置canvas，验证码宽高
        this.$refs.canvas.width = width
        this.$refs.canvas.height = height
        let ctx = canvas.getContext('2d')
        ctx.textBaseline = 'bottom'
        ctx.fillStyle = this.randomColor(180, 240)
        ctx.fillRect(0, 0, width, height)

        let { code } = data
        code = code.toString()
        this.code = code
        this.$emit('change', code)
        for (let i = 0; i < 4; i++) {
          let txt = code[i]
          ctx.fillStyle = this.randomColor(50, 160)
          ctx.font = this.randomNum(20, 30) + 'px SimHei'
          let x = 10 + i * 24
          let y = this.randomNum(20, 30)
          let deg = this.randomNum(-45, 45)
          ctx.translate(x, y)
          ctx.rotate(deg * Math.PI / 180)
          ctx.fillText(txt, 0, 0)
          ctx.rotate(-deg * Math.PI / 180)
          ctx.translate(-x, -y)
        }

        for (let i = 0; i < 2; i++) {
          ctx.strokeStyle = this.randomColor(40, 180)
          ctx.beginPath()
          ctx.moveTo(this.randomNum(0, width), this.randomNum(0, height))
          ctx.lineTo(this.randomNum(0, width), this.randomNum(0, height))
          ctx.stroke()
        }

        for (let i = 0; i < 50; i++) {
          ctx.fillStyle = this.randomColor(0, 255)
          ctx.beginPath()
          ctx.arc(this.randomNum(0, width), this.randomNum(0, height), 1, 0, 2 * Math.PI)
          ctx.fill()
        }
      })
    }
  },
  mounted () {
    this.createCode()
  }
}
</script>
<style lang="less" scoped>
.canvas{
  float: right;
  width: 90%;
  height: 3.2rem;
  & canvas{
    width: 100%;
    height: 100%;
  }
}
</style>
