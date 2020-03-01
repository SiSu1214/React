export default {
  legend: { show: false },
  grid: {
    containLabel: true,
    left: 0,
    right: 0,
  },
  tooltip: {
    textStyle: {
      fontFamily: '"Comfortaa", cursive',
    },
  },
  valueAxis: {
    axisLine: {
      lineStyle: {
        color: '#e5e7ec',
        type: 'dashed',
      },
    },
    axisLabel: {
      color: '#959aaf',
      fontFamily: '"Comfortaa", cursive',
      fontSize: 15,
    },
    splitLine: {
      lineStyle: {
        color: '#e5e7ec',
        type: 'dashed',
      },
    },
  },
  categoryAxis: {
    axisLine: { show: false },
    axisLabel: {
      color: '#959aaf',
      fontFamily: '"Comfortaa", cursive',
      fontSize: 15,
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: '#e5e7ec',
        type: 'dashed',
      },
    },
    axisTick: { show: false },
  },
  line: {
    smooth: true,
    smoothMonotone: 'x',
    area: true,
    itemStyle: { borderWidth: 6 },
    lineStyle: { width: 4 },
    areaStyle: { opacity: 0.1 },
  },
  pie: {
    label: { fontFamily: '"Comfortaa", cursive' },
    labelLine: {
      fontFamily: '"Comfortaa", cursive',
      smooth: 0.2,
      length: 10,
      length2: 20,
    },
  },
  bar: { barWidth: 10 },
};
