<template>
  <p class="text-center">
    Logging out... <font-awesome-icon icon="circle-notch" />
  </p>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { endpoints } from './config.js'

  export default {
    name: 'logout',
    mounted() {
      const { isAuthenticated, token } = this
      if (isAuthenticated) {
        const conf = {
          method: 'post',
          headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
          })
        }
        fetch(endpoints.logout(), conf)
          .then(response => {
            if (!response.ok) {
              throw response.json()
            }
            return response.json()
          })
          .then(() => {
            this.$store.dispatch('loggedOut')
            this.$router.replace({ name: 'home' })
          })
          .catch(errorData => {
            if (errorData instanceof Promise) {
              errorData.then(errors => console.log(errors))
            } else {
              console.log(errorData)
            }
          })
      }
    },
    computed: {
      ...mapGetters(['isAuthenticated', 'token'])
    }
  }
</script>