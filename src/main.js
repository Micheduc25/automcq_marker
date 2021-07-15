import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import "@/assets/styles/main.css";

import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

import VueLoading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

const swal_options = {
    confirmButtonColor: '#2f48ff',
    cancelButtonColor: '#ff7674',
  };

  const loader_options = {color:'#2f48ff', width:60, height:60}


createApp(App).use(router).use(store).use(VueSweetalert2,swal_options).use(VueLoading,loader_options).mount('#app')

