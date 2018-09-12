import Vue from 'vue'
import Router from 'vue-router'

import menuModules from 'vuex-store/modules/menu'

Vue.use(Router)

let router = new Router({
  mode: 'history',
  routes: [
    ...getMenuRouters(menuModules.state.item),
    ...getMenuRouters(menuModules.state.other)
  ]
})

// 判断用户有没有登录，登录有没有失效进行跳转拦截
router.beforeEach((to, from, next) => {
  if (to.path === '/auth/login') {
    next()
  } else {
    let user = sessionStorage.getItem('user')
    if (!user && to.path.indexOf('/auth') !== -1) {
      next()
    } else if (!user) {
      next({path: '/auth/login'})
    } else {
      user = JSON.parse(user)
      if (user.timeout === 'undefined') {
        next({path: '/auth/login'})
      } else {
        next()
      }
    }
  }
})

// 将菜单中所有的路由提取出来，方便绑定
function getMenuRouters (menus = [], routers = []) {
  for (let i = 0; i < menus.length; i++) {
    let item = menus[i]
    if (item.path) {
      routers.push(item)
    }
    if (item.children) {
      getMenuRouters(item.children, routers)
    }
  }
  return routers
}

export default router
