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

import 'bootstrap/dist/js/bootstrap.min.js'
import 'bootstrap/dist/css/bootstrap.min.css'

library.add(faMinus, faSignOutAlt, faUserCircle, faCircleNotch, faPoll)

Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.use(VueRouter)
Vue.config.productionTip = false

// Components
import Home from './components/Home.vue'
import SignUpForm from './components/SignUpForm.vue'
import LoginForm from './components/LoginForm.vue'
import Logout from './components/Logout.vue'
import PollList from './components/PollList.vue'
import PollDetail from './components/PollDetail.vue'
import UserPolls from './components/UserPolls.vue'

const routes = [
  { path: '/', component: Home, redirect: { name: 'poll-list'}, name: 'home',
    children: [
      { path: 'polls', component: PollList, name: 'poll-list' },
      { path: 'polls/:pollId', component: PollDetail, name: 'poll-detail' },
      { path: 'profile/:username/polls', component: UserPolls, name: 'user-polls' }
    ]
  },
  { path: '/signup', component: SignUpForm, name: 'signup' },
  { path: '/login', component: LoginForm, name: 'login' },
  { path: '/logout', component: Logout, name: 'logout' }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
