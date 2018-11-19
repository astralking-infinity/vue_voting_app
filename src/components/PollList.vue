<template>
  <div v-if="!isLoaded" class="text-center">
    <div v-if="errors && ('detail' in errors)">
      <div v-if="!Array.isArray(errors.detail)">
        {{ errors.detail }}
      </div>
      <div v-else>
        <div v-for="(error, idx) in errors.detail"
            :key="idx">
          {{ error }}
        </div>
      </div>
    </div>
    <div v-else>{{ placeholder }}
      <font-awesome-icon icon="circle-notch"></font-awesome-icon>
    </div>
  </div>

  <div class="row justify-content-center" v-else>
    <div class="col-lg-8 col-md-10 col-sm-12">
      <div class="list-group">
        <router-link v-for="(poll, index) in polls"
                     :to="{ name: 'poll-detail', params: { pollId: poll.id } }"
                     :key="`polls-${index}`"
                     class="list-group-item list-group-item-action list-group-item-primary text-center text-truncate">
          {{ poll.question }}
        </router-link>
      </div>
      <!-- Pagination area -->
    </div>
  </div>
</template>

<script>
  import { endpoints } from './config.js'

  export default {
    name: 'pollList',
    data() {
      return {
        polls: [],
        isLoaded: false,
        placeholder: 'Loading...',
        errors: null
      }
    },
    mounted() {
      fetch(endpoints.poll_list())
        .then(response => {
          if (!response.ok) {
            throw response.json();
          }
          return response.json();
        })
        .then(polls => {
          this.polls = polls
          this.isLoaded = true
        })
        .catch(errorData => {
          if (errorData instanceof Promise) {
            errorData.then(errors => this.errors = errors );
          } else {
            this.errors = {
              detail: [errorData.message]
            }
          }
        });
    }
  }
</script>