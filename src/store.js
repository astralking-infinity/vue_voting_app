import Vue from 'vue'
import Vuex from 'vuex'

import { endpoints } from './components/config.js'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    isAuthenticated: false,
    user: null,
    token: null
  },
  getters: {
    isAuthenticated(state) {
      return state.isAuthenticated
    },
    user(state) {
      return state.user
    },
    token(state) {
      const auth  = localStorage.getItem('auth')
      return state.token || auth ? JSON.parse(auth).token : null
    }
  },
  mutations: {
    authenticate(state, payload) {
      state.isAuthenticated = true
      state.user = payload.user
      state.token = payload.token
    },
    unauthenticate(state) {
      state.isAuthenticated = false
      state.user = null
      state.token = null
    }
  },
  actions: {
    loggedIn(context, payload=null) {
      const auth  = localStorage.getItem('auth')
      if (auth || payload) {
        context.dispatch('getUser', auth ? JSON.parse(auth).token : payload.token)
        return true
      }
      return false
    },
    loggedOut(context) {
      context.commit('unauthenticate')
      localStorage.removeItem('auth')
    },
    getUser(context, token = null) {
      const conf = {
        method: 'get',
        headers: new Headers({
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        })
      }

      fetch(endpoints.user(), conf)
        .then(response => {
          if (!response.ok) {
            throw response.json()
          }
          return response.json()
        })
        .then(user => {
          const auth = JSON.stringify({ token })
          localStorage.setItem('auth', auth)
          context.commit('authenticate', {
            token: token,
            user: user
          })
        })
        .catch(errorData => {
          if (errorData instanceof Promise) {
            errorData.then(errors => console.log(errors))
          } else {
            console.log(errorData.message)
          }
        })
    },

  }
})