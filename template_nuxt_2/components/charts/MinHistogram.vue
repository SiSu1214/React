<template>
  <chart
    :ref="ref"
    :data="data"
    :theme="theme"
    :settings="settings"
    :extend="extend"
    :height="height"
  />
</template>

<script>
import chart from 'v-charts/lib/histogram';
import echarts from 'echarts/lib/echarts';
import theme from '~/assets/chart/theme';

const ref = 'chart' + new Date().getTime();

export default {
  name: 'ChartMinHistogram',
  components: { chart },
  props: {
    data: {
      type: Object,
      required: true,
    },
    settings: {
      type: Object,
      required: true,
    },
    height: {
      type: String,
      required: true,
    },
    tooltip: {
      type: Object,
      default: () => {
        return { show: false };
      },
    },
  },
  data() {
    return {
      ref,
      theme,
      extend: {
        'xAxis.0.splitLine.show': false,
        'xAxis.0.axisLabel.color': '#fff',
        'xAxis.0.axisLabel.fontSize': 10,
        yAxis: { show: false },
        grid: {
          top: 0,
          bottom: 0,
        },
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(250, 250, 250, 1)',
            },
            {
              offset: 1,
              color: 'rgba(250, 250, 250, 0.3)',
            },
          ]),
          shadowColor: 'rgba(0, 0, 0, 0.1)',
          shadowBlur: 10,
        },
      },
    };
  },
  mounted() {
    if (this.tooltip) {
      this.extend.tooltip = this.tooltip;
    }
    setTimeout(() => {
      this.$refs[this.ref].resize();
    }, 50);
  },
};
</script>

<style scoped></style>
