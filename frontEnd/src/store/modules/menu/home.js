import lazyLoading from '../lazyLoading'

export default {
  path: '/home',
  component: lazyLoading('layout/view/default'),
  meta: {
    title: '主页',
    iconClass: 'pcon pcon-home'
  },
  children: [
    {
      path: '',
      component: lazyLoading('home/index'),
      meta: {
        title: '主页'
      }
    },
    {
      path: 'updatePass',
      component: lazyLoading('auth/updatePass'),
      meta: {
        title: '更改密码'
      }
    }
  ]
}
