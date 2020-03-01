<template>
  <a-layout>
    <SplashScreen />
    <SiderMenu :collapsed="collapsed" :list-menu="listMenu" />
    <a-layout>
      <Header :collapsed.sync="collapsed"></Header>
      <a-layout-content>
        <nuxt />
      </a-layout-content>
      <a-layout-footer>{{ $t('dashboard.antDesign') }}</a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script>
import SiderMenu from '~/components/SiderMenu.vue';
import Header from '~/components/Header.vue';
import listMenu from '~/assets/menus';
import Socket from '~/plugins/socket';
import SplashScreen from '~/components/SplashScreen';

export default {
  name: 'Default',
  components: {
    SiderMenu,
    Header,
    SplashScreen,
  },
  data() {
    return {
      collapsed: false,
      listMenu,
    };
  },
  mounted() {
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
  beforeCreate() {
    if (!this.$socket && this.$store.state.app.isAuth) {
      Socket.connect(
        this.$store.state.app.token,
        this.$store.state.app.channel,
      );
    }
  },
  // watch: {
  //   collapsed(val) {
  //     console.log('collapsed', val)
  //   }
  // }
};
</script>

<style></style>
