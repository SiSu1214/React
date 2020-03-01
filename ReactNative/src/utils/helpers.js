import I18n from 'i18n-js';
import startCase from 'lodash/startCase';
import en from '../translations/en';
import vi from '../translations/vi';

I18n.fallbacks = true;
I18n.translations = {
  en,
  vi,
};

export const translate = value => {
  if (!value) return value;
  const label = I18n.t(`${value}`);
  if (label.indexOf('[missing') === 0) {
    return startCase(value);
  }
  return label;
};
