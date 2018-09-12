import lazyLoading from '../lazyLoading'

export default {
  path: '/fixed',
  component: lazyLoading('repair/index'),
  meta: {
    title: '故障解除记录',
    iconClass: 'pcon pcon-shezhi2'
  },
  children: [
    {
      path: '',
      name: 'fixed',
      component: lazyLoading('repair/list'),
      meta: {
        title: '故障解除列表'
      }
    },
    {
      path: ':id',
      component: lazyLoading('repair/audit'),
      meta: {
        title: '故障解除详情'
      }
    },
    {
      path: ':id/update',
      component: lazyLoading('repair/update'),
      meta: {
        title: '添加故障解除记录'
      }
    }
  ]
}
