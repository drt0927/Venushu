import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import db from './datastore'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.prototype.$db = db
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
