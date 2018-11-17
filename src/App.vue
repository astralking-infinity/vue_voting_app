<template>
  <div id="app">
    <router-view @loggedInCallback="loggedIn"
                 @loggedOutCallback="loggedOut"
                 :isAuthenticated="isAuthenticated"
                 :user=user
                 :token=token>
    </router-view>
  </div>
</template>

<script>
  import { endpoints } from './components/config.js'

  export default {
    name: 'app',
    data() {
      return {
        isAuthenticated: false,
        user: null,
        token: null
      }
    },
    created() {
      const auth  = localStorage.getItem('auth');
      if (auth) {
        const { token } = JSON.parse(auth);
        this.token = token
        this.loggedIn(token);
      }
    },
    methods: {
      loggedIn(token) {
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
            this.isAuthenticated = true
            this.user = user
            this.token = token
          })
          .catch(errorData => {
            if (errorData instanceof Promise) {
              errorData.then(errors => console.log(errors))
            } else {
              console.log(errorData.message)
            }
          })
      },
      loggedOut() {
        localStorage.removeItem('auth')
        this.isAuthenticated = false
        this.user = null
        this.token = null
      }
    }
  }
</script>

<style src="./style.css"></style>
