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
        title: '更改密码'
      }
    },
    {
      path: 'resetPassword',
      component: lazyLoading('auth/resetPass'),
      meta: {
        title: '重置密码'
      }
    },
    {
      path: 'register',
      component: lazyLoading('auth/register'),
      meta: {
        title: '立即注册'
      }
    }
  ]
}
