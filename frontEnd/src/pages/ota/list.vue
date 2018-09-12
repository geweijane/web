<template>
  <el-main>
    <breadcrumb :data="breadcrumb"></breadcrumb>
    <div class="sub-nav">
      <router-link to="/ota/add">
        <el-button size="mini" plain round>增加固件</el-button>
      </router-link>
    </div>
    <el-table :data="tableData" border>
      <el-table-column label="版本号" prop="version"></el-table-column>
      <el-table-column label="固件类型" prop="type" :formatter="getType"></el-table-column>
      <el-table-column label="固件地址" prop="path" width="450"></el-table-column>
      <el-table-column label="添加时间" prop="createTime"></el-table-column>
      <el-table-column label="发布状态" prop="status" :formatter="getStatus"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="props">
          <router-link :to="'/ota/' + props.row.id" class="text-primary">编辑</router-link>&emsp;
          <a class="text-primary" @click="onAction('debug', props.row)">调试</a>&emsp;
          <a class="text-danger" @click="onAction('publish', props.row)">发布</a>&emsp;
          <a class="text-primary" @click="onAction('down', props.row)">下载</a>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-if="total > pageSize" :total="total" :currentPage="page" :pageSize="pageSize" @current-change="pageChange" background layout="prev, pager, next"></el-pagination>
  </el-main>
</template>
<script>
import Breadcrumb from 'components/until/breadcrumb'
import {catchError, getOtas, editOta} from '@/api/api'
export default {
  components: {Breadcrumb},
  data () {
    return {
      tableData: [],
      pageSize: 10,
      total: 0,
      page: 1
    }
  },
  computed: {
    breadcrumb () {
      let temp = [
        {iconClass: 'pcon pcon-home', title: '当前位置: 首页', to: '/home'}
      ]
      temp.push({title: '固件管理'})
      return temp
    }
  },
  methods: {
    getList () {
      getOtas({per_page: this.pageSize, page: this.page}).then(datas => {
        let {errno, msg, data, page} = datas
        if (errno === 0) {
          this.total = page.total
          this.page = page.current_page
          this.tableData = data
        } else {
          this.$message.error(msg)
        }
      }).catch(e => catchError(e, this))
    },
    getType (row) {
      const arr = ['网络模块', 'MCU']
      return arr[row.type]
    },
    getStatus (row) {
      const arr = ['未发布', '已发布']
      return arr[row.status]
    },
    onAction (action, data) {
      switch (action) {
        case 'down':
          window.location.href = 'http://' + document.domain + '/uploads/' + data.path
          break
        case 'debug':
          let mac = window.prompt('请输入调试设备IMEI号')
          if (mac) {
            if (/^[0-9,]{15,}$/.test(mac) === false) {
              window.alert('设备IMEI号错误')
              return
            }
            let param = new FormData()
            param.append('debug', mac)
            param.append('version', data.version)
            editOta(param, data.id).then(datas => {
              let {errno, msg} = datas
              if (errno) {
                console.log(errno)
              }
              window.alert(msg)
            }).catch(e => catchError(e, this))
          }
          break
        case 'publish':
          let msg = window.confirm('是否确认发布？')
          if (msg) {
            let param = new FormData()
            param.append('status', 1)
            param.append('version', data.version)
            editOta(param, data.id).then(datas => {
              let {errno, msg} = datas
              window.alert(msg)
              if (errno === 0) {
                data.status = 1
              }
            }).catch(e => catchError(e, this))
          }
          break
        default:
          break
      }
    },
    pageChange (page) {
      this.page = page
      this.getList()
    }
  },
  beforeMount () {
    this.getList()
  }
}
</script>
