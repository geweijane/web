import Vue from 'vue';
import Router from 'vue-router';
import otaList from './views/ota/list.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'ota',
      component: otaList,
    },
  ],
});
