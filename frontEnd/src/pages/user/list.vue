<template>
  <el-main>
    <breadcrumb :data="breadcrumb"></breadcrumb>
    <div class="sub-nav">
      <router-link to="/user/add" v-if="role === 1">
        <el-button size="mini" plain round>添加用户</el-button>
      </router-link>
    </div>
    <el-form class="query-form" :inline="true" :model="searchData" :rules="rules" ref="searchForm" @submit.native.prevent="searchList('searchForm')">
      <el-form-item label="用户名" prop="filter">
        <el-input v-model.trim="searchData.filter" size="small" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" plain size="small" native-type="submit">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="user-con">
      <template v-if="tableData.length === 0">
        <el-alert title="当前项目没有用户，或者您没有权限查看当前项目用户!" type="warning" showIcon :closable="false"></el-alert>
      </template>
      <template v-else>
        <a v-for="item in tableData" :key="item.userName" @click="goLink(item)">
          <el-card v-bind:class="{active: item.status}">
            <div class="user-item">
              <i :class="'lock-icon pcon ' + (item.status ? 'pcon-unlock' : 'pcon-lock')" @click.stop="lockUser(item)" v-if="role === 1"></i>
              <i class="user-icon pcon pcon-people"></i>
              <div>{{item.userName}}</div>
            </div>
            <el-form labelWidth="8rem" labelSuffix=": " class="user-detail">
              <el-form-item label="姓名">{{item.trueName}}</el-form-item>
              <el-form-item label="手机">{{item.mobile}}</el-form-item>
              <el-form-item label="权限">{{item.roleName}}</el-form-item>
            </el-form>
          </el-card>
        </a>
      </template>

      <el-pagination v-if="total > pageSize" :total="total" :currentPage="page" :pageSize="pageSize" @current-change="pageChange" background layout="prev, pager, next"></el-pagination>
    </div>
  </el-main>
</template>
<script>
import Breadcrumb from 'components/until/breadcrumb'
import searchMixin from '@/until/search'
import sessionMixin from '@/until/session'
import {catchError, getUsers, updateUser} from '@/api/api'
export default {
  components: {Breadcrumb},
  mixins: [searchMixin, sessionMixin],
  name: 'userList',
  data () {
    return {
      searchData: {
        filter: '',
        project: '',
        area: ''
      },
      tableData: [],
      pageSize: 8
    }
  },
  computed: {
    breadcrumb () {
      let temp = [
        {iconClass: 'pcon pcon-home', title: '当前位置: 首页', to: '/home'}
      ]
      let session = this.session
      if (session) {
        for (let i = 0; i < session.length; i++) {
          if (session[i].area) {
            temp.push({title: session[i].title, to: '/user?project=' + session[i].id})
          } else {
            temp.push({title: session[i].title, to: '/user?area=' + session[i].id})
          }
        }
      }
      temp.push({title: '用户管理'})
      return temp
    },
    query () {
      return this.$route.query
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
      getUsers({...this.filter, per_page: this.pageSize}).then(datas => {
        let {errno, data, page, msg} = datas
        if (errno === 0) {
          this.tableData = data
          this.total = page.total
        } else {
          this.$message.error(msg)
        }
      }).catch(e => catchError(e, this))
    },
    lockUser (item) {
      this.$confirm('您确定要' + (item.status ? '锁定' : '解锁') + '用户', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateUser({userName: item.userName, status: item.status ? 0 : 1}).then(datas => {
          let {errno, data, msg} = datas
          if (errno === 0) {
            item.status = data.status
          } else {
            this.$message.error(msg)
          }
        }).catch(e => catchError(e, this))
      }).catch(() => { })
    },
    goLink (item) {
      this.$router.push({path: '/user/' + item.userName})
    }
  },
  beforeMount () {
    this.changeFormData(this.query)
    this.initFilter()
    this.firstPage()
  }
}
</script>
<style lang="less" scoped>
.user-con{
  display: flex;
  flex-wrap: wrap;
  margin-right: -1rem;
  a{
    padding: 0 1rem 1rem 0;
    min-width: 20rem;
    width: 25%;
    box-sizing: border-box;
    .el-card{
      box-shadow: none;
      border-top-width: 4px;
      border-radius: 0;
      background: #f8fff7;
      .user-item{
        text-align: center;
        font-size: 1.6rem;
        line-height: 2rem;
        font-weight: bold;
        position: relative;
        .lock-icon{
          font-size: 3rem;
          position: absolute;
          color: #ddd;
          right: 0;
          cursor: pointer;
        }
        .user-icon{
          font-size: 10rem;
          color: #fff;
          background: #ddd;
          border-radius: 5rem;
          padding: 1rem;
          margin-bottom: 1rem;
        }
      }
      &.active {
        border-top-color: #024093;
        .user-item{
          .lock-icon{
            color: #ff0000;
          }
          .user-icon{
            background: #024093;
          }
        }
      }
      .user-detail{
        color: #666;
        .el-form-item{
          margin-bottom: 0;
          & > :nth-child(n){
            line-height: 2.5rem;
          }
        }
      }
    }
  }
}
</style>
