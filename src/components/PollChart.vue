<template>
  <div class="chart-container">
    <DoughnutChart v-if="loaded"
                   :chartData="datacollection"
                   :options="options" />
  </div>
</template>

<script>
  import DoughnutChart from './DoughnutChart.js'

  export default {
    name: 'pollChart',
    components: { DoughnutChart },
    props: {
      poll: Object
    },
    data() {
      return {
        loaded: false,
        datacollection: [],
        options: null
      }
    },
    mounted() {
      this.fillData()
    },
    methods: {
      fillData() {
        let choices = this.poll.choices
        let choices_labels = choices.map(choice => choice.choice_text)
        let choices_votes = choices.map(choice => choice.votes.length)
        this.datacollection = {
          labels: choices_labels,
          datasets: [{
            data: choices_votes
          }]
        }

        // choices.forEach(choice => {
        //   this.datacollection.push({
        //     value: choice.votes.length,
        //     label: choice.choice_text
        //   })
        // })
        // console.log(this.datacollection)
        this.loaded = true
      }
    }
  }
</script>
