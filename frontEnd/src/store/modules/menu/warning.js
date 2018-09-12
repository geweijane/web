import lazyLoading from '../lazyLoading'

export default {
  path: '/warning',
  component: lazyLoading('warning/index'),
  meta: {
    title: '报警消息',
    iconClass: 'pcon pcon-alarm'
  },
  children: [
    {
      path: '',
      name: 'warning',
      component: lazyLoading('warning/list'),
      meta: {
        title: '报警消息列表'
      }
    }
  ]
}
