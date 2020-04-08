import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'


import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.css'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'

// notification component
import Notify from 'vue-notifyjs'
Vue.use(Notify)
  

// LightBootstrap plugin
import LightBootstrap from './light-bootstrap-main'

// router setup
import routes from './routes/routes'

//import store
import store from './store'

// Session plugin
import VueSession from 'vue-session'

// Bootstrap Vue
import BootstrapVue from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import VueGoogleCharts from 'vue-google-charts'
Vue.use(VueGoogleCharts)

// Moment
import moment from 'moment'

// VeeValidate for form validation
import VeeValidate from 'vee-validate';

// plugin setup
Vue.use(VueRouter)
Vue.use(LightBootstrap)

Vue.use(VueMaterial)

Vue.config.silent = true 

Vue.prototype.moment = moment;

// Conflict between fields props of B-Table and VeeValidate: Instead, change the Vee fields from configuration and it should work
Vue.use(VeeValidate, { fieldsBagName: 'veeFields' });

// persist=true option is passed to determine that the session may persist between tabs and browser instances
var options = {
  persist: true
}
Vue.use(VueSession, options)
Vue.use(BootstrapVue);

// configure router
const router = new VueRouter({
  routes, // short for routes: routes
  linkActiveClass: 'nav-item active'
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store
})
