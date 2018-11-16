<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-4 col-md-6 col-sm-8 py-3">
        <div class="card">
          <div class="card-header text-center">
            <h2>
              <router-link class="card-link" to="/">Voting App</router-link>
            </h2>
          </div>
          <div class="card-body">
            <h3 class="card-title">Log in</h3>
            <form @submit.prevent="handleLogin" method="post">
              <div class="alert alert-danger" role="alert"
                   v-if="errors && ('non_field_errors' in errors)">
                <div v-for="(error, idx) in errors.non_field_errors"
                     :key="idx">
                  {{ error }}
                </div>
              </div>
              <div class="form-group">
                <label for="username">Username:</label>
                <input id="username"
                       type="text"
                       name="username"
                       v-model="username"
                       class='form-control'
                       :class="{'is-invalid': errors && ('username' in errors)}"
                       required />
                <div v-if="errors && ('username' in errors)"
                     class="invalid-feedback">
                  <div v-for="(error, idx) in errors.username"
                      :key="idx">
                    {{ error }}
                  </div>
                </div>
              </div>
              <div class="form-group">
                <label for="password">Password:</label>
                <input id="password"
                       type="password"
                       name="password"
                       v-model="password"
                       class="form-control"
                       :class="{'is-invalid': errors && ('password' in errors)}"
                       autoComplete="off"
                       required />
                <div v-if="errors && ('password' in errors)"
                     class="invalid-feedback">
                  <div v-for="(error, idx) in errors.password"
                       :key="idx">
                    {{ error }}
                  </div>
                </div>
              </div>
              <button type="submit" class="btn btn-primary btn-block">Log in</button>
            </form>
          </div>
          <div class="card-footer text-center text-muted">
            Don't have an account yet? <router-link to="/signup">Sign up</router-link>
          </div>
        </div>
        <!--
        <div class="text-center py-2">
          <router-link to="#">Forgot your password?</router-link>
        </div>
         -->
      </div>
    </div>
  </div>
</template>

<script>
  import { endpoints } from './config.js'

  export default {
    name: 'loginForm',
    data() {
      return {
        username: '',
        email: undefined,
        password: '',
        errors: null
      }
    },
    mounted() {
      const auth  = localStorage.getItem('auth');
      if (auth) {
        this.$router.replace({ path: this.$route.query.next || '/' })
      }
    },
    methods: {
      handleLogin() {
        const { username, password, email } = this
        const loginAuth = { username, password, email }

        const conf = {
          method: 'post',
          body: JSON.stringify(loginAuth),
          headers: new Headers({ 'Content-Type': 'application/json' })
        }

        fetch(endpoints.login(), conf)
          .then(response => {
            if (!response.ok) {
              throw response.json()
            }
            return response.json()
          })
          .then(successData => {
            if ('key' in successData) {
              this.$emit('loggedInCallback', successData.key)
              this.$router.replace({ path: this.$route.query.next || '/' })
            } else {
              console.log('Something went wrong:')
              console.log(successData)
            }
          })
          .catch(errorData => {
            if (errorData instanceof Promise) {
              errorData.then(errors => this.errors = errors )
            } else {
              this.errors = {
                detail: [errorData.message]
              }
            }
          })
      }
    }
  }
</script>