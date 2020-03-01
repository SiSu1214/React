/* global translate */

export default (value, values, form, key) => {
  let error = null;
  if (form && form.initialValid && form.initialValid[key]) {
    const { required, isEmail, minLength, confirmation } = form.initialValid[
      key
    ];
    if (!error && values && confirmation) {
      values.map((item, index) => {
        if (index === confirmation && value !== item) {
          error = translate('confirmation');
        }
        return false;
      });
    }
    if (required && !value && !error) {
      error = translate('required');
    }
    if (!error && minLength && value && value.length < minLength) {
      error = `${translate('minLength')} ${minLength} ${translate(
        'characters',
      )}`;
    }
    if (!error && value && isEmail) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(String(value).toLowerCase())) {
        error = translate('isEmail');
      }
    }
  }
  return error;
};
