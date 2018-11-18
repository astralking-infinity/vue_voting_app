<template>
  <div class="modal fade show" id="createPollModal" tabIndex="-1" role="dialog">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <form @submit.prevent="handleCreatePoll" method="post">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalCenterTitle">Create poll</h5>
            <button type="button"
                    class="close"
                    aria-label="Close"
                    @click="handleCloseModal">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <input type="text"
                     class="form-control"
                     v-model="question"
                     placeholder="Enter question"
                     autocomplete="off"
                     required />
            </div>
            <label class="form-label">Choices</label>
            <div class="form-group row"
                 v-for="(choice, idx) in choices"
                 :key="`choice-id-${idx}`">
              <div class="col-10">
                <input type="text"
                       class="form-control"
                       @input="handleChoiceInput(idx, $event)"
                       :value="choice.choice_text"
                       placeholder="Enter choice"
                       autocomplete="off" />
              </div>
              <div v-if="choices.length - 2 >= idx">
                <button type="button"
                        class="btn btn-secondary"
                        @click="handleRemoveChoice(idx)">
                  <font-awesome-icon icon="minus" />
                </button>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button"
                    class="btn btn-secondary"
                    @click="handleCloseModal">Cancel</button>
            <button type="submit"
                    class="btn btn-primary">Submit</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'createPoll',
    data() {
      return {
        question: '',
        choices: [{ choice_text: '' }]
      }
    },
    methods: {
      handleChoiceInput(idx, event) {
        const { choices } = this
        var addNew = false
        const newChoices = choices.map((choice, cidx) => {
          if (idx !== cidx) {
            return choice
          }
          if (cidx === choices.length - 1) addNew = true
          return { ...choice, choice_text: event.target.value }
        })

        if (addNew) {
          newChoices.push({choice_text: ''})
        }
        this.choices = newChoices
      },
      handleRemoveChoice(idx) {
        const filteredChoices = this.choices.filter((c, cidx) => idx !== cidx)
        this.choices = filteredChoices
      },
      handleCreatePoll() {
        const { question, choices } = this
        this.$emit('createPollCallback', question, choices)
      },
      handleCloseModal() {
        this.$emit('closeCallback')
      }
    }
  }
</script>

<style scoped>
  .modal {
    display: block !important;
    overflow-x: hidden !important;
    overflow-y: auto !important;
  }
</style>