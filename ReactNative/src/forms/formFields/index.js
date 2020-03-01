import React from 'react';
import PropTypes from 'prop-types';
import { Field, FieldArray } from 'redux-form/immutable';
import map from 'lodash/map';
import { View } from 'native-base';

import { ALL_FIELDS } from './constants';
import styles from './styles';
import validate from './validate';

const setValidate = (value, values, form, key) =>
  validate(value, values, form, key);

export default function Group({ data, fieldsObject }) {
  const keys = [];
  const renderFieldObject = (fieldObject, name, array) => {
    if (fieldObject.isFieldArray) {
      return (
        <FieldArray
          {...fieldObject}
          validate={[setValidate]}
          component={ALL_FIELDS[fieldObject.type]}
          key={name}
          name={name}
          setValue={data[name] && data[name]}
        />
      );
    }
    if (fieldObject.col) {
      let check = true;
      let col = 0;
      const row = map(array, (fieldObjectCol, nameCol) => {
        if (check && keys.indexOf(nameCol) === -1) {
          if (fieldObjectCol.col && col + fieldObjectCol.col < 1) {
            keys.push(nameCol);
            col += fieldObjectCol.col;
            return (
              <View key={nameCol} style={{ flex: fieldObjectCol.col }}>
                <Field
                  {...fieldObjectCol}
                  validate={[setValidate]}
                  component={ALL_FIELDS[fieldObjectCol.type]}
                  key={nameCol}
                  name={nameCol}
                  setValue={data[nameCol] && data[nameCol]}
                />
              </View>
            );
          }
          check = false;
        }
        return null;
      });
      return (
        <View style={styles.viewRow} key={name}>
          {row}
        </View>
      );
    }
    keys.push(name);
    return (
      <Field
        {...fieldObject}
        validate={[setValidate]}
        component={ALL_FIELDS[fieldObject.type]}
        key={name}
        name={name}
        setValue={data[name] && data[name]}
      />
    );
  };

  return map(fieldsObject, renderFieldObject);
}

Group.propTypes = {
  fieldsObject: PropTypes.object,
};

Group.defaultProps = {
  fieldsObject: {},
};
