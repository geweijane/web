import lazyLoading from '../lazyLoading'

export default {
  path: '/user',
  component: lazyLoading('user/index'),
  meta: {
    iconClass: 'pcon pcon-people',
    title: '用户管理'
  },
  children: [
    {
      path: '',
      name: 'user',
      component: lazyLoading('user/list'),
      meta: {
        title: '用户列表'
      }
    },
    {
      path: 'add',
      component: lazyLoading('user/update'),
      meta: {
        title: '添加用户'
      }
    },
    {
      path: ':userName',
      component: lazyLoading('user/update'),
      meta: {
        title: '用户信息'
      }
    }
  ]
}
