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
    this.renderChart(this.chartData, this.options || defaultOptions)
  }
}