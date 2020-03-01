<template>
  <div class="layout">
    <SplashScreen></SplashScreen>
    <div class="bg-login" />
    <!--<BackgroundAnimation />-->
    <nuxt />
  </div>
</template>

<script>
// import BackgroundAnimation from '~/components/BackgroundAnimation'
import SplashScreen from '~/components/SplashScreen';

export default {
  components: {
    // BackgroundAnimation
    SplashScreen,
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
};
</script>

<!--<style></style>-->

<style scoped>
.layout {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

.bg-login {
  background: url('/images/login-bg.png');
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
}
</style>
