import Vue from 'vue'
import App from './App.vue'
import { router } from './router.js'
import { store } from './store.js'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faMinus,
         faSignOutAlt,
         faUserCircle,
         faCircleNotch,
         faPoll } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import 'bootstrap/dist/js/bootstrap.min.js'
import 'bootstrap/dist/css/bootstrap.min.css'

library.add(faMinus, faSignOutAlt, faUserCircle, faCircleNotch, faPoll)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
