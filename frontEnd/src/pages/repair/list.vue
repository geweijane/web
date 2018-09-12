<template>
  <el-main>
    <breadcrumb :data="breadcrumb"></breadcrumb>
    <el-form class="query-form" :inline="true" :model="searchData" :rules="rules" ref="searchForm" @submit.native.prevent="searchList('searchForm')">
      <el-form-item label="设备" prop="filter">
        <el-input v-model.trim="searchData.filter" size="small" clearable></el-input>
      </el-form-item>
      <el-form-item label="处理时间">
        <el-date-picker v-model="searchData.date" :editable="false" value-format="yyyy-MM-dd HH:mm:ss" type="datetimerange" size="small" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" :default-time="['00:00:00', '23:59:59']">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="search-btn" size="small" native-type="submit">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" border>
      <el-table-column label="设备" prop="deviceTitle"></el-table-column>
      <el-table-column label="项目名" prop="projectTitle"></el-table-column>
      <el-table-column label="故障类型" prop="type"></el-table-column>
      <el-table-column label="处理时间" width="160" :formatter="diffTime">
      </el-table-column>
      <el-table-column label="状态" :formatter="parseStatus"></el-table-column>
      <el-table-column label="维护人" prop="userName"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="props">
          <router-link :to="'/fixed/' + props.row.id" class="text-primary">查看</router-link>
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
import {mapState} from 'vuex'
import moment from 'moment'
import {pickerOptions1} from 'vuex-store/modules/until/datePick'
import {catchError, getFixeds} from '@/api/api'

export default {
  components: {Breadcrumb},
  name: 'repairList',
  data () {
    return {
      searchData: {
        filter: '',
        date: [],
        area: '',
        project: ''
      },
      tableData: [],
      pageSize: 10,
      pickerOptions: pickerOptions1
    }
  },
  mixins: [searchMixin, sessionMixin],
  computed: {
    ...mapState({
      stateData: state => state.until.dataBase.fixedStatus
    }),
    breadcrumb () {
      let temp = [
        {iconClass: 'pcon pcon-home', title: '当前位置: 首页', to: '/home'}
      ]
      let session = this.session
      if (session) {
        for (let i = 0; i < session.length; i++) {
          if (session[i].area) {
            temp.push({title: session[i].title, to: '/fixed?project=' + session[i].id})
          } else {
            temp.push({title: session[i].title, to: '/fixed?area=' + session[i].id})
          }
        }
      }
      temp.push({title: '故障解除记录'})
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
    parseStatus (row) {
      return this.stateData[row.status]
    },
    diffTime (row) {
      return moment(row.updateTime).isAfter(moment(row.createTime)) ? row.updateTime : row.createTime
    },
    changeFormData (query) {
      let action = (val) => {
        this.searchData.deviceName = ''
        this.searchData.state = null
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
      getFixeds(this.ajaxData).then(datas => {
        let {errno, msg, data, page} = datas
        if (errno === 0) {
          this.tableData = data
          this.total = page.total
        } else {
          this.$message.error(msg)
        }
      }).catch(e => catchError(e, this))
    }
  },
  mounted () {
    this.changeFormData(this.query, {})
    this.firstPage()
  }
}
</script>
