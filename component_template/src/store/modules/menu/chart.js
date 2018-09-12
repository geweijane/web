import lazyLoading from '../lazyLoading'

export default {
  name: 'chart',
  path: '/',
  component: lazyLoading('layout/main/index'),
  meta: {
    title: 'echart 图表',
    iconClass: 'pcon pcon-bar-chart'
  },
  children: [
    {
      path: 'chart/1',
      component: lazyLoading('chart/demo1'),
      meta: {
        title: '亿龙饮品酿造图'
      }
    },
    {
      path: 'chart/2',
      component: lazyLoading('chart/demo2'),
      meta: {
        title: '华建实时滚动图表'
      }
    },
    {
      path: 'chart/3',
      component: lazyLoading('chart/demo3'),
      meta: {
        title: ''
      }
    }

  ]
}
