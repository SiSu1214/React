<template>
  <ve-line
    :ref="ref"
    :colors="colors"
    :theme="theme"
    :data="data"
    :extend="extend"
    :height="height"
  />
</template>

<script>
import VeLine from 'v-charts/lib/line';
import theme from '~/assets/chart/theme';
import colors from '~/assets/chart/colors';

const ref = 'chart' + new Date().getTime();

export default {
  name: 'ChartLine',
  components: { VeLine },
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
        xAxis: {
          boundaryGap: false,
          axisLine: { show: false },
        },
        yAxis: { axisLine: { show: false } },
        grid: { right: 15, top: 15, bottom: 0 },
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
