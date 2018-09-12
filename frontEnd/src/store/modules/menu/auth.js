import lazyLoading from '../lazyLoading'

export default {
  name: 'auth',
  path: '/auth',
  component: lazyLoading('auth/index'),
  meta: {
    title: '用户登录模块'
  },
  children: [
    {
      path: 'login',
      component: lazyLoading('auth/login'),
      meta: {
        title: '登录',
        haveNavbar: false
      }
    },
    {
      path: 'layout',
      redirect: '/auth/login',
      meta: {
        title: '退出系统'
      }
    },
    {
      path: 'forget',
      component: lazyLoading('auth/forget'),
      meta: {
        title: '更改密码',
        haveNavbar: false
      }
    }
  ]
}
