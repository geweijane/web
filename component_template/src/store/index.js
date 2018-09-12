import Vue from 'vue'
import Vuex from 'vuex'
import menu from './modules/menu'
import app from './modules/app'
import until from './modules/until'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  strict: true,
  state: {},
  mutations: {},
  actions: {},
  getters,
  modules: {
    menu,
    app,
    until
  }
})

export default store
