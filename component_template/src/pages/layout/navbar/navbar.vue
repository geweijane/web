<template>
  <el-header class="header">
    <el-row class="row">
      <el-col :span="8">
        <a class="logo">
          集贤云
          <img src="">
        </a>
        <router-link :to="rootPath" class="home-link">后台管理中心</router-link>
      </el-col>
      <el-col :span="16">
        <el-menu mode="horizontal" class="menu" background-color="#2a3238" text-color="#fff" ctive-text-color="#2a3238" v-if="isAuth">
          <el-menu-item index="2">
            <router-link to="/auth/login">登录</router-link>
          </el-menu-item>
        </el-menu>
        <el-menu mode="horizontal" class="menu" background-color="#2a3238" text-color="#fff" ctive-text-color="#2a3238"  v-else>
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              <i class="pcon pcon-people"></i> {{userName}} <i class="el-icon-caret-bottom"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(item, index) in account" :key="index" :command="item.href">
                {{item.title}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-menu>
      </el-col>
    </el-row>
  </el-header>
</template>
<script>
import {getManager, catchError} from '@/api/api'
export default {
  name: 'navbar',
  data () {
    return {
      loginPath: '/auth/login',
      user: JSON.parse(localStorage.getItem('user')),
      rootPath: '',
      account: [
        {href: '/updatePass', title: '更改密码'},
        {href: '/auth/layout', title: '退出登录'}
      ]
    }
  },
  computed: {
    isAuth () {
      return !this.user
    },
    userName () {
      return !this.user ? '' : this.user.userName
    }
  },
  methods: {
    handleCommand (command) {
      this.$router.push({path: command})
    },
    getUser () {
      // 这里用于首页打开没有登录的情况
      getManager({name: this.userName}).then(datas => {
      }).catch(e => catchError(e, this))
    }
  },
  beforeMount () {
    this.getUser()
  }
}
</script>
<style lang="less" scoped>
@import url('../../../less/_variables.less');
.header{
  height: 5rem;
  background: #2a3238;
  color: #fff;
  padding: 0;
  .row{
    line-height: 5rem;
    .logo{
      font-size: 2rem;
      padding: 0 1rem;
      img{
        width: 10rem;
        height: 4rem;
        display: none;
      }
    }
    .home-link{
      line-height: 5rem;
      padding: 1rem;
      border-left: 1px solid #fff;
    }
    a {
      &, &:hover, &:active{
        color: #fff;
        text-decoration: none;
      }
    }
    .menu{
      .pull-right();
      border: none;
      line-height: 4.8rem;
      .pcon{
        font-size: 2rem;
        color: #fff;
        vertical-align: middle;
      }
      .el-dropdown-link{
        color: #fff;
        padding: 0 2rem;
      }
      .badge{
        & > :nth-child(2){
          border: 0;
          top: 20px;
          background: red;
          right: 10px;
        }
      }
    }
  }
}
.el-dropdown-menu{
  a {
    color: inherit;
    &, &:hover, &:active{
      text-decoration: none;
    }
  }
  .pcon{
    font-size: 2rem;
    vertical-align: middle;
    padding-right: 1rem;
  }
}
</style>
