import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import { boardDatastore, customerDatastore, orderDatastore, scheduleDatastore, storeDatastore, userDatastore, localDatastore, tradeDatastore } from './datastore'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import crypto from './utils/Crypto'
import common from './utils/Common'
import VueDaumPostcode from 'vue-daum-postcode'
import moment from 'moment'
import EventBus from './utils/EventBus'
import DatastoreHelper from './utils/DatastoreHelper'

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
  'userDatastore': userDatastore,
  'localDatastore': localDatastore,
  'tradeDatastore': tradeDatastore
}
moment.locale('ko')
Vue.prototype.$moment = moment
Vue.prototype.$user = {
  isLogin: false,
  idx: '',
  id: '',
  name: '',
  storeName: ''
}
Vue.prototype.$bus = EventBus
Vue.prototype.$dbHelper = DatastoreHelper

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
