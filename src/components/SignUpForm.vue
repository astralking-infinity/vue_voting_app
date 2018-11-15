<template>
  <span v-if="isAuthenticated">
    {{ this.$router.push({ name: 'home' }) }}
  </span>
  <div class="container" v-else>
    <div class="row justify-content-center">
      <div class="col-lg-8 col-md-10 col-sm-12 py-3">
        <div class="card">
          <div class="card-header text-center">
            <h2>
              <router-link to="/" class="card-link">Voting App</router-link>
            </h2>
          </div>
          <div class="card-body">
            <h3 class="card-title">Sign up</h3>
            <form v-on:submit="handleCreateAccount"
                  method="post">
              <div class="alert alert-danger" role="alert"
                   v-if="errors && ('non_field_errors' in errors)">
                {{ errors.non_field_errors }}
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
              <!--
              Email verification not implemented on the backend yet
              <div class="form-group">
                <label for="email">Email:</label>
                <input id="email"
                       type="email"
                       name="email"
                       v-model="email"
                       class="form-control"
                       :class="{'is-invalid': errors && ('email' in errors)}"
                       autoComplete="email" />
                <div v-if="errors && ('email' in errors)"
                     class="invalid-feedback">
                  <div v-for="(error, idx) in errors.email"
                       :key="idx">
                    {{ error }}
                  </div>
                </div>
              </div>
               -->
              <div class="form-group">
                <label for="password1">Password:</label>
                <input id="password1"
                       type="password"
                       name="password1"
                       v-model="password1"
                       class="form-control"
                       :class="{'is-invalid': errors && ('password1' in errors)}"
                       autoComplete="off"
                       required />
                <div v-if="errors && ('password1' in errors)"
                     class="invalid-feedback">
                  <div v-for="(error, idx) in errors.password1"
                       :key="idx">
                    {{ error }}
                  </div>
                </div>
              </div>
              <div class="form-group">
                <label for="password2">Confirm password:</label>
                <input id="password2"
                       type="password"
                       name="password2"
                       v-model="password2"
                       class="form-control"
                       :class="{'is-invalid': errors && ('password2' in errors)}"
                       autoComplete="off"
                       required />
                <div v-if="errors && ('password2' in errors)"
                     class="invalid-feedback">
                  <div v-for="(error, idx) in errors.password2"
                       :key="idx">
                    {{ error }}
                  </div>
                </div>
              </div>
              <button type="submit" class="btn btn-primary">
                Create an account
              </button>
            </form>
          </div>
          <div class="card-footer text-center text-muted">
            Already have an account? <router-link to="/login">Log in
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { endpoints } from './config.js'

  export default {
    name: 'signUpForm',
    props: {
      isAuthenticated: Boolean,
      loggedInCallback: Function
    },
    data () {
      return {
        username: '',
        email: undefined,
        password1: '',
        password2: '',
        errors: null
      }
    },
    methods: {
      handleCreateAccount(e) {
        e.preventDefault()
        const { username, email, password1, password2 } = this
        const signupAuth = { username, email, password1, password2 }

        const conf = {
          method: 'post',
          body: JSON.stringify(signupAuth),
          headers: new Headers({ 'Content-Type': 'application/json' })
        }

        fetch(endpoints.registration(), conf)
          .then(response => {
            if (!response.ok) {
              throw response.json()
            }
            return response.json()
          })
          .then(successData => {
            if ('key' in successData) {
              // this.loggedInCallback(successData.key)
              console.log(successData)
            } else {
              console.log('Something went wrong:')
              console.log(successData);
            }
          })
          .catch(errorData => {
            if (errorData instanceof Promise) {
              errorData.then(errors => {
                this.errors = errors
              })
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