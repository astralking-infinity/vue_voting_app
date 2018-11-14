<template>
	<nav class="navbar navbar-expand-sm navbar-dark bg-dark">
    <div class="container">
      <router-link class="navbar-brand" to="/">Voting App</router-link>
      <button class="navbar-toggler"type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ml-auto" v-if="isAuthenticated">
          <li class="nav-item dropdown">
            <router-link class="nav-router-link dropdown-toggle" to="#" role="button" id="dropdownMenurouter-link" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <font-awesome-icon icon="user-circle" /> {user.username}
            </router-link>
            <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenurouter-link">
              <router-link class="dropdown-item" to={`/profile/${user.username}/polls`}>
                <font-awesome-icon icon="poll" /> My poll</router-link>
              <div class="dropdown-divider"></div>
              <router-link class="dropdown-item" to="/logout">
                <font-awesome-icon icon="sign-out-alt" /> Log out</router-link>
            </div>
          </li>
        </ul>
        <form class="form-inline ml-auto" v-else>
          <router-link class="btn btn-outline-secondary " to="/login">
            Log in
          </router-link>
          <router-link class="btn btn-primary ml-2" to="/signup">
            Sign up
          </router-link>
        </form>
      </div>
    </div>
  </nav>
</template>

<script>
  export default {
    name: 'Home'
  }
</script>