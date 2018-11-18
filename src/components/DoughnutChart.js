import { Doughnut, mixins } from 'vue-chartjs'

const { reactiveProp } = mixins

const defaultOptions = {
  animation: {
    animateScale: true,
    duration: 500,
    easing: 'linear'
  },
  legend: {
    display: false
  }
}

export default {
  extends: Doughnut,
  mixins: [reactiveProp],
  props: {
    redraw: Boolean,
    options: Object
  },
  mounted() {
    this.addPlugin({
      id: 'placeholder-text',
      afterDraw: function (chart) {
        var votes = chart.data.datasets[0].data

        var nonzeroVotes = votes.filter(vote => vote > 0)
        if (nonzeroVotes.length === 0) {
          var ctx = chart.chart.ctx
          var width = chart.chart.width
          var height = chart.chart.height
          chart.clear()

          ctx.save()
          ctx.textAlign = 'center'
          ctx.fillStyle = '#000'
          ctx.fillText('No data to display', width / 2, height / 2)
          ctx.restore()
        }
      }
    })
    this.renderDoughnutChart()
  },
  methods: {
    renderDoughnutChart: function () {
      this.renderChart(this.chartData, this.options || defaultOptions)
    }
  },
  watch: {
    chartData: function () {
      if (this.redraw) {
        this.$data._chart.destroy()
        this.renderDoughnutChart()
      }
    }
  }
}