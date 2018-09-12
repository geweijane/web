import lazyLoading from '../lazyLoading'

export default {
  name: 'menu',
  path: '/',
  component: lazyLoading('layout/main/index'),
  meta: {
    title: '组件',
    iconClass: 'el-icon-setting'
  },
  children: [
    {
      path: 'elementui',
      meta: {
        title: 'element-ui 后台组件库',
        redirect: 'http://element.eleme.io/#/zh-CN/component/installation',
        outLink: true
      }
    },
    {
      path: 'ueditor',
      component: lazyLoading('index'),
      meta: {
        title: 'ueditor-富文本编辑器'
      },
      children: [
        {
          path: '',
          component: lazyLoading('ueditor/index'),
          meta: {
            title: 'ueditor--实例'
          }
        }
      ]
    },
    {
      path: 'markdown',
      component: lazyLoading('index'),
      meta: {
        title: 'markdown-文档编辑器'
      },
      children: [
        {
          path: '',
          component: lazyLoading('markdown/index'),
          meta: {
            title: 'ueditor--实例'
          }
        }
      ]
    },
    {
      path: 'highligh',
      component: lazyLoading('index'),
      meta: {
        title: 'highligh-代码高亮插件'
      },
      children: [
        {
          path: '',
          component: lazyLoading('highlight/index'),
          meta: {
            title: 'highligh--实例'
          }
        }
      ]
    },
    {
      path: 'upload',
      component: lazyLoading('index'),
      meta: {
        title: 'element-ui-文件上传'
      },
      children: [
        {
          path: '',
          component: lazyLoading('upload/index'),
          meta: {
            title: '文件上传--实例'
          }
        }
      ]
    }
  ]

}
