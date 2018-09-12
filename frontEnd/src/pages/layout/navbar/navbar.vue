<template>
  <el-header class="header" height="10rem">
    <div class="top-nav">
      <div class="pull-left">
        <i class="pcon pcon-people"></i>欢迎您,
        <router-link :to="{path:'/user/'+userName}" class="topbar">{{userName}}</router-link>!
      </div>
      <ul mode="horizontal" class="menu pull-right">
        <router-link v-for="item in account" :key="item.to" :to="item.to" tag="li" activeClass="active">
          <i :class="item.iconClass"></i>
          <span>{{item.title}}</span>
        </router-link>
      </ul>
    </div>
    <el-row class="row">
      <el-col :span="24">
        <a class="logo pull-left">
          <img :src="require('../../../assets/img/logo.png')"/>
          <span>集贤电气火灾监控系统</span>
        </a>
        <ul class="nav-menu pull-right">
          <router-link v-for="item in menu" v-if="role === 4 || item.path !== '/ota'" :key="item.path" :to="item.path" tag="li" activeClass="active">
            <i :class="item.meta.iconClass"></i>
            <span>{{item.meta.title}}</span>
          </router-link>
        </ul>
      </el-col>
    </el-row>
  </el-header>
</template>
<script>
import {getUser, catchError} from '@/api/api'
import sessionMixin from '@/until/session'
import {mapGetters} from 'vuex'
export default {
  name: 'navbar',
  mixins: [sessionMixin],
  data () {
    return {
      loginPath: '/auth/login',
      user: JSON.parse(sessionStorage.getItem('user')),
      users: JSON.parse(localStorage.getItem('users')),
      activeIndex: '',
      rootPath: '',
      account: [
        {to: '/warning', title: '通知', iconClass: 'pcon pcon-bell'},
        {to: '/auth/layout', title: '退出', iconClass: 'pcon pcon-084tuichu'}
      ]
    }
  },
  computed: {
    ...mapGetters({menu: 'menuItem'}),
    userName () {
      return !this.user ? '' : this.user.userName
    }
  },
  methods: {
    handleCommand (command) {
      if (command.href) {
        this.$router.push({path: command.href})
      } else {
        sessionStorage.setItem('user', command)
        this.user = command
      }
    },
    getUser () {
      getUser({userName: this.userName}).then().catch(e => catchError(e, this))
    },
    setActiveIndex () {
      let path = this.$route.path
      let temp = null
      this.menu.forEach(n => {
        if (path.indexOf(n.to) !== -1) {
          temp = n
        }
      })
      this.activeIndex = !temp ? '' : temp.to
    }
  },
  beforeMount () {
    this.getUser()
    this.setActiveIndex()
  }
}
</script>
<style lang="less" scoped>
@import url('../../../less/_variables.less');
@import url("../../../less/_until.less");

.header{
  height: 8rem;
  background: #044598;
  color: #fff;
  padding: 0;
  z-index: 10;
  box-shadow: #003271 0px 4px 6px;
  .topbar{
    color: #fff;
  }
  .top-nav{
    background: #003466;
    height: 2rem;
    line-height: 2rem;
    padding: 0 2.5rem;
    ul{
      list-style: none;
      padding: 0;
      margin: 0;
      &.menu{
        li{
          float: left;
          padding-left: 2.5rem;
          cursor: pointer;
        }
      }
    }
  }
  .row{
    .gradient(top, #023d8b, #014baa);
    .logo{
      padding-left: 2.5rem;
      line-height: 7.5rem;
      span{
        font-size: 3rem;
        font-weight: bold;
        color: #ffffff;
        text-shadow: #888 0px 5px 8px;
      }
      img{
        vertical-align: text-bottom;
        margin-right: 1rem;
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
    .nav-menu{
      list-style: none;
      padding: 0;
      margin-bottom: 0;
      box-sizing: content-box;
      li{
        .pull-left();
        width: 10rem;
        text-align: center;
        padding: 1rem 0 ;
        cursor: pointer;
        i{
          width: 100%;
          font-size: 4rem;
          line-height: 4rem;
        }
        span{
          font-size: 1.6rem;
          font-weight: bold;
          line-height: 2rem;
          display: block;
        }
        &.active, &:hover{
          .gradient(top, #05479d, #0c61fa);
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
