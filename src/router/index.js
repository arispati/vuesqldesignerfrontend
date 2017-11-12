import Vue from 'vue'
import Router from 'vue-router'
import List from '@/components/List'
import WebDesigner from '@/components/WebDesigner'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'List',
      component: List
    },
    {
      path: '/new',
      name: 'New',
      component: WebDesigner
    }
  ]
})
