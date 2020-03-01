/* eslint-disable */
const pkg = require('./package');
const locales = require('./assets/locales');
const constant = require('./constant');

// http://xpanthersolutions.com/html/neon/html/vertical/index.html
module.exports = {
  mode: 'universal',
  dev: process.env.NODE_ENV !== 'production',
  /*
   ** Headers of the page
   */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description },
    ],
    link: [
      { rel: 'icon', type: 'images/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        type: 'text/css',
        href: 'https://fonts.googleapis.com/css?family=Comfortaa:300,400,700',
      },
    ],
    script: [
      {
        type: 'text/javascript',
        src: '//code.jquery.com/jquery-3.4.1.min.js',
      },
      { src: '//apis.google.com/js/platform.js', type: 'text/javascript' },
    ],
  },

  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: '#43A047',
    height: '2px',
    continuous: true,
  },

  /*
   ** Global CSS
   */
  css: [
    'ant-design-vue/lib/style/core/index.less',
    'ant-design-vue/lib/style/components.less',
    '~assets/style/main.less',
    '~assets/style/frontend.less',
  ],

  pageTransition: {
    name: 'fade',
    mode: 'out-in',
  },

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~/plugins/antd-ui',
    { src: '~/plugins/socket.js', ssr: true },
    { src: '~/plugins/moment.js', ssr: true },
  ],

  /*
   ** Nuxt.js modules
   */
  modules: ['@nuxtjs/axios', ['nuxt-i18n', locales], '@nuxtjs/pwa'],

  /*
   ** Axios module configuration
   */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    baseURL: constant.base_url,
  },

  // API middleware
  serverMiddleware: ['~/server/api/auth_session.js'],

  /**
   * Routing middleware
   */
  router: {
    linkActiveClass: 'active',
    middleware: ['auth'],
  },

  //
  env: {
    baseUrl: constant.base_url,
  },

  // config domain and port
  server: {
    host: constant.domain,
    port: constant.port,
  },

  /*
   ** Build configuration
   */
  build: {
    maxChunkSize: 400000,
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      // Ant Design
      ctx.loaders.less.javascriptEnabled = true;
      ctx.loaders.less.modifyVars = {
        'font-family': '"Comfortaa", cursive',
        'primary-color': '#4c7cf3',
        'layout-header-background': '#4c7cf3',
        'border-color-base': '#f0f1f4',
        'input-bg': '#f0f1f4',
        'checkbox-check-color': '#f0f1f4',
        'layout-body-background': '#f0f4f9',
        'btn-default-bg': '#e1e4e9',
        'btn-default-border': '#e1e4e9',
        'input-placeholder-color': '#6c757d',
        'text-color': '#8a98ac',
        'label-color': '#8a98ac',
        'heading-color': '#2B343A',
        'btn-danger-color': '#fff',
        'btn-danger-bg': '#ff4b5b',
        'btn-danger-border': '#ff4b5b',
        'line-height-base': '1.6',
        'card-head-padding': '12px',
        'font-size-base': '15px',
        'card-radius': '15px',
        'badge-height': '15px',
        'list-item-meta-avatar-margin-right': '15px',
        'layout-header-padding': '0 15px',
        'padding-md': '19px',
        'card-padding-wider': '24px',
        'padding-lg-md': '26px',
        'btn-height-base': '38px',
        'input-height-base': '38px',
        'btn-height-lg': '45px',
        'input-height-lg': '45px',
      };

      if (ctx.isDev && ctx.isClient) {
        const StyleLintPlugin = require('stylelint-webpack-plugin');
        // Stylelint
        config.plugins.push(
          new StyleLintPlugin({
            files: '/assets/style/*.less',
            syntax: 'less',
          }),
        );

        // Run ESLint on save
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
          options: {
            fix: true,
          },
        });
      }
    },
  },
};
