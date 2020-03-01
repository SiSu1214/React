<template>
  <a-layout class="layout">
    <SplashScreen />
    <a-layout-header class="header" :style="{}">
      <div class="top-nav">
        <a-button @click="getUserInfo">{{ $t('topNav.infoUser') }}</a-button>
        <div class="fr">
          <a-button
            v-for="(locale, index) in otherLocales"
            :key="index"
            @click="switchLanguage(locale.code)"
          >
            {{ $t('header.' + locale.name) }}
          </a-button>
          <a-button @click="() => $router.push(localePath('login'))">{{
            $t('login.login')
          }}</a-button>
        </div>
      </div>
    </a-layout-header>
    <a-layout-content :style="{ padding: '0 16px 16px' }" class="min-height">
      <nuxt />
    </a-layout-content>
  </a-layout>
</template>

<script>
import SplashScreen from '~/components/SplashScreen';

export default {
  name: 'Single',
  components: { SplashScreen },
  computed: {
    otherLocales() {
      return this.$i18n.locales.filter(
        ({ code }) => code !== this.$i18n.locale,
      );
    },
  },
  mounted() {
    document.getElementsByTagName('html')[0].classList.add('frontend');
    if (window.onload === null) {
      window.onload = function() {
        document.body.style.overflow = 'auto';
        document.getElementById('splash-screen').remove();
      };
    } else {
      document.body.style.overflow = 'auto';
      document.getElementById('splash-screen').remove();
    }
  },
  destroyed() {
    document.getElementsByTagName('html')[0].classList.remove('frontend');
  },
  methods: {
    getUserInfo() {
      this.$axios({
        url: '/api/auth/user',
        method: 'get',
      })
        .then(res => {
          // console.log(res)
        })
        .catch(e => {
          this.$message.error(e.message);
        });
    },
    switchLanguage(code) {
      this.$router.push(this.switchLocalePath(code));
    },
  },
};
</script>

<style scoped>
.min-height {
  min-height: calc(100vh - 64px);
}
.header {
  background: #fff;
  boxshadow: 0 2px 3px 2px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid #eee;
}
.layout {
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
}
.fr {
  float: right;
  vertical-align: middle;
}
</style>
