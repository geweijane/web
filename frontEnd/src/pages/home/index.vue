<template>
  <el-main class="content-box">
    <el-row>
      <el-col :span="12">
        <div class="map" ref="hunai"></div>
      </el-col>
      <el-col :span="12">
        <div class="map" id="map"></div>
      </el-col>
      <el-col :span="8">
        <el-card class="card" shadow="never">
          <div slot="header" class="clearfix">
            <span class="card-title">系统概况</span>
          </div>
          <el-row style="margin: 0 -10px;">
            <el-col :span="12" class="item-box">
              <router-link to="/project">
                <span>项目数</span>
                <b>{{systemData.project}}</b>
              </router-link>
            </el-col>
            <el-col :span="12" class="item-box">
              <router-link to="/project">
                <span>设备数量</span>
                <b>{{systemData.device}}</b>
              </router-link>
            </el-col>
            <el-col :span="12" class="item-box">
              <router-link to="/warning">
                <span>当前报警数</span>
                <b class="danger">{{systemData.warning}}</b>
              </router-link>
            </el-col>
            <el-col :span="12" class="item-box">
              <router-link to="/fixed">
                <span>维护次数</span>
                <b>{{systemData.fixed}}</b>
              </router-link>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="card" shadow="never">
          <div slot="header" class="clearfix">
            <span class="card-title">设备统计</span>
          </div>
          <simple-pie v-if="chartDevice.data.series !== null" :chartRef="chartDevice.ref" :textColor="chartDevice.textColor" :color="chartDevice.color" :data="chartDevice.data" style="height: 20rem"></simple-pie>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="card" shadow="never">
          <div slot="header" class="clearfix">
            <span class="card-title">报警统计</span>
          </div>
          <simple-pie v-if="chartWarn.data.series !== null" :chartRef="chartWarn.ref" :textColor="chartWarn.textColor" :color="chartWarn.color" :data="chartWarn.data" style="height: 20rem"></simple-pie>
        </el-card>
      </el-col>
    </el-row>
  </el-main>
