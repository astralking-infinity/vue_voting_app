<template>
  <div id="fragment">
    <nav class="navbar navbar-expand-sm navbar-dark bg-dark">
      <div class="container">
        <router-link class="navbar-brand" to="/">Voting App</router-link>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ml-auto" v-if="isAuthenticated">
            <li class="nav-item dropdown">
              <router-link class="nav-link dropdown-toggle" to="" role="button" id="dropdownMenurouter-link" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <font-awesome-icon icon="user-circle" /> {{ user.username }}
              </router-link>
              <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenurouter-link">
                <router-link class="dropdown-item"
                             :to="{ name: 'user-polls', params: { username: user.username } }">
                  <font-awesome-icon icon="poll" /> My poll</router-link>
                <div class="dropdown-divider"></div>
                <router-link class="dropdown-item" to="/logout">
                  <font-awesome-icon icon="sign-out-alt" /> Log out</router-link>
              </div>
            </li>
          </ul>
          <form class="form-inline ml-auto" v-else>
            <router-link class="btn btn-outline-secondary "
                         :to="{ name: 'login', query: { next: getReferrer() } }">
              Log in
            </router-link>
            <router-link class="btn btn-primary ml-2"
                         :to="{ name: 'signup', query: { next: getReferrer() } }">
              Sign up
            </router-link>
          </form>
        </div>
      </div>
    </nav>

    <main class="container">
      <div class="py-3">
        <router-view></router-view>
      </div>
    </main>

    <footer class="text-center text-light bg-dark py-4"></footer>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'home',
    methods: {
      getReferrer() {
        return this.$route.fullPath
      }
    },
    computed: {
      ...mapGetters(['isAuthenticated', 'user'])
    }
  }
</script>