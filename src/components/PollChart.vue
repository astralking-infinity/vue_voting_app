<template>
  <div class="fragment">
    <div class="chart-container">
      <DoughnutChart v-if="loaded"
                     ref="chart"
                     :chartData="datacollection"
                     :options="options"
                     :redraw="redraw" />
    </div>
    <div id="legend"
         class="legend-container"
         v-html="legendMarkup" >
    </div>
  </div>
</template>

<script>
  import DoughnutChart from './DoughnutChart.js'
  import palette from 'google-palette'

  export default {
    name: 'pollChart',
    components: { DoughnutChart },
    props: {
      poll: Object,
      redraw: Boolean
    },
    data() {
      return {
        loaded: false,
        datacollection: null,
        options: null,
        legendMarkup: null
      }
    },
    updated() {
      this.$nextTick(function () {
        if (this.loaded) {
          this.legendMarkup = this.$refs.chart.generateLegend()
        }
      })
    },
    mounted() {
      this.fillData()
    },
    methods: {
      fillData() {
        let choices = this.poll.choices
        let choices_labels = choices.map(choice => choice.choice_text)
        let choices_votes = choices.map(choice => choice.votes.length)
        let choices_length = choices_labels.length
        this.datacollection = {
          labels: choices_labels,
          datasets: [{
            data: choices_votes,
            backgroundColor: palette('tol', choices_length).map((hex) => '#' + hex)
          }]
        }
        this.loaded = true
      }
    },
    watch: {
      poll: function () {
        this.fillData()
      }
    }
  }
</script>

<style scope>
  span {
    display: inline-block;
    width: 24px;
    height: 24px;
    margin-right: 5px;
  }
</style>