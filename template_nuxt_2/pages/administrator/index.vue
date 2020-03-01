<template>
  <div>
    <TitlePage :title="$t('dashboard.dashboard')" :list-menu="listMenu" />
    <a-row :gutter="22">
      <a-col :xl="14">
        <a-card hoverable :title="$t('dashboard.weeklyRevenue')" class="mb-2">
          <a-row type="flex" justify="space-around">
            <a-col>
              <div class="text-center">
                <span class="text-black fontsize-16">{{
                  $t('dashboard.weeklyRevenue')
                }}</span>
                <h4 class="text-gradient-primary">78,254</h4>
              </div>
            </a-col>
            <a-col>
              <div class="text-center">
                <span class="text-black fontsize-16">{{
                  $t('dashboard.previousWeek')
                }}</span>
                <h4 class="text-gradient-success">58,605</h4>
              </div>
            </a-col>
          </a-row>
          <chart-line
            :data="dataChartLine"
            height="315px"
            :tooltip="tooltipChart"
          />
        </a-card>
      </a-col>
      <a-col :xl="10">
        <a-card class="card-bg mb-2 bg-gradient-primary">
          <a-row type="flex" justify="space-between">
            <a-col :span="10">
              <a-button shape="circle" icon="hourglass" size="large" />
              <h3 class="text-white">5.3 hrs</h3>
              <div>
                <span>{{ $t('dashboard.avgMembersSessions') }}</span>
              </div>
              <small
                ><strong>+18.68%</strong>
                {{ $t('dashboard.avgMembersSessions') }}
              </small>
            </a-col>
            <a-col :span="14">
              <min-histogram
                :data="dataMinHistogram"
                :settings="settingsMinHistogram"
                height="160px"
              />
            </a-col>
          </a-row>
        </a-card>
        <a-row :gutter="22">
          <a-col :span="12">
            <a-card
              hoverable
              class="card-bg mb-2 bg-gradient-success text-center"
            >
              <a-button shape="circle" icon="trophy" size="large" />
              <h5 class="text-white">
                {{ $t('dashboard.congratulationsAlex') }}
              </h5>
              <p>{{ $t('dashboard.welcomeAboard') }}</p>
              <a-button class="text-success">{{
                $t('dashboard.gotIt')
              }}</a-button>
            </a-card>
          </a-col>
          <a-col :span="12">
            <a-card
              hoverable
              class="card-bg mb-2 bg-gradient-danger text-center"
            >
              <a-button shape="circle" icon="mail" size="large" />
              <h5 class="text-white">
                {{ $t('dashboard.subscribeNewsletter') }}
              </h5>
              <p>{{ $t('dashboard.provideYour') }}</p>
              <a-input :placeholder="$t('login.email')" />
            </a-card>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
    <a-row :gutter="22">
      <a-col :xl="16">
        <a-card hoverable :title="$t('dashboard.revenue')" class="mb-2">
          <a-row type="flex" justify="space-around">
            <a-col>
              <div class="text-center">
                <span class="text-black fontsize-16">{{
                  $t('dashboard.today')
                }}</span>
                <h4 class="text-gradient-primary">8,390</h4>
              </div>
            </a-col>
            <a-col>
              <div class="text-center">
                <span class="text-black fontsize-16">{{
                  $t('dashboard.lastMonth')
                }}</span>
                <h4 class="text-gradient-success">24,420</h4>
              </div>
            </a-col>
            <a-col>
              <div class="text-center">
                <span class="text-black fontsize-16">{{
                  $t('dashboard.lastYear')
                }}</span>
                <h4 class="text-gradient-danger">3,25,780</h4>
              </div>
            </a-col>
          </a-row>
          <histogram
            :data="dataHistogram"
            height="315px"
            :tooltip="tooltipChart"
          />
        </a-card>
      </a-col>
      <a-col :xl="8">
        <a-card
          hoverable
          :title="$t('dashboard.projectResources')"
          class="mb-2"
        >
          <ring :data="dataRing" height="300px" />
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import TitlePage from '~/components/TitlePage.vue';
import ChartLine from '~/components/charts/Line.vue';
import MinHistogram from '~/components/charts/MinHistogram.vue';
import Histogram from '~/components/charts/Histogram.vue';
import Ring from '~/components/charts/Ring.vue';

