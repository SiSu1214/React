<template>
  <nuxt-link :to="localePath(linkLogo)" class="margin-vertical">
    <img
      :src="'/images/logo' + (collapsed ? '' : '-text') + '.svg'"
      :height="logoHeight"
      alt="logo"
    />
  </nuxt-link>
</template>

<script>
export default {
  props: {
    logoHeight: {
      type: Number,
      default: 60,
    },
    linkLogo: {
      type: String,
      default: 'index',
    },
    collapsed: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style></style>
