import { fork, all, put } from 'redux-saga/effects';
import * as RNLocalize from 'react-native-localize';
import I18n from 'i18n-js';
import DeviceStorage from './utils/DeviceStorage';
import { addToCounter, setLanguage } from './actions';

export function* getAllProducts() {
  yield put(addToCounter());
}

export function* setAppLanguage() {
  // console.log(I18n.locale) vi-VN
  const deviceLocale = 'en-US';
  let languageSaved = yield DeviceStorage.get('language');
  try {
    if (deviceLocale !== languageSaved) {
      if (!languageSaved) {
        // if not found, then get the device language
        languageSaved = deviceLocale;
      }
      if (languageSaved !== 'en-US') {
        I18n.locale = languageSaved;
      } else {
        const locales = RNLocalize.getLocales();

        if (Array.isArray(locales)) {
          I18n.locale = locales[0].languageTag;
        }
      }
    }
    I18n.locale = languageSaved;
  } catch (error) {
    console.warn(
      'did not find saved language, it will just proceed with deviceLocale',
    );
  }
  yield put(setLanguage(languageSaved));
}

export default function* root() {
  yield all([fork(getAllProducts), fork(setAppLanguage)]);
}
