// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from 'vuex-store'
import { sync } from 'vuex-router-sync'
import './components/element-components-plugin'

// import Mock from './mock'
// Mock.bootstrap()

sync(store, router)

Vue.config.productionTip = false
Vue.config.devtools = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
