<template>
  <el-main>
    <breadcrumb :data="breadcrumb"></breadcrumb>
    <div class="sub-nav">
      <router-link :to="'/project/' + id + '/modify'" v-if="role === 1">
        <el-button size="mini" plain round>修改项目</el-button></router-link>
      <router-link :to="'/project/' + id + '/outline'">
        <el-button size="mini" plain round>未上线设备</el-button></router-link>
      <router-link :to="'/user?project=' + id" v-if="role === 1">
        <el-button size="mini" plain round>用户管理</el-button></router-link>
    </div>
    <el-form class="query-form" :inline="true" :model="searchData" :rules="rules" ref="searchForm" @submit.native.prevent="searchList('searchForm')">
      <el-form-item label="设备" prop="filter">
        <el-input v-model.trim="searchData.filter" size="small" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="search-btn" type="primary" size="small" native-type="submit">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="device-con">
      <template v-if="deviceData === null">
        <el-alert title="暂无绑定任何设备，请先绑定设备" type="warning" showIcon :closable="false"></el-alert>
      </template>
      <template v-else>
        <a v-for="item in deviceData" :key="item.id" @click="addSession(item, '/project/' + id + '/device/' + item.deviceName)">
          <el-card>
            <ul>
              <li class="title">{{item.title ? item.title : item.imei}} <span class="pull-right success" :class="{'danger': item.status != '正常'}">状态: {{item.status}}</span></li>
              <li>
                <span class=""><i class="pcon pcon-dian"></i> A相电流</span>
                <span class="pull-right success">{{item.electricity0}}A | 正常</span>
              </li>
              <li>
                <span class=""><i class="pcon pcon-dian"></i> B相电流</span>
                <span class="pull-right success">{{item.electricity1}}A | 正常</span>
              </li>
              <li>
                <span class=""><i class="pcon pcon-dian"></i> C相电流</span>
                <span class="pull-right success">{{item.electricity2}}A | 正常</span>
              </li>
              <li>
                <span class=""><i class="pcon pcon-water"></i> 温度1</span>
                <span :class="'pull-right ' + item.temperature0Class">{{item.temperature0}}℃ | {{item.temperature0Text}}</span>
              </li>
              <li>
                <span class=""><i class="pcon pcon-water"></i> 温度2</span>
                <span :class="'pull-right ' + item.temperature1Class">{{item.temperature1}}℃ | {{item.temperature0Text}}</span>
              </li>
              <li>
                <span class=""><i class="pcon pcon-water"></i> 温度3</span>
                <span :class="'pull-right ' + item.temperature2Class">{{item.temperature2}}℃ | {{item.temperature2Text}}</span>
              </li>
              <li>
                <span class=""><i class="pcon pcon-water"></i> 漏电流</span>
                <span :class="'pull-right ' + item.leakClass">{{item.leak}}mA | {{item.leakText}}</span>
              </li>
            </ul>
          </el-card>
        </a>
      </template>
    </div>
    <el-pagination v-if="total > pageSize" :total="total" :currentPage="page" :pageSize="pageSize" @current-change="pageChange" background layout="prev, pager, next"></el-pagination>
  </el-main>
