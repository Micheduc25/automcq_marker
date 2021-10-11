import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import store from '../store';
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
    meta:{
      requiresAuth:true
    },
    
    component: () => import(/* webpackChunkName: "createsheet" */ '../views/CreateSheet.vue')
  }
  ,
  {
    path: '/snap-sheet/:id',
    name: 'sheetsnap',
    meta:{
      requiresAuth:true
    },
    
    component: () => import(/* webpackChunkName: "sheetsnap" */ '../views/SnapPictures.vue')
  },
  {
    path: '/view-sheet/:id',
    name: 'viewsheet',
    meta:{
      requiresAuth:true
    },
    
    component: () => import(/* webpackChunkName: "viewsheet" */ '../views/ViewSheet.vue')
  },
  {
    path: '/auth/login',
    name: 'login',
    
    component: () => import(/* webpackChunkName: "login" */ '../views/auth/Login.vue')
  },
  {
    path: '/auth/signup',
    name: 'signup',
    
    component: () => import(/* webpackChunkName: "signup" */ '../views/auth/Signup.vue')
  },
  {
    path: '/404',
    name: 'notfound',
    
    component: () => import(/* webpackChunkName: "notfound" */ '../views/404.vue')
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    meta:{
      requiresAuth:true
    },
    
    component: () => import(/* webpackChunkName: "dashboard" */ '../views/Dashboard.vue')
  },
  {
    path: '/results',
    name: 'results',
    meta:{
      requiresAuth:true
    },
    
    component: () => import(/* webpackChunkName: "results" */ '../views/results/Results.vue')
  },
  {
    path: '/results/:code',
    name: 'results_details',
    meta:{
      requiresAuth:true
    },
    
    component: () => import(/* webpackChunkName: "results_details" */ '../views/results/ResultsDetails.vue')
  },

  {
    path: '/profile',
    name: 'profile',
    meta:{
      requiresAuth:true
    },
    
    component: () => import(/* webpackChunkName: "profile" */ '../views/Profile.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach(async(to, from, next) => {
  const token  = localStorage.getItem("auth-token")
  if (!to.matched.length) {
    next('/404');
  } else {

    //if a route requires authentication, we attempt to get the user if there is a token else we redirect 
    //to login page
    if(to.matched.some(route=>route.meta.requiresAuth)){
      if(token==null){
        next({
          
          name:'login',
          query:{nextUrl:to.fullPath}
        });
      }

      else{
        
        if(store.getters.user==null){
          try{
            await store.dispatch('getUser',token);
            await store.dispatch('setIsLoggedIn',true);
            next('/dashboard');
          }
          catch(err){
            if(from.fullPath ==="/") next("/")
            else next(false);
            
          }
        }
        else{
          next();
        }
        
      }
    }
    else{
      //if there is no user but a token is available we attempt to login
      if(store.getters.user==null && token!==null){
        try{
          await store.dispatch('getUser',token);
          store.dispatch('setIsLoggedIn',true);
          
          next();
        }
        catch(err){
          next()
          
        }
      }
      else next();
    }
   
    
  }
});

export default router
