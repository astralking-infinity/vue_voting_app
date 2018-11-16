import { Doughnut, mixins } from 'vue-chartjs'

const { reactiveProp } = mixins

const defaultOptions = {
  animation: {
    animateScale: true,
    duration: 500,
    easing: 'linear'
  },
  legend: {
    position: 'bottom'
  }
}

export default {
  extends: Doughnut,
  mixins: [reactiveProp],
  props: {
    options: Object
  },
  mounted() {
    this.renderChart(this.chartData, this.options || defaultOptions)
  }
}