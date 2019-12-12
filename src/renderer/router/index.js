import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: require('@/views/user-asset/user-asset').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
