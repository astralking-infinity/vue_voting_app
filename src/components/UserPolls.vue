<template>
  <div v-if="!isLoaded" class="text-center">
    <div v-if="errors && ('detail' in errors)">
      <div v-for="(error, idx) in errors.detail"
          :key="idx">
        {{ error }}
      </div>
    </div>
    <span v-else>{{ placeholder }}
      <font-awesome-icon icon="circle-notch"></font-awesome-icon>
    </span>
  </div>

  <div v-else>
    <NewPollForm v-if="toggleModal"
                 @closeCallback="handleClosePollModal"
                 @createPollCallback="handleCreatePoll" />

    <div class="container">
      <h1 class="text-center">{{ $route.params.username }}</h1>
    </div>
    <div class="row">
      <aside class="col-md-4">
        <div class="container border">
          <div class="border-bottom my-2 pb-2">
            <!-- Modal trigger -->
            <button class="btn btn-success btn-sm float-right"
                    @click="handleOpenPollModal">New</button>
            <h6>Polls</h6>
          </div>
          <div class="sidenav-item my-2">
            <div class="nav nav-pills flex-column" role="tablist" aria-orientation="vertical">
              <router-link v-for="(poll, idx) in userPolls"
                           class="nav-link text-truncate"
                           :class="{'active': selectedPoll && selectedPoll.id === poll.id}"
                           :key="`user-polls-${idx}`"
                           @click.native="handleShowDetail(poll)"
                           to="">
                {{ poll.question }}
              </router-link>
            </div>
          </div>
        </div>
      </aside>
      <section class="col-md-8">
        <div v-if="selectedPoll">
          <div class="border-bottom my-4 pb-2">
            <button class="btn btn-danger btn-sm float-right"
                    @click="handleDeletePoll(selectedPoll)">
              Delete</button>
            <h5 class="">{{ selectedPoll.question }}</h5>
          </div>
          <PollChart :poll="selectedPoll" :redraw="true" />
        </div>
        <p v-else class="text-center pt-2">Select a poll to view result</p>
      </section>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  import PollChart from './PollChart.vue'
  import NewPollForm from './NewPollForm.vue'
  import { endpoints } from './config.js'

  export default {
    name: 'userPolls',
    components: { PollChart, NewPollForm },
    data() {
      return {
        userPolls: null,
        isLoaded: false,
        placeholder: 'Loading...',
        errors: null,
        selectedPoll: null,
        toggleModal: false
      }
    },
    created() {
      if (!this.token) {
        this.$router.push({ name: 'home' })
      }
    },
    mounted() {
      const { token } = this
      const { username } = this.$route.params

      if (!this.token) {
        return null
      }

      const conf = {
        method: 'get',
        headers: new Headers({
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        })
      }

      fetch(endpoints.user_poll_list(username), conf)
        .then(response => {
          if (!response.ok) {
            throw response.json()
          }
          return response.json()
        })
        .then(userPolls => {
          this.userPolls = userPolls
          this.isLoaded = true
        })
        .catch(errorData => {
          if (errorData instanceof Promise) {
            errorData.then(errors => {
              this.errors = errors })
          } else {
            this.errors = {
                detail: [errorData.message]
            }
          }
        })
    },
    methods: {
      handleCreatePoll(question, choices) {
        const { user, token } = this

        // Don't proceed when poll's choices is less than 2
        if (choices.length - 1 < 2) {
          alert('Choices must be more than 2.')
          return null
        }

        const pollData = { question, created_by: user.pk }
        const pollConf = {
          method: 'post',
          body: JSON.stringify(pollData),
          headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
          })
        }

        fetch(endpoints.poll_list(), pollConf)
          .then(response => {
            if (!response.ok) {
              throw response.json()
            }
            return response.json()
          })
          .then(poll => {
            this.postPollChoices(token, poll, choices)
            this.handleClosePollModal()
          })
          .catch(errorData => {
            errorData.then(errors => this.setState({ errors }))
          })
      },
      handleDeletePoll(poll) {
        var ret = window.confirm('Are you sure you want to deleted this?')
        if (!ret) return null
        const { token } = this
        const deleteConf = {
          method: 'delete',
          headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
          })
        }
        fetch(endpoints.poll_detail(poll.id), deleteConf)
          .then(response => {
            if (response.ok) {
              const { userPolls } = this
              const newUserPolls = userPolls.filter((userPoll) => userPoll.id !== poll.id)
              this.userPolls = newUserPolls,
              this.selectedPoll = null
            }
          })
      },
      handleShowDetail(poll) {
        this.selectedPoll = poll
      },
      handleOpenPollModal() {
        this.toggleModal = true
      },
      handleClosePollModal() {
        this.toggleModal = false
      },
      postPollChoices(token, poll, choices) {
        const { userPolls } = this

        choices.forEach((choiceItem) => {
          if (choiceItem.choice_text) {
            const choice = {
              poll: poll.id,
              choice_text: choiceItem.choice_text
            }

            const choiceConf = {
              method: 'post',
              body: JSON.stringify(choice),
              headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
              })
            }

            fetch(endpoints.choice_list(poll.id), choiceConf)
              .then(response => {
                if (!response.ok) {
                  throw response.json()
                }
                return response.json()
              })
              .then(choiceData => {
                var found = false
                userPolls.forEach((pollItem) => {
                  if (pollItem.id === poll.id) {
                    pollItem.choices.push(choiceData)
                    found = true
                  }
                })
                if (!found) {
                  userPolls.reverse()  // Need to change this so new poll will be added at the beginning of the list.
                  userPolls.push(poll)
                  userPolls.reverse()
                }
                this.userPolls = userPolls
              })
              .catch(errorData => {
                if (errorData instanceof Promise) {
                  errorData.then(errors => this.errors = errors)
                } else {
                  this.placeholder = errorData.message
                }
              })
          }
        })
      }
    },
    computed: {
      ...mapGetters(['user', 'token'])
    }
  }
</script>