</template>
<script>
import Breadcrumb from 'components/until/breadcrumb'
import searchMixin from '@/until/search'
import sessionMixin from '@/until/session'
import {getDevices, catchError} from '@/api/api'
export default {
  components: {
    Breadcrumb
  },
  mixins: [searchMixin, sessionMixin],
  name: 'deviceList',
  data () {
    return {
      searchData: {
        filter: ''
      },
      id: this.$route.params.id,
      deviceData: [],
      pageSize: 6
    }
  },
  computed: {
    breadcrumb () {
      let temp = [
        {iconClass: 'pcon pcon-home', title: '当前位置: 首页', to: '/home'},
        {title: '智能监控', to: '/project'}
      ]
      let session = this.session
      if (session) {
        for (let i = 0; i < session.length; i++) {
          if (session[i].area) {
            temp.push({title: session[i].title, to: '/project/' + session[i].id + '/device'})
          } else {
            temp.push({title: session[i].title, to: '/project/' + session[i].id})
          }
        }
      }
      return temp
    },
    routeId () {
      return this.$route.params.id
    }
  },
  watch: {
    routeId (val) {
      this.changeSession(-1)
      this.id = val
      this.firstPage()
    }
  },
  methods: {
    getList () {
      this.setPath()
      this.getDevices()
    },
    getDevices () {
      getDevices({...this.filter, project: this.id, per_page: this.pageSize}).then(datas => {
        let {errno, data, page, msg} = datas
        if (errno === 0) {
          if (data.length === 0) {
            this.deviceData = null
          } else {
            for (let i = 0; i < data.length; i++) {
              this.stateText(data[i])
            }
            this.deviceData = data
          }
          this.total = page.total
        } else {
          this.$message.error(msg)
        }
      }).catch(e => catchError(e, this))
    },
    stateText (item) {
      let tempDiff = 10
      let leakDiff = 100
      for (let i = 0; i < 3; i++) {
        let temp = parseFloat(item['temperature' + i])
        let maxTemp = parseFloat(item.maxTemp)
        if (maxTemp < 0) {
          maxTemp = Math.abs(maxTemp) < 2 ? 80 : Math.abs(maxTemp)
        }
        if (temp > maxTemp) {
          item['temperature' + i + 'Class'] = 'danger'
          item['temperature' + i + 'Text'] = '报警'
        } else if (temp <= maxTemp && maxTemp - tempDiff <= 0) {
          if (temp > maxTemp / 2) {
            item['temperature' + i + 'Class'] = 'text-warning'
            item['temperature' + i + 'Text'] = '预警'
          } else {
            item['temperature' + i + 'Class'] = 'success'
            item['temperature' + i + 'Text'] = '正常'
          }
        } else if (temp <= maxTemp && temp > maxTemp - tempDiff) {
          item['temperature' + i + 'Class'] = 'warning'
          item['temperature' + i + 'Text'] = '预警'
        } else {
          item['temperature' + i + 'Class'] = 'success'
          item['temperature' + i + 'Text'] = '正常'
        }
      }
      let leak = parseFloat(item.leak)
      let maxLeak = parseFloat(item.maxLeak)
      if (maxLeak < 0) {
        maxLeak = Math.abs(maxLeak) < 2 ? 80 : Math.abs(maxLeak)
      }
      if (leak > maxLeak) {
        item.leakClass = 'danger'
        item.leakText = '报警'
      } else if (leak <= maxLeak && maxLeak - leakDiff <= 0) {
        // 最大值减去差值小于0，则判断为最大值的一般
        if (leak > maxLeak / 2) {
          item.leakClass = 'text-warning'
          item.leakText = '预警'
        } else {
          item.leakClass = 'success'
          item.leakText = '正常'
        }
      } else if (leak <= item.maxLeak && leak > item.maxLeak - leakDiff) {
        item.leakClass = 'warning'
        item.leakText = '预警'
      } else {
        item.leakClass = 'success'
        item.leakText = '正常'
      }
      return item
    }
  },
  beforeMount () {
    this.changeSession(this.id)
    this.initFilter()
    this.getList()
  }
}
</script>
<style lang="less" scoped>
.device-con{
  display: flex;
  flex-wrap: wrap;
  margin-right: -1rem;
  a {
    width: 33.33%;
    min-width: 25rem;
    padding: 0 1rem 1rem 0;
    box-sizing: border-box;
  }
  .el-card{
    background: #f8fff7;
    border-top: 4px solid #003f96;
    box-shadow: none;
    &>:last-child{
      padding: 0;
    }
    ul{
      list-style: none;
      margin: 0;
      padding: 0;
      line-height: 2.7rem;
      font-size: 1.4rem;
      li{
        border-bottom: 1px solid #ebf0e9;
        padding: 0 1rem;
        &:last-child{
          border-bottom: none;
        }
        &.title{
          font-size: 1.6rem;
        }
        .pcon{
          color: #ff9500;
        }
        .success{
          color: #00862b;
        }
        .danger{
          color: #f60100;
        }
        .warning{
          color: #976408;
        }
      }
    }
  }
}
</style>
