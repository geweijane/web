// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from 'vuex-store'
import { sync } from 'vuex-router-sync'
// element-ui 组件
import './components/element-components-plugin'
// 代码高亮插件
import 'components/highlight'

// 配置百度编辑器
import 'static/ueditor/ueditor.config.js'
import 'static/ueditor/ueditor.all.min.js'
import 'static/ueditor/lang/zh-cn/zh-cn.js'
import 'static/ueditor/ueditor.parse.min.js'

sync(store, router)
Vue.config.productionTip = false
Vue.config.devtools = true

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
