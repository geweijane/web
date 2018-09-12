<template>
  <div class="chart" ref="drinksChart"></div>
</template>
<script>
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/grid'
import 'echarts/lib/component/title'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/toolbox'
import 'echarts/lib/component/timeline'

import moment from 'moment'
import Mock from 'mockjs'
export default {
  name: 'chart-type1',
  data () {
    return {
      chart: null,
      xAxis: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'],
      series: [],
      seriesOption: [],
      legend: [],
      timeLine: [],
      barType: {'barMaxWidth': 35, itemStyle: {normal: {label: {show: true, position: 'top'}}}},
      lineType: {symbolSize: 10, symbol: 'circle', smooth: true, itemStyle: {normal: {color: '#0ff', label: {show: true, position: 'top'}}}}
    }
  },
  props: {
    title: {
      type: String,
      default () {
        return '统计图表'
      }
    },
    filter: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  methods: {
    refresh () {

    },
    initChart () {
      this.chart = echarts.init(this.$refs.drinksChart)
      this.chart.setOption({
        baseOption: {
          timeline: {
            axisType: 'category',
            autoPlay: true,
            playInterval: 3000,
            data: this.timeLine
          },
          title: {
            text: this.title,
            x: 'center'
          },
          grid: {
            left: '5%',
            right: '5%',
            top: 50,
            bottom: 85
          },
          tooltip: {
            trigger: 'item',
            axisPointer: {
              type: 'shadow',
              textStyle: {
                color: '#fff'
              }
            }
          },
          legend: {
            data: this.legend,
            align: 'left',
            left: 0
          },
          toolbox: {
            show: false,
            feature: {
              mark: {show: true},
              dataView: {show: true, readOnly: false},
              magicType: {show: true, type: ['line', 'bar']},
              restore: {show: true},
              saveAsImage: {show: true}
            }
          },
          xAxis: [
            {
              type: 'category',
              data: this.xAxis
            }
          ],
          yAxis: [
            {
              type: 'value',
              min: 0
            }
          ],
          series: this.series
        },
        options: this.seriesOption
      })
      window.removeEventListener('resize', this.resize)
      window.addEventListener('resize', this.resize)
    },
    resize () {
      this.chart.resize()
    },
    parseChart (data) {
      data = this.mockData()
      let legend = []
      let series = []
      let seriesOption = []

      let sumYear = {}
      let sumMonth = {}
      let sumDay = {}
      let typeMonth = {}
      let sumtype = {}
      let time = []
      // 整理总数，用于饼图， 将数据按类型区分
      for (let i in data) {
        let item = data[i]
        for (let n = 0; n < item.length; n++) {
          let name = item[n].name
          // 一年饮品使用次数，按种类区分
          !sumYear[name] && (sumYear[name] = {name: name, value: 0})
          sumYear[name].value += item[n].value

          // 截取时间的年月
          let _m = i.slice(0, i.lastIndexOf('-'))
          var index = parseInt(i.slice(i.lastIndexOf('-') + 1)) - 1
          // 获取时间轴类型，按年月标准
          !time.includes(_m) && (time.push(_m))
          // 每月饮品使用次数，按种类区分
          !typeMonth[_m] && (typeMonth[_m] = {})
          !typeMonth[_m][name] && (typeMonth[_m][name] = new Array(31))
          typeMonth[_m][name][index] = item[n].value
          // 每月每种类使用总数
          !sumtype[_m] && (sumtype[_m] = {})
          !sumtype[_m][name] && (sumtype[_m][name] = {name: name, value: 0})
          sumtype[_m][name].value += item[n].value
          // 每月酿造总次数
          !sumMonth[_m] && (sumMonth[_m] = {name: _m, value: 0})
          sumMonth[_m].value += item[n].value
          // 每天酿造总次数
          !sumDay[_m] && (sumDay[_m] = new Array(31))
          sumDay[_m][index] === undefined && (sumDay[_m][index] = 0)
          sumDay[_m][index] += item[n].value
        }
      }
      time = time.sort()
      legend = Object.keys(sumYear)
      // 基本图例
      legend.forEach(i => {
        series.push({name: i, type: 'bar', ...this.barType})
      })
      series.push({name: '每日总数', type: 'line', ...this.lineType})
      series.push({name: '月统计', type: 'pie', radius: ['20%', '30%'], center: ['80%', '30%'], label: {normal: {show: true, position: 'inside'}}, labelLine: {normal: {show: false}}})
      series.push({name: '月总数', type: 'pie', radius: ['35%', '45%'], selectedMode: 'single', center: ['80%', '30%']})
      series.push({name: '近一年饮品使用统计', type: 'pie', radius: [0, '15%'], center: ['80%', '30%'], label: {normal: {show: true, position: 'inside'}}, labelLine: {normal: {show: false}}, data: Object.values(sumYear)})
      for (let i = 0; i < time.length; i++) {
        let _t = time[i]
        let item = {title: {subtext: _t + '饮品-酿造次数统计'}, series: []}
        let temp = typeMonth[_t]
        for (let n in temp) {
          item.series.push({name: n, data: temp[n]})
        }
        let _s = {}
        _s[_t] = {selected: true, ...sumMonth[_t]}
        item.series.push({name: '月总数', data: Object.values({...sumMonth, ..._s})})
        item.series.push({name: '每日总数', data: sumDay[_t], tooltip: {formatter: _t + '-{b}<br />{a}{c}'}})
        item.series.push({name: '月统计', tooltip: {formatter: _t + '{a}<br />{b}: {c} ({d}%)'}, data: Object.values(sumtype[_t])})
        seriesOption.push(item)
      }
      this.series = series
      this.seriesOption = seriesOption
      this.legend = legend
      this.timeLine = time
      this.initChart()
    },
    mockData () {
      // 制造假数据
      let type = ['茶包', '咖啡', '牛奶', '果汁']
      let temp = {}
      let d = moment()
      for (let n = 365; n > 0; n--) {
        let item = []
        for (let i = 0; i < type.length; i++) {
          item.push({name: type[i], value: Mock.Random.integer(0, 20)})
        }
        temp[d.format('YYYY-MM-DD')] = item
        d = d.subtract(1, 'days')
      }
      return temp
    }
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.resize)
  },
  mounted () {
    this.parseChart({})
  }
}
</script>
<style lang="less" scoped>
  .chart{
    width: 100%;
    height: 50rem;
  }
</style>
