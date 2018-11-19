import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from './components/Home.vue'
import SignUpForm from './components/SignUpForm.vue'
import LoginForm from './components/LoginForm.vue'
import Logout from './components/Logout.vue'
import PollList from './components/PollList.vue'
import PollDetail from './components/PollDetail.vue'
import UserPolls from './components/UserPolls.vue'

Vue.use(VueRouter)

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

export const router = new VueRouter({
  mode: 'history',
  routes
})