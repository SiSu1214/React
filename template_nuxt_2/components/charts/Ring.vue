<template>
  <div>
    <ve-ring
      :ref="ref"
      :colors="colors"
      :theme="theme"
      :data="data"
      :extend="extend"
      :height="height"
    />
    <a
      v-for="(item, index) in data.rows"
      :key="index"
      @click="legendToggleSelect($refs[ref].echarts, item[data.columns[0]])"
    >
      <a-row
        type="flex"
        justify="space-between"
        :class="[
          'legend-' + classes[index % classes.length],
          { 'mb-1p': index !== data.rows.length - 1 },
        ]"
      >
        <a-col><a-icon type="pie-chart" /> {{ item[data.columns[0]] }}</a-col>
        <a-col>
          <a-button size="small">
            {{
              parseFloat(
                (parseInt(item[data.columns[1]]) / total) * 100,
              ).toFixed(1)
            }}%
          </a-button>
        </a-col>
      </a-row>
    </a>
  </div>
</template>

<script>
import VeRing from 'v-charts/lib/ring';
import theme from '~/assets/chart/theme';
import colors from '~/assets/chart/colors';
import classes from '~/assets/chart/classes';

const ref = 'chart' + new Date().getTime();
const map = require('lodash/map');

export default {
  name: 'ChartRing',
  components: { VeRing },
  props: {
    data: {
      type: Object,
      required: true,
    },
    height: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      ref,
      colors,
      classes,
      theme,
      extend: {
        legend: { show: false },
        'series.0.center': ['50%', '45%'],
      },
      total: 0,
    };
  },
  mounted() {
    let total = 0;
    map(this.data.rows, item => {
      total += parseInt(item[this.data.columns[1]], 10);
    });
    this.total = total;
    setTimeout(() => {
      this.$refs[this.ref].resize();
    }, 50);
  },
  methods: {
    legendToggleSelect(echart, name) {
      echart.dispatchAction({ type: 'legendToggleSelect', name });
    },
  },
};
</script>

<style scoped></style>
