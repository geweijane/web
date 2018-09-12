import lazyLoading from '../lazyLoading'

export default {
  name: 'home',
  path: '/',
  component: lazyLoading('layout/main/index'),
  meta: {
    title: '后台系统首页'
  },
  children: [
    {
      path: 'updatePass',
      component: lazyLoading('auth/updatePass'),
      meta: {
        title: '更改密码'
      }
    }
  ]
}
