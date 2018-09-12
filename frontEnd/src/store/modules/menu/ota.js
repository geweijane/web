import lazyLoading from '../lazyLoading'

export default {
  path: '/ota',
  component: lazyLoading('ota/index'),
  meta: {
    iconClass: 'pcon pcon-people',
    title: '固件管理'
  },
  children: [
    {
      path: '',
      name: 'ota',
      component: lazyLoading('ota/list'),
      meta: {
        title: '固件列表'
      }
    },
    {
      path: 'add',
      component: lazyLoading('ota/edit'),
      meta: {
        title: '添加固件'
      }
    },
    {
      path: ':id',
      component: lazyLoading('ota/edit'),
      meta: {
        title: '编辑固件'
      }
    }
  ]
}
