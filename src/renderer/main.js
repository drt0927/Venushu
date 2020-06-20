import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import { boardDatastore, customerDatastore, orderDatastore, scheduleDatastore, storeDatastore, userDatastore } from './datastore'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import crypto from './utils/Crypto'
import common from './utils/Common'
import VueDaumPostcode from 'vue-daum-postcode'
import moment from 'moment'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.prototype.$crypto = crypto
Vue.prototype.$common = common
Vue.prototype.$db = {
  'boardDatastore': boardDatastore,
  'customerDatastore': customerDatastore,
  'orderDatastore': orderDatastore,
  'scheduleDatastore': scheduleDatastore,
  'storeDatastore': storeDatastore,
  'userDatastore': userDatastore
}
moment.locale('ko')
Vue.prototype.$moment = moment

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(VueDaumPostcode)

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
