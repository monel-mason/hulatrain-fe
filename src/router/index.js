import Vue from 'vue'
import VueRouter from 'vue-router'
import helloWorld from '../components/HelloWorld.vue'
import categorize from '../components/Categorize.vue'
import filter from '../components/Filter.vue'
import mask from '../components/Mask.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: helloWorld
  },
  {
    path: '/filter',
    name: 'Filter',
    component: filter
  },
  {
    path: '/mask',
    name: 'Mask',
    component: mask
  },
  {
    path: '/categorize',
    name: 'Categorize',
    component: categorize
  }
]

const router = new VueRouter({
  routes
})

export default router
