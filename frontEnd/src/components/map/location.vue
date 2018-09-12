<template>
  <el-card :body-style="{ padding: '0px', position: 'relative'}" shadow="never">
    <div slot="header" class="title">
      位置管理
      <span class="pull-right">
        <el-button type="text" @click="startDraw">选取位置</el-button>
        <el-button type="text" @click="clearAll">清除位置</el-button>
      </span>
    </div>
    <el-input placeholder="请输入要查询的地点" id="mapSearch" @keyup.13="searchMap" class="map-search">
      <el-button slot="append" icon="el-icon-search" @click="searchMap"></el-button>
    </el-input>
    <div class="map" id="map"></div>
  </el-card>
</template>
<script>
export default {
  name: 'mapLocation',
  data () {
    return {
      map: null,
      search: '',
      overlay: null,
      LocalSearch: null,
      drawingManager: null
    }
  },
  props: {
    address: {
      type: String,
      default () {
        return '永州市'
      }
    },
    point: {
      type: Object,
      default () {
        return {
          lng: null,
          lat: null
        }
      }
    }
  },
  watch: {
    address (val) {
      this.map.centerAndZoom(val, 18)
    }
  },
  methods: {
    initMap () {
      var map = this.map = new window.BMap.Map('map', {enableMapClick: false, mapType: window.BMAP_HYBRID_MAP})
      map.enableScrollWheelZoom()
      map.enableContinuousZoom()
      map.centerAndZoom(this.address, 15)
      let overlaycomplete = function (e) {
        this.clearAll()
        this.overlay = e.overlay
        let marker = e.overlay.getPosition()
        this.updatePoint({lng: marker.lng, lat: marker.lat})
      }
      // 实例化鼠标绘制工具
      this.drawingManager = new window.BMapLib.DrawingManager(this.map, {
        isOpen: true, // 是否开启绘制模式
        enableDrawingTool: false // 是否显示工具栏
      })
      // 添加鼠标绘制工具监听事件，用于获取绘制结果
      this.drawingManager.addEventListener('overlaycomplete', overlaycomplete.bind(this), false)
      this.map.addEventListener('touchstart', (e) => {
        this.clearAll()
        let marker = new window.BMap.Marker(new window.BMap.Point(e.point.lng, e.point.lat))
        this.map.addOverlay(marker)
        this.overlay = marker
        this.updatePoint({lng: e.point.lng, lat: e.point.lat})
      })
      this.setMarker(this.point)
    },
    setMarker (point) {
      if (point.lng && this.map) {
        if (this.overlay) {
          this.map.removeOverlay(this.overlay)
          this.overlay = null
        }
        let p = new window.BMap.Point(point.lng, point.lat)
        let marker = new window.BMap.Marker(p)
        this.overlay = marker
        this.map.addOverlay(marker)
        this.map.panTo(p)
      }
    },
    initSearch () {
      if (!document.getElementById('mapSearch')) {
        return
      }
      // 建立一个自动完成的对象
      let ac = new window.BMap.Autocomplete({
        'input': 'mapSearch',
        'location': this.map
      })
      // 鼠标点击下拉框事件
      ac.addEventListener('onconfirm', this.searchMap.bind(this), false)
      let searchFun = () => {
        var pp = this.LocalSearch.getResults().getPoi(0).point // 获取第一个智能搜索的结果
        this.overlay = new window.BMap.Marker(pp)
        this.map.addOverlay(this.overlay)
        this.map.panTo(pp, 13)
        this.updatePoint({lng: this.overlay.lng, lat: this.overlay.lat})
      }
      this.LocalSearch = new window.BMap.LocalSearch(this.map, { // 智能搜索
        onSearchComplete: searchFun
      })
    },
    searchMap () {
      let key = document.getElementById('mapSearch').value.trim()
      if (key !== '') {
        this.clearAll()
        this.LocalSearch.search(key)
      }
    },
    updatePoint (point) {
      this.$emit('updatePoint', point)
    },
    startDraw () {
      this.drawingManager && this.drawingManager.open()
    },
    clearAll () {
      this.map.removeOverlay(this.overlay)
      this.overlay = null
      this.updatePoint({lat: null, lng: null})
    }
  },
  mounted () {
  },
  beforeMount () {
    this.$nextTick(function () {
      if (typeof window.BMap !== 'undefined') {
        if (typeof window.BMapLib !== 'undefined') {
          this.initMap()
          this.initSearch()
        } else {
          this.$store.dispatch('loadUtils').then(() => {
            this.initMap()
            this.initSearch()
          })
        }
      } else {
        this.$store.dispatch('loadMap').then(() => {
          this.$store.dispatch('loadUtils').then(() => {
            this.initMap()
            this.initSearch()
          })
        })
      }
    })
  },
  beforeDestroy () {

  }
}
</script>
<style lang="less" scoped>
  @import url("http://api.map.baidu.com/library/DrawingManager/1.4/src/DrawingManager_min.css");

 .el-card{
    &>:first-child{
      padding: .8rem 2rem;
      background: #f8fff7;
    }
    .title{
      font-size: 1.6rem;
      .el-button{
        padding: 0;
      }
    }
    .map-search{
      width: 30rem;
      position: absolute;
      margin: 1rem 2rem;
      z-index: 10;
    }
    .map{
      height: 32rem;
    }
  }
</style>
