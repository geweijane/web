<template>
  <el-main>
    <breadcrumb :data="breadcrumb"></breadcrumb>
    <el-form class="query-form" :inline="true" :model="searchData" :rules="rules" ref="searchForm" @submit.native.prevent="searchList('searchForm')">
      <el-form-item label="设备" prop="filter">
        <el-input v-model.trim="searchData.filter" size="small" clearable></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model.trim="searchData.status" size="small" clearable>
          <el-option v-for="item in stateData" :key="item.label" :label="item.label" :value="item.value.toString()"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="报警时间">
        <el-date-picker v-model="searchData.date" :editable="false" value-format="yyyy-MM-dd HH:mm:ss" type="datetimerange" size="small" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" :default-time="['00:00:00', '23:59:59']">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="search-btn" size="small" native-type="submit">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" border>
      <el-table-column label="设备" prop="deviceTitle"></el-table-column>
      <el-table-column label="项目名" prop="project" width="200"></el-table-column>
      <el-table-column label="报警类型" prop="type" width="100"></el-table-column>
      <el-table-column label="报警数据" prop="data"></el-table-column>
      <el-table-column label="报警时间" prop="createTime" width="160"></el-table-column>
      <el-table-column label="责任人" prop="userName" width="80"></el-table-column>
      <el-table-column label="是否延期" prop="delay" width="80"></el-table-column>
      <el-table-column label="操作" width="120">
        <template slot-scope="props">
          <span v-if="props.row.status.indexOf('未') > -1">
            <router-link :to="'/fixed/' + props.row.id + '/update'" class="text-primary" v-if="role === 3">添加维护记录</router-link>
            <span v-else>{{props.row.status}}</span>
          </span>
          <span class="text-success" v-else>{{props.row.status}}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-if="total > pageSize" :total="total" :currentPage="page" :pageSize="pageSize" @current-change="pageChange" background layout="prev, pager, next"></el-pagination>
  </el-main>
</template>
<script>
import Breadcrumb from 'components/until/breadcrumb'
import searchMixin from '@/until/search'
import sessionMixin from '@/until/session'
import {pickerOptions1} from 'vuex-store/modules/until/datePick'
import {catchError, getWarnings} from '@/api/api'
export default {
  components: {Breadcrumb},
  name: 'warningList',
  data () {
    return {
      searchData: {
        deviceName: '',
        status: null,
        date: [],
        area: '',
        project: ''
      },
      stateData: [
        {label: '未处理', value: 0},
        {label: '已处理', value: 1}
      ],
      tableData: [],
      pageSize: 10,
      pickerOptions: pickerOptions1
    }
  },
  mixins: [searchMixin, sessionMixin],
  computed: {
    breadcrumb () {
      let temp = [
        {iconClass: 'pcon pcon-home', title: '当前位置: 首页', to: '/home'}
      ]
      let session = this.session
      if (session) {
        for (let i = 0; i < session.length; i++) {
          if (session[i].area) {
            temp.push({title: session[i].title, to: '/warning?project=' + session[i].id})
          } else {
            temp.push({title: session[i].title, to: '/warning?area=' + session[i].id})
          }
        }
      }
      temp.push({title: '消息报警'})
      return temp
    },
    query () {
      return this.$route.query
    },
    ajaxData () {
      let temp = {...this.filter, per_page: this.pageSize}
      if (temp.date && temp.date.length !== 0) {
        temp.date1 = temp.date[0]
        temp.date2 = temp.date[1]
        delete temp.date
      }
      return temp
    }
  },
  watch: {
    query: {
      deep: true,
      handler (query) {
        this.changeFormData(query)
      }
    }
  },
  methods: {
    changeFormData (query) {
      let action = (val) => {
        this.searchData.deviceName = ''
        this.searchData.status = null
        this.searchData.date = []
        this.changeSession(val)
        this.initFilter()
        this.firstPage()
      }
      if (!query.area && !query.project) {
        this.searchData.area = ''
        this.searchData.project = ''
        action(null)
      } else if (query.area) {
        this.searchData.project = ''
        action(query.area)
      } else if (query.project) {
        this.searchData.area = ''
        action(-1)
      }
    },
    getList () {
      this.setPath()
      getWarnings(this.ajaxData).then(datas => {
        let {errno, msg, data, page} = datas
        if (errno === 0) {
          this.total = page.total
          this.tableData = data
          console.log(this.page)
        } else {
          this.$message.error(msg)
        }
      }).catch(e => catchError(e, this))
    }
  },
  beforeMount () {
    this.changeFormData(this.query)
    this.initFilter()
    this.firstPage()
  }
}
</script>
