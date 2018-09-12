<template>
    <div :ref="chartRef" ></div>
</template>
<script>
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/tooltip'
export default {
  name: 'simplePie',
  data () {
    return {
      chartPie: null
    }
  },
  props: {
    chartRef: {
      type: String,
      default () {
        return 'chartRef'
      }
    },
    color: {
      type: Array,
      default () {
        return ['#2d7f00', '#b00005', '#cbcbcb']
      }
    },
    data: {
      type: Object,
      default () {
        return {
          legend: [],
          series: [],
          title: ''
        }
      }
    },
    textColor: {
      type: String,
      default () {
        return '#333'
      }
    }
  },
  methods: {
    initChart () {
      let option = {
        color: this.color,
        title: {
          text: this.data.title ? this.data.title : '',
          subtext: this.data.count ? this.data.count : '',
          left: 'center',
          top: 'middle',
          textStyle: {
            color: this.textColor
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)',
          color: '#ffffff'
        },
        legend: {
          orient: 'vertical',
          right: 10,
          top: 'center',
          data: this.data.legend,
          textStyle: {
            color: this.textColor
          }
        },
        series: [
          {
            name: this.data.title ? this.data.title : '',
            type: 'pie',
            center: ['50%', '50%'],
            boundaryGap: ['10%', '20%'],
            radius: ['50%', '90%'],
            label: {
              normal: {
                position: 'inner',
                formatter: '{d}%',
                color: '#ffffff'
              }
            },
            data: this.data.series
          }
        ]
      }
      var chart = this.chartPie = echarts.init(this.$refs[this.chartRef])
      chart.setOption(option)
      window.addEventListener('resize', this.resize)
    },
    resize () {
      this.chartPie.resize()
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
