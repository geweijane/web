import lazyLoading from '../lazyLoading'

export default {
  path: '/project',
  component: lazyLoading('device/index'),
  meta: {
    title: '智能监控',
    iconClass: 'pcon pcon-tree'
  },
  children: [
    {
      path: '',
      name: 'device',
      component: lazyLoading('device/list'),
      meta: {
        title: '项目列表'
      }
    },
    {
      path: ':id',
      component: lazyLoading('device/list'),
      meta: {
        title: '项目列表'
      }
    },
    {
      path: ':id/modify',
      component: lazyLoading('device/modify'),
      meta: {
        title: '修改项目',
        type: 'modify'
      }
    },
    {
      path: ':id/add',
      component: lazyLoading('device/modify'),
      meta: {
        title: '添加项目',
        type: 'add'
      }
    },
    {
      path: ':id/device',
      component: lazyLoading('device/device'),
      meta: {
        title: '设备列表'
      }
    },
    {
      path: ':id/outline',
      component: lazyLoading('device/outline'),
      meta: {
        title: '未上线设备'
      }
    },
    {
      path: ':id/device/:deviceId',
      component: lazyLoading('device/detail'),
      meta: {
        title: '设备详情'
      }
    },
    {
      path: ':id/device/:deviceId/modify',
      component: lazyLoading('device/updateDevice'),
      meta: {
        title: '修改设备'
      }
    }
  ]
}
