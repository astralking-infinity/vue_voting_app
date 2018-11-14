import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faMinus,
         faSignOutAlt,
         faUserCircle,
         faCircleNotch,
         faPoll } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import 'bootstrap/dist/css/bootstrap.min.css'

library.add(faMinus, faSignOutAlt, faUserCircle, faCircleNotch, faPoll)

Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.use(VueRouter)
Vue.config.productionTip = false

import Home from './components/Home.vue'
import SignUpForm from './components/SignUpForm.vue'
import LoginForm from './components/LoginForm.vue'
import Logout from './components/Logout.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/signup', component: SignUpForm },
  { path: '/login', component: LoginForm },
  { path: '/logout', component: Logout }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
