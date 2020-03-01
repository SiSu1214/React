<template>
  <section class="container">
    <div>
      <logo />
      <h2 class="subtitle">
        {{ $t('index.subtitle') }}
      </h2>
    </div>
  </section>
</template>

<script>
import Logo from '~/components/Logo.vue';
export default {
  layout: 'single',
  components: { Logo },
  mounted() {},
  methods: {},
  head() {
    return {
      title: 'Template Nuxt 2',
    };
  },
};
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}
</style>
