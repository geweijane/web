<template>
  <el-main>
    <el-form class="query-form" :inline="true" :model="searchData" :rules="rules" ref="searchForm" @submit.native.prevent="searchList('searchForm')">
      <el-form-item label="日志类型" prop="businessType">
        <el-select v-model.trim="searchData.businessType" size="small">
          <el-option v-for="item in stateData" :key="item.label" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="日志时间">
        <el-date-picker v-model="searchData.date" :editable="false" value-format="yyyy-MM-dd HH:mm:ss" type="datetimerange" size="small" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" :default-time="['00:00:00', '23:59:59']">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" plain size="small" native-type="submit">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" plain size="small" @click="getExcel">导出Excel文件</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" border v-loading="loading">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column label="线路">
        <template slot-scope="props">
          <div v-html="props.row.line"></div>
        </template>
      </el-table-column>
      <el-table-column label="上报值">
        <template slot-scope="props">
          <div v-html="props.row.value"></div>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="props">
          <div v-html="props.row.warning"></div>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" prop="createTime" width="180" align="center"></el-table-column>
    </el-table>
    <el-pagination v-if="total > pageSize" :total="total" :currentPage="page" :pageSize="pageSize" @current-change="pageChange" background layout="prev, pager, next"></el-pagination>
  </el-main>
</template>
<script>
import moment from 'moment'
import searchMixin from '@/until/search'
import {pickerOptions1} from 'vuex-store/modules/until/datePick'
import {catchError, getDeviceLog} from '@/api/api'
export default {
  name: 'logTable',
  mixins: [searchMixin],
  data () {
    return {
      pageSize: 5,
      searchData: {
        businessType: 0,
        date: ''
      },
      stateData: [
        {label: '所有日志', value: 0},
        {label: '报警日志', value: 1}
      ],
      tableData: [],
      deviceId: this.$route.params.deviceId,
      pickerOptions: pickerOptions1,
      loading: false
    }
  },
  computed: {
    ajaxData () {
      let temp = {...this.filter, per_page: this.pageSize, deviceName: this.deviceId}
      if (temp.date) {
        temp.date1 = temp.date[0]
        temp.date2 = temp.date[1]
        delete temp.date
      }
      return temp
    }
  },
  methods: {
    getList () {
      this.setPath()
      this.loading = true
      getDeviceLog(this.ajaxData).then(datas => {
        let {errno, page, data} = datas
        this.loading = false
        if (errno === 0) {
          this.parseLog(data)
          this.total = page.total
        }
      }).catch(e => {
        catchError(e, this)
        this.loading = false
      })
    },
    getExcel () {
      this.filter = this.searchData
      let params = {...this.ajaxData, xls: 1}
      let date1 = moment(params.date1).valueOf()
      let date2 = moment(params.date2).valueOf()
      if (date2 - date1 > 31 * 24 * 60 * 60 * 1000) {
        alert('每次最多只能导出1个月数据')
        return false
      }
      getDeviceLog(params).then(datas => {
        let {errno, data} = datas
        if (errno === 0) {
          window.location.href = data
        } else {
          alert(datas.msg)
        }
      }).catch(e => {
        catchError(e, this)
      })
    },
    parseLog (data) {
      let arr = []
      data.forEach((item, index) => {
        for (let i in item.meta) {
          if (/\d+/.test(i)) {
            let line = ''
            let value = ''
            let warning = ''
            item.meta[i].data.forEach((val, key) => {
              if (typeof val.cl === 'undefined') {
                if (parseInt(val.w2) === 1) {
                  line += '<font color="red">温度' + val.tl + '</font><br>'
                  value += '<font color="red">' + val.t + ' ℃</font><br>'
                  warning += '<font color="red">温度报警</font><br>'
                } else {
                  line += '<font color="green">温度' + val.tl + '</font><br>'
                  value += '<font color="green">' + val.t + ' ℃</font><br>'
                  warning += '<font color="green">正常</font><br>'
                }
              } else {
                switch (val.cl) {
                  case 1:
                    if (parseInt(val.w) === 1) {
                      line += '<font color="red">漏电流</font><br>'
                      value += '<font color="red">' + val.c + ' mA</font><br>'
                      warning += '<font color="red">漏电流报警</font><br>'
                    } else {
                      line += '<font color="green">漏电流</font><br>'
                      value += '<font color="green">' + val.c + ' mA</font><br>'
                      warning += '<font color="green">正常</font><br>'
                    }
                    break
                  case 2:
                    line += 'A相电流<br>'
                    value += val.c + ' A<br>'
                    warning += '<br>'
                    break
                  case 3:
                    line += 'B相电流<br>'
                    value += val.c + ' A<br>'
                    warning += '<br>'
                    break
                  case 4:
                    line += 'C相电流<br>'
                    value += val.c + ' A<br>'
                    warning += '<br>'
                    break
                  default:
                    break
                }
              }
            })
            arr.push({ line: line, value: value, warning: warning, createTime: item.createTime })
          } else {
            switch (i) {
              case 'state':
                arr.push({ line: '网络状态', value: item.meta[i] === 'Offline' ? '离线' : '上线', warning: '', createTime: item.createTime })
                break
              case 'switch':
                arr.push({ line: '消音状态', value: parseInt(item.meta[i]) ? '消音关闭' : '消音打开', warning: '', createTime: item.createTime })
                break
              case 'cwv':
                arr.push({ line: '漏电流阈值', value: item.meta[i] + 'mA', warning: '', createTime: item.createTime })
                break
              case 'twv':
                arr.push({ line: '温度阈值', value: item.meta[i] + '℃', warning: '', createTime: item.createTime })
                break
              case 'type':
              case 'devId':
                break
              default:
                arr.push({ line: '', value: JSON.stringify(item.meta[i]).replace(/([{,}])/g, '$1<br>'), warning: '', createTime: item.createTime })
                break
            }
          }
        }
      })
      this.tableData = arr
    }
  },
  beforeMount () {
    this.getList()
  }
}
</script>
<style lang="less" scoped>
  .el-main{
    background: #fff;
  }
</style>
