// import Vue from 'vue' // try using this on a production system
import Vue from 'vue/dist/vue.js' // remove vue.esm.js warning in the console
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'

import App from './components/app.vue'
import Contactus from './components/helloworld.vue'

Vue.component('helloworld', Contactus);

new Vue({
  el: '#app',
  render: h => h(App)
});
