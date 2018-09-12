<template>
  <div class="map" :ref="chartRef"></div>
</template>
<script>
import echarts from 'echarts'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/grid'
import 'echarts/lib/component/title'
export default {
  name: 'gauge',
  data () {
    return {
      map: null
    }
  },
  props: {
    chartRef: {
      type: String,
      default () {
        return 'chartRef'
      }
    },
    title: {
      type: String,
      default () {
        return ''
      }
    },
    value: {
      type: Number,
      default () {
        return 0
      }
    },
    warnValue: {
      type: Number,
      default () {
        return 70
      }
    },
    diff: {
      type: Number,
      default () {
        return 10
      }
    }
  },
  computed: {
    color () {
      let color = '#068E06'
      if (this.value > this.warnValue) {
        color = '#fd4d49'
      } else if (this.value >= (this.warnValue - this.diff) && this.value < this.warnValue) {
        color = '#FF9500'
      }
      return color
    },
    max () {
      let max = this.warnValue > 120 ? this.warnValue : 120
      if (this.value > this.warnValue) {
        max = max > (this.value + 20) ? max : (this.value + 20)
      } else if (this.value >= (this.warnValue - this.diff) && this.value < this.warnValue) {
        max = max > (this.warnValue + 20) ? max : (this.warnValue + 20)
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
        grid: {
          left: 0,
          right: 0,
          top: 0,
          bottom: 20
        },
        yAxis: [
          {
            show: false,
            min: 0,
            max: this.max
          }, {
            show: false,
            data: [],
            min: 0,
            max: this.max
          }
        ],
        xAxis: [
          {
            show: false,
            data: []
          }, {
            show: false,
            data: []
          }, {
            show: false,
            data: []
          }
        ],
        series: [
          {
            name: '条',
            type: 'bar',
            xAxisIndex: 0,
            data: [this.value],
            barWidth: 5,
            itemStyle: {
              normal: {
                color: this.color,
                barBorderRadius: 0
              }
            },
            label: {
              normal: {
                show: true,
                position: 'top',
                offset: [35, 10],
                formatter: function (param) {
                  return param.value + '°C'
                },
                textStyle: {
                  color: this.color,
                  fontSize: '12'
                }
              }
            },
            z: 2
          },
          {
            name: '白框',
            type: 'bar',
            xAxisIndex: 1,
            barGap: '-100%',
            data: [this.max - 10],
            barWidth: 12,
            itemStyle: {
              normal: {
                color: '#ffffff',
                barBorderRadius: 50
              }
            },
            z: 1
          },
          {
            name: '外框',
            type: 'bar',
            xAxisIndex: 2,
            barGap: '-100%',
            data: [this.max - 8],
            barWidth: 16,
            itemStyle: {
              normal: {
                color: this.color,
                barBorderRadius: 50
              }
            },
            z: 0
          },
          {
            name: '圆',
            type: 'scatter',
            hoverAnimation: false,
            data: [0],
            xAxisIndex: 0,
            symbolSize: 16,
            itemStyle: {
              normal: {
                color: this.color,
                opacity: 1
              }
            },
            z: 2
          },
          {
            name: '白圆',
            type: 'scatter',
            hoverAnimation: false,
            data: [0],
            xAxisIndex: 1,
            symbolSize: 24,
            itemStyle: {
              normal: {
                color: '#ffffff',
                opacity: 1
              }
            },
            z: 1
          },
          {
            name: '外圆',
            type: 'scatter',
            hoverAnimation: false,
            data: [0],
            xAxisIndex: 2,
            symbolSize: 28,
            itemStyle: {
              normal: {
                color: this.color,
                opacity: 1
              }
            },
            z: 0
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
