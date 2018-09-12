<template>
  <el-main>
    <breadcrumb :data="breadcrumb"></breadcrumb>
    <div class="sub-nav">
      <router-link :to="'/project/' + id + '/add'" v-if="!showArea && role === 1">
        <el-button size="mini" plain round>添加项目</el-button>
      </router-link>
      <router-link :to="'/user?area=' + (id ? id : '')" v-if="role === 1">
        <el-button size="mini" plain round>用户管理</el-button>
      </router-link>
    </div>
    <el-form class="query-form" :inline="true" :model="searchData" :rules="rules" ref="searchForm" @submit.native.prevent="searchForm">
      <el-form-item label="项目" prop="filter">
        <el-input v-model.trim="searchData.filter" size="small" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="search-btn" type="primary" size="small" native-type="submit">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="product-con" v-if="showArea">
      <a v-for="item in areaData" :key="item.id" @click="goLink(item,'/project/'+ item.id )">
        <el-card shadow="never" :title="item.title">
          <div class="p-item">
            <i class="pcon pcon-mapsigns"></i>
            <b>{{item.title}}</b>
          </div>
        </el-card>
      </a>
    </div>
    <div class="product-charts" v-else>
      <template v-if="projectData === null">
        <el-alert title="暂无添加任何项目，请前往其他项目查看" showIcon :closable="false" type="warning"></el-alert>
      </template>
      <template v-else>
        <a v-for="item in projectData" :key="item.id" @click="goLink(item, '/project/'+ item.id + '/device')">
          <el-card shadow="never">
            <div slot="header">
              {{item.title}}
            </div>
            <simple-pie style="height: 20rem;" chartRef="chart_1" :data="{title: '设备总数', count: (item.error + item.normal + item.offline), series: [{name: '正常', value: item.normal},{name: '报警', value: item.error},{name: '离线', value: item.offline}], legend: ['正常','报警', '离线']}"></simple-pie>
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
import SimplePie from 'components/chart/pie'
import {catchError, getArea, getProject} from '@/api/api'
import {mapGetters} from 'vuex'
export default {
  components: {
    SimplePie,
    Breadcrumb
  },
  mixins: [searchMixin, sessionMixin],
  name: 'projectList',
  data () {
    return {
      searchData: {
        filter: ''
      },
      areaData: [],
      projectData: null,
      showArea: true,
      id: this.$route.params.id
    }
  },
  computed: {
    ...mapGetters(['rootParentId']),
    breadcrumb () {
      let temp = [
        {iconClass: 'pcon pcon-home', title: '当前位置: 首页', to: '/home'},
        {title: '智能监控', to: '/project'}
      ]
      let session = this.session
      if (session) {
        for (let i = 0; i < session.length; i++) {
          temp.push({title: session[i].title, to: '/project/' + session[i].id})
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
      if (this.searchData.filter) {
        this.searchData.filter = ''
      }
      this.removeFilter()
      this.changeSession(val)
      this.id = val
      this.showArea = true
      this.firstPage()
    }
  },
  methods: {
    goLink (temp, path) {
      if (this.searchData.filter) {
        this.searchData.filter = ''
      }
      this.removeFilter()
      this.addSession(temp, path)
    },
    searchForm () {
      this.showArea = true
      this.searchList('searchForm')
    },
    getList () {
      this.setPath()
      if (this.showArea) {
        this.getArea()
      } else {
        this.getProject()
      }
    },
    getArea () {
      this.pageSize = 16
      let ajaxData = {...this.filter, parentId: this.id ? this.id : this.rootParentId, per_page: this.pageSize}
      if (ajaxData.filter && ajaxData.parentId === this.rootParentId) {
        delete ajaxData.parentId
      }
      getArea(ajaxData).then(datas => {
        let {errno, msg, page, data} = datas
        if (errno === 0) {
          this.areaData = data
          this.total = page.total
          if (data.length === 0) {
            this.showArea = false
            this.firstPage()
          } else {
            this.projectData = []
          }
        } else {
          this.$message.error(msg)
        }
      }).catch(e => catchError(e, this))
    },
    getProject () {
      this.pageSize = 6
      getProject({...this.filter, per_page: this.pageSize, area: this.id}).then(datas => {
        let {errno, msg, page, data} = datas
        if (errno === 0) {
          if (data.length === 0) {
            this.projectData = null
          } else {
            this.projectData = data
          }
          this.total = page.total
        } else {
          this.$message.error(msg)
        }
      }).catch(e => catchError(e, this))
    }
  },
  beforeMount () {
    this.changeSession(this.id)
    this.initFilter()
    this.firstPage()
  }
}
</script>
<style lang="less" scoped>
  .product-con{
    display: flex;
    flex-wrap: wrap;
    color: #333;
    margin-right: -1rem;
    a{
      padding: 0 1rem 1rem 0;
      min-width: 20rem;
      width: 25%;
      box-sizing: border-box;
      .el-card{
        background: #f8fff7;
        .p-item{
          display: flex;
          line-height: 4rem;
          padding: 1rem 0;
          i{
            font-size: 5rem;
            padding-left: 1rem;
          }
          b{
            font-size: 1.6rem;
            padding-left: 2rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
    }
  }
  .product-charts{
    display: flex;
    flex-wrap: wrap;
    margin-right: -1rem;
    a {
      padding: 0 1rem 1rem 0;
      min-width: 29rem;
      width: 33.33%;
      box-sizing: border-box;
      .el-card{
        background: #f8fff7;
        &>:first-child{
          padding: .5rem 2rem;
          background: #024093;
          font-size: 1.4rem;
          color: #fff;
        }
        &>:nth-child(2){
          padding: 1rem 0;
        }
      }
    }
  }
</style>
