<template>
  <el-main>
    <breadcrumb :data="breadcrumb"></breadcrumb>
    <div class="sub-nav">
      <router-link :to="'/project/' + id + '/modify'" v-if="role === 1">
        <el-button size="mini" plain round>修改项目</el-button></router-link>
      <router-link :to="'/project/' + id + '/device'">
        <el-button size="mini" plain round>已上线设备</el-button></router-link>
      <router-link :to="'/user?project=' + id" v-if="role === 1">
        <el-button size="mini" plain round>用户管理</el-button></router-link>
    </div>
    <el-form class="query-form" :inline="true" :model="searchData" :rules="rules" ref="searchForm"  @submit.native.prevent="searchList('searchForm')">
      <el-form-item label="设备" prop="filter">
        <el-input v-model.trim="searchData.filter" size="small" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="search-btn" type="primary" size="small" native-type="submit">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="outline-con">
      <template v-if="deviceData === null">
        <el-alert title="暂无任何设备未上线设备" type="warning" showIcon :closable="false"></el-alert>
      </template>
      <template v-else>
        <a href="javascript:void (0)" v-for="item in deviceData" :key="item.deviceName">
          <el-card>
            <el-row slot="header" class="title">
              <el-col :span="16">{{item.title ? item.title : item.imei}}</el-col>
              <el-col :span="8" class="state text-right">状态: {{item.debugText}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <router-link :to="'/project/' + id +'/device/' + item.deviceName + '/modify'">
                  <i class="pcon pcon-pencil"></i>
                  <span>修改设备</span>
                </router-link>
              </el-col>
              <el-col :span="12">
                <a href="javascript: void(0);" @click="online(item)">
                  <i class="pcon pcon-upload"></i>
                  <span>上线设备</span>
                </a>
              </el-col>
            </el-row>
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
import {getDevices, putDevice, catchError} from '@/api/api'

export default {
  components: {
    Breadcrumb
  },
  mixins: [searchMixin, sessionMixin],
  name: 'outlineList',
  data () {
    return {
      searchData: {
        filter: ''
      },
      debug: '-1,1',
      deviceData: [],
      id: this.$route.params.id
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
            temp.push({title: session[i].title, to: '/project/' + session[i].id + '/outline'})
          } else {
            temp.push({title: session[i].title, to: '/project/' + session[i].id})
          }
        }
      }
      return temp
    }
  },
  methods: {
    getList () {
      this.setPath()
      this.getDevices()
    },
    getDevices () {
      getDevices({...this.filter, debug: this.debug, project: this.id, per_page: this.pageSize}).then(datas => {
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
      if (item.debug === -1) {
        item.debugText = '已删除'
      } else if (item.debug === 1) {
        item.debugText = '未上线'
      }
    },
    online (item) {
      this.$confirm('您确定要上线设备?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        putDevice({debug: 0, deviceName: item.deviceName}).then(datas => {
          let {errno, msg} = datas
          if (errno === 0) {
            this.$message.success(msg)
            let index = this.deviceData.findIndex(n => n.deviceName === item.deviceName)
            if (index !== -1) {
              this.deviceData.splice(index, 1)
            }
          } else {
            this.$message.error(msg)
          }
        }).catch(e => catchError(e, this))
      }).catch(() => { })
    }
  },
  beforeMount () {
    this.getList()
  }
}
</script>
<style lang="less" scoped>
  .outline-con{
    display: flex;
    flex-wrap: wrap;
    a{
      width: 33.33%;
      min-width: 25rem;
      .el-card{
        background: #f8fff7;
        border-top: 4px solid #999999;
        margin: 0 1rem 1rem 0;
        box-shadow: none;
        font-size: 1.4rem;
        color: #999999;
        &>:first-child{
          background: #f8fff7;
          padding: .5rem 1rem;

        }
        .title{
          font-size: 1.6rem;
          color: #666;
          .state{
            font-size: 1.4rem;
          }
        }
        a{
          color: #999;
          .pcon{
            margin-right: 1rem;
            background: #999;
            font-size: 2rem;
            padding: 1rem;
            border-radius: 50%;
            color: #fff;
            text-align: center;
          }
        }
      }
    }
  }
</style>
