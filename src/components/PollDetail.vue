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

  <div class="jumbotron" v-else>
    <div class="row justify-content-center">
      <div id="pollDetail" class="col-lg-4 col-md-6 col-sm-12 py-2">
        <div class="bg-light p-2 mb-5 rounded">{{ poll.question }}</div>
        <div v-if="isAuthenticated">
          <div v-if="voted.hasVoted">
            You voted for...
            <div class="styled-radio">
              <div class="styled-radio-success">
                <input :id="voted.choice.id"
                       type="radio"
                       name="choices"
                       checked
                       readonly />
                <label :for="voted.choice.id">
                  {{ voted.choice.choice_text }}
                </label>
              </div>
            </div>
          </div>
          <form v-on:submit="handleSubmitVote" method="post" v-else>
            <div class="styled-radio">
              <div v-for="(choice, idx) in poll.choices"
                   :key="idx"
                   class="styled-radio-success">
                <input :id="`choice-id-${choice.id}`"
                       type="radio"
                       name="choices"
                       :value="choice"
                       v-model="choiceSelected" />
                <label :for="`choice-id-${choice.id}`">
                  {{ choice.choice_text }}
                </label>
              </div>
            </div>
            <div>
              <button type="submit"
                      class="btn btn-primary btn-block">
                Vote
              </button>
            </div>
          </form>
        </div>
        <div v-else>
          <p>You need to
            &nbsp;
            <router-link to="/login" class="">Log in</router-link>
            &nbsp;
            or
            &nbsp;
            <router-link to="/signup" class="">Sign up</router-link>
            &nbsp;
            to vote.
          </p>
        </div>
      </div>
      <div class="col-lg-8 col-md-6 col-sm-12 py-2">
        <PollChart :poll="poll" ref="pollChart" />
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  import PollChart from './PollChart.vue'
  import { endpoints } from './config.js'

  export default {
    name: 'pollDetail',
    components: { PollChart },
    data() {
      return {
        poll: null,
        isLoaded: false,
        placeholder: 'Loading...',
        errors: null,
        voted: {
          hasVoted: false,
          choice: null
        },
        choiceSelected: null
      }
    },
    mounted() {
      const { pollId } = this.$route.params
      fetch(endpoints.poll_detail(pollId))
        .then(response => {
          if (!response.ok) {
            throw response.json()
          }
          return response.json()
        })
        .then(poll => {
          this.poll = poll
          this.isLoaded = true
        })
        .catch(errorData => {
          if (errorData instanceof Promise) {
            errorData.then(errors => this.errors = errors)
          } else {
            this.errors = {
                detail: [errorData.message]
            }
          }
        })
    },
    updated() {
      this.$nextTick(function () {
        this.checkUserHasVoted
      })
    },
    methods: {
      handleSubmitVote(e) {
        e.preventDefault()
        const { poll,
                choiceSelected,
                isAuthenticated,
                user,
                token } = this

        if (!choiceSelected) {
          alert('Please select an item you want to vote from the list.')
          return false
        }

        if (!isAuthenticated) {
          alert('Unauthorized')
          return false
        }

        const data = {
          voted_by: user.pk
        }
        const conf = {
          method: 'post',
          body: JSON.stringify(data),
          headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
          })
        }
        fetch(endpoints.vote(poll.id, choiceSelected.id), conf)
          .then(response => {
            if (!response.ok) {
              throw new Error(response.statusText)
            }
            return response.json()
          })
          .then(vote => {
            poll.choices.forEach((choice) => {
              if (choice.id === vote.choice) choice.votes.push(vote)
            })
            this.poll = poll
            this.voted = {
                hasVoted: true,
                choice: choiceSelected
            }
          })
          .catch(error => console.log(error.message))
      }
    },
    computed: {
      ...mapGetters(['isAuthenticated', 'user', 'token']),
      checkUserHasVoted: function () {
        if (this.isAuthenticated) {
          const { poll, user } = this
          poll.choices.forEach(choice => {
            const voted = choice.votes.find(vote => user && vote.voted_by == user.pk)
            // console.log(voted)  // Needs some handling for guest votes also
            if (voted) {
              this.voted = {
                hasVoted: true,
                choice: choice
              }
              return true
            }
          })
        }
        return false
      }
    },
    watch: {
      voted: function () {
        this.$refs.pollChart.fillData()
      },
    }
  }
</script>