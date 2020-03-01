const dateTimeFormats = require('./dateTimeFormats');
module.exports = {
  locales: [
    {
      code: 'en',
      iso: 'en-US',
      name: 'english',
      file: 'en.json',
    },
    {
      code: 'vi',
      iso: 'vi-VN',
      name: 'vietnam',
      file: 'vi.json',
    },
  ],
  defaultLocale: 'en',
  seo: false,
  lazy: true,
  detectBrowserLanguage: {
    cookieKey: 'redirected',
    useCookie: true,
  },
  langDir: 'assets/locales/lang/',
  parsePages: false,
  pages: {
    user: {
      en: '/user',
      vi: '/ueber-uns',
    },
  },
  vueI18n: {
    dateTimeFormats,
    fallbackLocale: 'en',
  },
};
