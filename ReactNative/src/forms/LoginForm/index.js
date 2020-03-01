/**
 *
 * LoginForm
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import pick from 'lodash/pick';
import { reduxForm } from 'redux-form/immutable';
import { Form } from 'native-base';

import Group from '../formFields';

import styles from './styles';

// Add your formField in this object
const formFieldsObject = {
  email: {
    label: 'email',
    type: 'textInput',
    icon: 'person',
    autoCapitalize: 'none',
    keyboardType: 'default',
    maxLength: 11,
    col: 0.6,
    validation: { required: true },
  },
  password: {
    label: 'password',
    type: 'textInput',
    secureTextEntry: true,
    icon: 'lock',
    autoCapitalize: 'none',
    col: 0.3,
    validation: { required: true, minLength: 4 },
  },
};

const LoginForm = props => {
  const { initialValues, handleSubmit, setRef, initialValid } = props;

  const formFields = [pick(formFieldsObject, 'email', 'password')];

  const data = initialValues ? initialValues.toJS() : {};

  return (
    <Form style={styles.form} ref={setRef} onSubmit={handleSubmit}>
      {formFields.map(formField => (
        <Group
          data={data}
          fieldsObject={formField}
          key={formField}
          initialValid={initialValid}
        />
      ))}
    </Form>
  );
};

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  setRef: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
  initialValid: PropTypes.object,
};

LoginForm.defaultProps = {
  initialValues: null,
  initialValid: {},
};

export default reduxForm({
  form: 'loginForm',
  touchOnChange: true,
  touchOnBlur: true,
})(LoginForm);
