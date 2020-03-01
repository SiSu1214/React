<template>
  <ve-histogram
    :colors="colors"
    :ref="ref"
    :theme="theme"
    :data="data"
    :extend="extend"
    :height="height"
  />
</template>

<script>
import VeHistogram from 'v-charts/lib/histogram';
import theme from '~/assets/chart/theme';
import colors from '~/assets/chart/colors';

const ref = 'chart' + new Date().getTime();

export default {
  name: 'ChartHistogram',
  components: { VeHistogram },
  props: {
    data: {
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
      colors,
      extend: {
        grid: { top: 15, bottom: 0 },
        'yAxis.0.axisLabel.formatter': value => value / 1000 + 'k',
        stack: { sales: ['cost', 'profit'] },
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
