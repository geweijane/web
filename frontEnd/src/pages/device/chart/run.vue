<template>
  <div>
    <el-alert v-if="noData" title="暂无设备运行数据" type="error" show-icon :closable="false" style="margin: 2rem 0;">
    </el-alert>
    <div ref="logChart" v-else style="height: 74rem;"></div>
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
import {catchError, deviceLogData} from '@/api/api'
export default {
  name: 'logChart',
  data () {
    return {
      colors: ['#FF9500', '#068E06', '#ff0000', '#9000FF', '#7C5E93', '#580B94', '#3A0364', '#890DD3', '#333333'],
      noData: false,
      chart: null,
      chartPer: 500,
      chartData: {},
      deviceId: this.$route.params.deviceId,
      pageSize: 12 * 60 * 2,
      timer: null
    }
  },
  methods: {
    getData (pageSize) {
      deviceLogData({ deviceName: this.deviceId, per_page: pageSize }).then(datas => {
        let {data} = datas
        if (data.length === 0) {
          this.noData = true
          return false
        }
        if (!this.chart) {
          this.initChart(data.length)
        }
        this.parseData(data)
      }).catch(e => catchError(e, this))
    },
    parseData (data) {
      let chartData = this.chartData = { ...this.chartData, ...data }
      let xAxis = []
      let res = {}
      let legends = {}
      let leakRange = [500, 0]
      let currentRange = [500, 0]
      let tempRange = [100, 0]
      let m = 100 // 温度线路编号
      let zero = {
        leak01: 0,
        temperature017: 0,
        temperature018: 0,
        temperature019: 0,
        temperature020: 0,
        current02: 0,
        current03: 0,
        current04: 0
      }

      for (let date in chartData) {
        let color = '#0000ff' // 漏电流颜色
        xAxis.push(date)
        chartData[date] = { ...zero, ...chartData[date] }
        for (let item in chartData[date]) {
          let dataType = item.indexOf('leak') // 0漏电流 1电流 2温度
          if (dataType === -1) {
            dataType = item.indexOf('temperature') === 0 ? 2 : 1
          }
          // 图例
          if (chartData[date][item]) {
            legends[item] = {
              name: name,
              icon: 'circle'
            }
          }
          if (!res[item]) {
            let tmp = item.match(/\d+/g)
            let module = parseInt(tmp[0])
            let legend = '线路' + module
            let name = legend
            switch (dataType) {
              case 1:
                name += '电流'
                let str = module.toString()
                color = this.colors[parseInt(str.substring(str.length - 1)) - 2]
                break
              case 2:
                name += '温度'
                m = m >= 7 ? 3 : m + 1
                color = this.colors[m]
                break
              case 0:
                name += '漏电流'
                color = '#0000ff'
                break
              default:
                break
            }
            res[item] = {
              name: name,
              type: 'line',
              smooth: true,
              showSymbol: false,
              yAxisIndex: dataType,
              xAxisIndex: dataType,
              data: [],
              itemStyle: {
                normal: {
                  color: color
                }
              }
            }
          }
          res[item].data.push(chartData[date][item])
          switch (dataType) {
            case 1:
              if (chartData[date][item] > currentRange[1]) {
                currentRange[1] = chartData[date][item]
              }
              if (chartData[date][item] < currentRange[0]) {
                currentRange[0] = chartData[date][item]
              }
              break
            case 2:
              if (chartData[date][item] > tempRange[1]) {
                tempRange[1] = chartData[date][item]
              }
              if (chartData[date][item] < tempRange[0]) {
                tempRange[0] = chartData[date][item]
              }
              break
            case 0:
              if (chartData[date][item] > leakRange[1]) {
                leakRange[1] = chartData[date][item]
              }
              if (chartData[date][item] < leakRange[0]) {
                leakRange[0] = chartData[date][item]
              }
              break
            default:
              break
          }
        }
      }
      legends = Object.values(this.sortObject(legends))
      this.drawChart(xAxis, Object.values(res), legends, leakRange, currentRange, tempRange)
    },
    sortObject (obj) {
      let newkey = Object.keys(obj).sort()
      let newObj = {}
      for (let i = 0; i < newkey.length; i++) {
        newObj[newkey[i]] = obj[newkey[i]]
      }
      return newObj
    },
    initChart (size) {
      this.chart = echarts.init(this.$refs.logChart)
      let start = size > this.chartPer ? Math.ceil((1 - this.chartPer / size) * 100) : 0
      let option = {
        backgroundColor: '#fff',
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          formatter: function (params) {
            let str = ''
            for (let i = 0; i < params.length; i++) {
              if (i === 0) {
                str += params[i].axisValue + '<br>'
              }
              if (params[i].value) {
                str += '<span style="color: ' + params[i].color + ';">●</span>' + params[i].seriesName + params[i].value + '<br>'
              }
            }
            return str
          }
        },
        axisPointer: {
          link: { xAxisIndex: 'all' },
          label: {
            backgroundColor: '#777'
          }
        },
        grid: [
          {
            left: '70',
            right: '50',
            bottom: '69%'
          },
          {
            top: '36%',
            left: '70',
            right: '50',
            bottom: '41%'
          },
          {
            top: '64%',
            left: '70',
            right: '50',
            bottom: '80'
          }
        ],
        dataZoom: [
          {
            type: 'slider',
            show: true, // 是否显示缩放组件
            xAxisIndex: [0, 1, 2],
            start: start,
            end: 100,
            realtime: false // 拖拽结束时实时更新数据
          },
          {
            type: 'inside',
            xAxisIndex: [0, 1, 2],
            start: start,
            end: 100
          }
        ],
        legend: {
          type: 'scroll',
          data: []
        },
        xAxis: [
          {
            type: 'category',
            show: false,
            boundaryGap: false,
            gridIndex: 0,
            data: []
          },
          {
            type: 'category',
            show: false,
            boundaryGap: false,
            gridIndex: 1,
            data: []
          },
          {
            type: 'category',
            boundaryGap: false,
            gridIndex: 2,
            axisLabel: {
              show: true,
              formatter: function (value, index) {
                let date = new Date(value)
                return [(date.getMonth() + 1), date.getDate()].join('-') + ' ' + [date.getHours(), date.getMinutes(), date.getSeconds()].join(':')
              }
            },
            axisTick: {
              show: true
            },
            splitArea: {
              interval: 0
            },
            data: []
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '漏电流',
            gridIndex: 0,
            axisLabel: {
              formatter: '{value} mA'
            }
          },
          {
            type: 'value',
            name: '电流',
            gridIndex: 1,
            axisLabel: {
              formatter: '{value} A'
            }
          },
          {
            type: 'value',
            name: '温度',
            gridIndex: 2,
            axisLabel: {
              formatter: '{value} °C'
            }
          }
        ],
        series: []
      }
      this.chart.setOption(option)
      window.addEventListener('resize', this.resize)
    },
    drawChart (xAxis, series, legends, yAxis1, yAxis2, yAxis3) {
      let option = {
        color: this.colors,
        legend: {
          data: legends
        },
        xAxis: [
          {
            data: xAxis,
            name: xAxis[xAxis.length - 1]
          },
          {
            data: xAxis,
            name: xAxis[xAxis.length - 1]
          },
          {
            data: xAxis
          }
        ],
        yAxis: [
          {
            min: yAxis1[0],
            max: yAxis1[1]
          },
          {
            min: yAxis2[0],
            max: yAxis2[1]
          },
          {
            min: yAxis3[0],
            max: yAxis3[1]
          }
        ],
        series: series
      }
      if (this.chart !== null) {
        this.chart.setOption(option)
      }
    },
    resize () {
      this.chart.resize()
    },
    running () {
      let timer = this.timer = window.setInterval(() => {
        if (!this.noData) {
          this.getData(1)
        } else {
          window.clearInterval(timer)
        }
      }, 30000)
    }
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.resize)
    if (this.timer) {
      window.clearInterval(this.timer)
    }
    try {
      echarts.dispose(this.$refs.logChart)
    } catch (e) { }
  },
  beforeMount () {
    this.getData(12 * 60 * 2)
    this.running()
  }
}
</script>
