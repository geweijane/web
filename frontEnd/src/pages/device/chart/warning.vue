<template>
  <div>
    <el-alert v-if="noData" title="暂无设备报警数据" type="error" show-icon :closable="false" style="margin: 2rem 0;">
    </el-alert>
    <div ref="warnChart" v-else style="height: 20rem"></div>
  </div>
</template>
<script>
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/markLine'
import 'echarts/lib/component/toolbox'
import 'echarts/lib/component/legendScroll'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/grid'
import 'echarts/lib/component/dataZoom'
import {catchError, getDeviceWarning} from '@/api/api'
export default {
  name: 'warnChart',
  data () {
    return {
      noData: false,
      chart: null,
      deviceId: this.$route.params.deviceId,
      period: 'year1.5',
      legendType: {
        'leak': '漏电流',
        'temperature': '温度'
      },
      yAxisIndex: {
        'leak': 1,
        'temperature': 0
      },
      baseSize: 60
    }
  },
  methods: {
    resize () {
      this.chart.resize()
    },
    loadData () {
      getDeviceWarning({ deviceName: this.deviceId, period: this.period }).then(datas => {
        let {data} = datas
        if (data.length === 0) {
          this.noData = true
        } else {
          this.parseDate(data)
        }
      }).catch(e => catchError(e, this))
    },
    parseDate (data) {
      let legend = Object.values(this.legendType)
      let series1 = {}
      let xAxis1 = []
      for (let i in data) {
        xAxis1.push(i)
        let temp = data[i]
        for (let n in temp) {
          !series1[n] && (series1[n] = {name: this.legendType[n], data: [], type: 'line', yAxisIndex: this.yAxisIndex[n], markLine: {data: [{type: 'average', name: '平均值'}]}})
          series1[n].data.push(temp[n])
        }
      }
      let size = xAxis1.length
      let series = [...Object.values(series1)]
      this.drawChart(legend, xAxis1, series, size)
    },
    drawChart (legend, xAxis1, series, size) {
      this.chart = echarts.init(this.$refs.warnChart)
      let start = size < this.baseSize ? 0 : Math.floor((1 - 1 / Math.ceil(size / this.baseSize)) * 100)
      this.chart.setOption({
        baseOption: {
          backgroundColor: '#fff',
          title: {
            show: false
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: legend
          },
          xAxis: [
            {
              type: 'category',
              data: xAxis1
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: '温度'
            },
            {
              type: 'value',
              name: '漏电流'
            }
          ],
          grid: {
            top: 30,
            bottom: 60,
            left: 60,
            right: 60
          },
          series: series,
          dataZoom: [
            {
              show: true,
              height: 30,
              bottom: 10,
              start: start,
              end: 100
            },
            {
              show: true,
              type: 'inside',
              start: 0,
              end: 100
            }
          ]
        }
      })
      window.addEventListener('resize', this.resize)
    }
  },
  beforeMount () {
    this.loadData()
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.resize)
    try {
      echarts.dispose(this.$refs.warnChart)
    } catch (e) { }
  }
}
</script>