import listMenu from '~/assets/menus';
const map = require('lodash/map');

export default {
  name: 'Dashboard',
  middleware: 'auth_me',
  components: {
    TitlePage,
    ChartLine,
    MinHistogram,
    Histogram,
    Ring,
  },
  data() {
    return {
      listMenu,
      dataChartLine: {
        columns: ['num', 'balance'],
        rows: [
          { num: this.$t('dashboard.mon'), balance: 4000 },
          { num: this.$t('dashboard.tue'), balance: 3000 },
          { num: this.$t('dashboard.wed'), balance: 5000 },
          { num: this.$t('dashboard.thu'), balance: 3000 },
          { num: this.$t('dashboard.fri'), balance: 1000 },
          { num: this.$t('dashboard.sat'), balance: 3000 },
          { num: this.$t('dashboard.sun'), balance: 6000 },
        ],
      },
      tooltipChart: {
        formatter: params => {
          let string = '';
          const getValue = value => {
            let number = parseInt(value);
            return number >= 1000 ? number / 1000 + 'k' : number;
          };
          map(params, item => {
            string += `<span class="chart-mark" style="background-color: ${
              item.color
            }"></span>${this.$t('dashboard.' + item.seriesName)}: ${
              item.value.length ? getValue(item.value[1]) : getValue(item.value)
            }<br />`;
          });
          return string;
        },
      },
      settingsMinHistogram: {
        metrics: ['cost'],
        dimension: ['date'],
      },
      dataMinHistogram: {
        columns: ['date', 'cost'],
        rows: [
          { cost: 10, date: this.$t('dashboard.mon') },
          { cost: 52, date: this.$t('dashboard.tue') },
          { cost: 200, date: this.$t('dashboard.wed') },
          { cost: 334, date: this.$t('dashboard.thu') },
          { cost: 390, date: this.$t('dashboard.fri') },
          { cost: 330, date: this.$t('dashboard.sat') },
          { cost: 220, date: this.$t('dashboard.sun') },
        ],
      },
      dataHistogram: {
        columns: ['name', 'cost', 'profit'],
        rows: [
          { name: this.$t('dashboard.q1'), cost: 800000, profit: 200000 },
          { name: this.$t('dashboard.q2'), cost: 1200000, profit: 400000 },
          { name: this.$t('dashboard.q3'), cost: 1400000, profit: 500000 },
          { name: this.$t('dashboard.q4'), cost: 1300000, profit: 300000 },
          { name: this.$t('dashboard.q5'), cost: 800000, profit: 200000 },
          { name: this.$t('dashboard.q6'), cost: 1200000, profit: 400000 },
          { name: this.$t('dashboard.q7'), cost: 1400000, profit: 500000 },
          { name: this.$t('dashboard.q8'), cost: 1300000, profit: 300000 },
          { name: this.$t('dashboard.q9'), cost: 800000, profit: 200000 },
          { name: this.$t('dashboard.q10'), cost: 1200000, profit: 400000 },
          { name: this.$t('dashboard.q11'), cost: 1400000, profit: 500000 },
          { name: this.$t('dashboard.q12'), cost: 1300000, profit: 300000 },
        ],
      },
      dataRing: {
        columns: ['name', 'value'],
        rows: [
          { name: this.$t('dashboard.direct'), value: 45 },
          { name: this.$t('dashboard.marketing'), value: 35 },
          { name: this.$t('dashboard.others'), value: 20 },
        ],
      },
    };
  },
  head() {
    return {
      title: 'Template Nuxt 2 - Dashboard',
    };
  },
};
</script>
