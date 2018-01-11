import Vue from 'vue'
import Router from 'vue-router'
// import List from '@/components/List'
import WebDesigner from '@/components/WebDesigner'

//  import axios from 'axios'

Vue.use(Router)

//  const API_BASE = 'http://localhost:8080'

export default new Router({
  routes: [
    // {
    //   path: '/',
    //   name: 'List',
    //   component: List
    // },
    // {
    //   path: '/new',
    //   name: 'New',
    //   component: WebDesigner
    // }
    {
      path: '/',
      name: 'New',
      component: WebDesigner
    }
  ]
})
