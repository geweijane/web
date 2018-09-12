<template>
  <div class="map" :ref="chartRef"></div>
</template>
<script>
import echarts from 'echarts'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/tooltip'

export default {
  name: 'galv',
  data () {
    return {
      map: null
    }
  },
  props: {
    title: {
      type: String,
      default () {
        return ''
      }
    },
    chartRef: {
      type: String,
      default () {
        return 'chartRef'
      }
    },
    unit: {
      type: String,
      default () {
        return 'A'
      }
    },
    warnValue: {
      type: Number,
      default () {
        return 0
      }
    },
    value: {
      type: Number,
      default () {
        return 0
      }
    },
    diff: {
      type: Number,
      default () {
        return 100
      }
    }
  },
  computed: {
    color () {
      let color = '#068E06'
      if (this.warnValue) {
        if (this.value > this.warnValue) {
          color = '#fd4d49'
        } else if (this.value >= (this.warnValue - this.diff) && this.value <= this.warnValue) {
          color = '#FF9500'
        }
      }
      return color
    },
    max () {
      let max = this.warnValue ? this.warnValue : 100
      if (this.warnValue) {
        if (this.value > this.warnValue) {
          max = this.value + 20
        } else if (this.value >= (this.warnValue - this.diff) && this.value <= this.warnValue) {
          max = this.warnValue + 40
        }
      }
      return max
    }
  },
  methods: {
    initChart () {
      let map = this.map = echarts.init(this.$refs[this.chartRef])
      let option = {
        backgroundColor: '#e7eee6',
        title: {
          text: this.title,
          textStyle: {
            fontSize: '14',
            fontWeight: '500'
          }
        },
        tooltip: {
          show: false,
          formatter: '{a} <br/>{b} : {c}%'
        },
        series: [
          {
            name: '外围刻度',
            type: 'gauge',
            radius: '75%',
            center: ['50%', '70%'],
            startAngle: 180,
            endAngle: 0,
            axisLine: {
              lineStyle: {
                width: 1,
                color: [
                  [1, this.color]
                ]
              }
            },
            splitLine: {
              length: -6,
              lineStyle: {
                color: this.color,
                width: 1
              }
            },
            axisLabel: {
              show: false
            },
            axisTick: {
              splitNumber: 1,
              lineStyle: {
                opacity: 0
              }
            },
            detail: {
              show: false
            },
            pointer: {
              show: false
            }
          },
          {
            name: '内层数据刻度',
            type: 'gauge',
            radius: '70%',
            center: ['50%', '70%'],
            min: 0,
            max: this.max,
            startAngle: 180,
            endAngle: 0,
            axisLine: {
              lineStyle: {
                opacity: 0
              }
            },
            splitLine: {
              length: 20
            },
            axisLabel: {
              show: false
            },
            detail: {
              formatter: '{value} ' + this.unit,
              offsetCenter: [0, '50%'],
              color: this.color,
              fontSize: 12
            },
            itemStyle: {
              normal: {
                color: this.color
              }
            },
            pointer: {
              width: 2,
              length: '90%'
            },
            data: [{
              value: this.value
            }]
          },
          {
            name: '最内层线',
            type: 'gauge',
            radius: '35%',
            center: ['50%', '70%'],
            startAngle: 180,
            endAngle: 0,
            axisLine: {
              lineStyle: {
                width: 1,
                color: [
                  [1, this.color]
                ]
              }
            },
            splitLine: {
              length: -6,
              lineStyle: {
                opacity: 0
              }
            },
            axisLabel: {
              show: false
            },
            axisTick: {
              splitNumber: 1,
              lineStyle: {
                opacity: 0
              }
            },
            detail: {
              show: false
            },
            pointer: {
              show: false
            }
          }
        ]
      }
      map.setOption(option)
      window.addEventListener('resize', this.resize)
    },
    resize () {
      this.map.resize()
    }
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.resize)
    echarts.dispose(this.$refs[this.chartRef])
  },
  mounted () {
    this.initChart()
  }
}
</script>
<style lang="less" scoped>
  .map{
    margin: 0 .5rem;
    height: 10rem;
  }
</style>
