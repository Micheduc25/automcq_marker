import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
// import CreateSheet from '../views/CreateSheet';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/create-sheet',
    name: 'createsheet',
    exact:true,
    component: () => import(/* webpackChunkName: "createsheet" */ '../views/CreateSheet.vue')
  }
  ,
  {
    path: '/snap-sheet',
    name: 'sheetsnap',
    exact:true,
    component: () => import(/* webpackChunkName: "sheetsnap" */ '../views/SnapPictures.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