</template>
<script>
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/map'
import 'echarts/map/js/province/hunan.js'
import SimplePie from 'components/chart/pie'
import cityMixin from '@/until/city.js'
import {getArea, analysisHome, getProject, catchError} from '@/api/api'
import mapStyle from 'vuex-store/modules/until/mapStyle'
export default {
  components: {SimplePie},
  name: 'home',
  mixins: [cityMixin],
  data () {
    return {
      citys: [],
      provice: '湖南',
      chartP: null,
      mapStyle: mapStyle,
      map: null,
      chartDevice: {
        ref: 'chartDevice',
        color: ['#3bab01', '#990100', '#666666'],
        textColor: '#fff',
        data: {
          title: '设备总数',
          legend: [],
          count: 0,
          series: null
        },
        option: {
          normal: '正常',
          error: '报警',
          offline: '离线'
        }
      },
      chartWarn: {
        ref: 'chartDevice',
        color: ['#990100', '#009899'],
        textColor: '#fff',
        data: {
          title: '报警总数',
          legend: [],
          count: 0,
          series: null
        },
        option: {
          temperature: '温度',
          leak: '漏电'
        }
      },
      systemData: {
        project: 0,
        device: 0,
        warning: 0,
        fixed: 0
      }
    }
  },
  methods: {
    getArea () {
      getArea({per_page: 999}).then(datas => {
        let {errno, msg, data} = datas
        if (errno === 0) {
          this.cityData = data
          this.cityFilter = {title: [this.provice], level: 2}
          this.cityFilter[0].children.forEach(n => {
            this.citys.push({
              name: n.title,
              data: n,
              selected: true,
              label: {
                normal: {
                  show: true
                },
                emphasis: {
                  show: true
                }
              }
            })
          })
          this.initMapProvice()
          this.initMap()
        } else {
          this.$message.error(msg)
        }
      }).catch(e => catchError(e, this))
    },
    initMapProvice () {
      let option = {
        backgroundColor: '#044598',
        geo: {
          show: true,
          map: this.provice,
          regions: this.citys,
          label: {
            normal: {
              color: '#F4E925',
              show: false
            },
            emphasis: {
              color: '#F4E925',
              show: true
            }
          },
          roam: true,
          itemStyle: {
            normal: {
              areaColor: 'transparent',
              borderColor: '#3fdaff',
              borderWidth: 1,
              shadowColor: 'rgba(63, 218, 255, 0.5)',
              shadowBlur: 30
            },
            emphasis: {
              borderWidth: 2,
              areaColor: '#2B91B7'
            }
          }
        },
        series: []
      }
      let chart = this.chartP = echarts.init(this.$refs.hunai)
      chart.setOption(option)
      chart.on('click', (params) => {
        if (params.region.selected) {
          this.moveMap(params)
        }
      })
    },
    resizeChart () {
      this.chartP && (this.chartP.resize())
    },
    initMap () {
      var map = this.map = new window.BMap.Map('map')
      map.setMapStyle({
        styleJson: this.mapStyle
      })
      map.enableScrollWheelZoom()
      map.enableContinuousZoom()
      this.moveMap(this.citys[0] ? this.citys[0] : this.provice)
    },
    moveMap (params) {
      if (this.map) {
        this.map.centerAndZoom(params.name)
        if (params.data) {
          getProject({area: params.data.id, per_page: 99}).then(datas => {
            let {errno, data, msg} = datas
            if (errno === 0) {
              let points = []
              data.forEach(n => {
                points.push(this.makeMarker(n))
              })
              this.map.setViewport(points)
            } else {
              this.$message.error(msg)
            }
          }).catch(e => catchError(e, this))
        }
      }
    },
    makeMarker (data) {
      let getUrl = (error, offline) => {
        let url = '/static/images/'
        let color = '#009900'
        if (error === 0 && offline === 0) {
          url = url + 'icon-dot3.png'
          color = '#009900'
        } else if (error > 0) {
          url = url + 'icon-dot4.png'
          color = '#990000'
        } else if (offline > 0) {
          url = url + 'icon-dot6.png'
          color = '#bfbfbf'
        } else {
          url = url + 'icon-dot3.png'
        }
        return {url, color}
      }
      let style = getUrl(data.error, data.offline)
      let icon = new window.BMap.Icon(style.url, new window.BMap.Size(24, 24))
      let point = new window.BMap.Point(data.lng, data.lat)
      let marker = new window.BMap.Marker(point, {icon: icon})
      var label = new window.BMap.Label(data.title, {offset: new window.BMap.Size(12, 0)})
      label.setStyle({background: style.color, border: 'none', color: '#fff', padding: '2px 5px 2px 15px', lineHeight: '20px', borderRadius: '5px', zIndex: '-1'})
      marker.setLabel(label)
      marker.addEventListener('click', () => {
        this.$router.push({path: '/project?filter=' + data.title})
      })
      label.addEventListener('click', () => {
        this.$router.push({path: '/project?filter=' + data.title})
      })
      this.map.addOverlay(marker)
      // 返回坐标点便于设置视图
      return point
    },
    mapResize () {
      window.addEventListener('resize', this.resizeChart)
    },
    getSystem () {
      analysisHome().then(datas => {
        let {errno, msg, data} = datas
        if (errno === 0) {
          this.systemData = data
          for (let i in this.systemData) {
            if (data[i]) {
              this.systemData[i] = data[i]
            }
          }
          this.chartDevice.data = this.getOption(this.chartDevice, data)
          this.chartWarn.data = this.getOption(this.chartWarn, data)
        } else {
          this.$message.errno(msg)
        }
      }).catch(e => catchError(e, this))
    },
    getOption (temp, data) {
      let series = []
      let values = []
      let count = 0
      for (let index in temp.option) {
        let name = temp.option[index]
        values.push(name)
        count += data[index]
        series.push({name: name, value: data[index]})
      }
      temp.legend = values
      temp.count = count
      temp.series = series
      return temp
    }
  },
  beforeMount () {
    this.$nextTick(function () {
      this.getSystem()
      if (typeof window.BMap !== 'undefined') {
        this.getArea()
      } else {
        this.$store.dispatch('loadMap').then(() => this.getArea())
      }
    })
  },
  mounted () {
    this.mapResize()
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.resizeChart)
  }
}
</script>
<style lang="less" scoped>
  @import url("../../less/_variables.less");
  @import url("../../less/_until.less");
  @border-color: #3fdaff;
  .el-main{
    background: #044599;
  }
  .el-card{
    border-width: 3px;
    border-color: @border-color;
    border-radius: 0;
    margin: .5rem;
    border-radius: .5rem;
    box-shadow: @border-color 0px 0px 10px;
  }
  .map{
    height: 46.5rem;
    border: 3px solid @border-color;
    margin: .5rem;
    border-radius: .5rem;
    box-shadow: @border-color 0px 0px 10px;
  }
  .card{
    height: 28rem;
    background: #044599;
    &>:first-child{
      .gradient(top, #05479d, #0c61fa);
      padding: .7rem 1rem;
      border-color: @border-color;
      /*border-width: 2px;*/
    }
    .card-title{
      font-size: 1.6rem;
      color: #fff;
    }
  }
  .item-box{
    padding: 1rem;
    display: block;
    a{
      padding: 1.5rem 1rem;
      background: #003466;
      color: #cefffc;
      display: block;
      span{
        color: #fffb42;
        font-size: 1.6rem;
      }
      span, b{
        display: block;
        line-height: 3rem;
      }
      b{
        font-size: 2.5rem;
        font-weight: bold;
      }
      b.danger{
        color: #ff0202;
      }
    }
  }
</style>
