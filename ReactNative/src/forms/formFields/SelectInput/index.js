/**
 *
 * SelectInput formField file
 *
 */

/* global translate */

import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'native-base';
import { Dropdown } from 'react-native-material-dropdown';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';

import { white, black } from '../../../theme/variables/commonColor';
import styles from '../styles';
import icoMoonConfig from '../../../assets/fonts/icomoon';
const Icomoon = createIconSetFromIcoMoon(
  icoMoonConfig,
  'Icomoon',
  'icomoon.ttf',
);

const SelectInput = props => {
  const {
    input,
    label,
    data,
    setValue,
    meta: { error, touched },
    trans,
  } = props;
  let dataSelect = [];

  if (trans) {
    data.map(item =>
      dataSelect.push({
        label: translate(item.label),
        value: item.value,
      }),
    );
  } else {
    dataSelect = data;
  }
  // if (data) {
  //
  // }

  return (
    <View>
      <View style={styles.viewSelect}>
        <Dropdown
          style={styles.select}
          containerStyle={styles.viewSelectContainer}
          labelTextStyle={styles.viewSelectLabel}
          inputContainerStyle={[
            styles.viewSelectLabel,
            styles.viewSelectLabelBorder,
            touched && error && styles.borderColorError,
          ]}
          renderAccessory={() => (
            <Icomoon name="arrow-down" style={styles.viewSelectIcon} />
          )}
          fontSize={9}
          labelFontSize={9}
          baseColor={white}
          textColor={white}
          selectedItemColor={black}
          data={dataSelect}
          label={translate(label)}
          onChangeText={input.onChange}
          value={setValue}
        />
      </View>
      {touched && error && !!error.trim() && (
        <Text style={styles.labelError}>{error}</Text>
      )}
    </View>
  );
};

SelectInput.defaultProps = {
  setValue: '',
  meta: {},
  trans: false,
};

SelectInput.propTypes = {
  input: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ).isRequired,
  setValue: PropTypes.string,
  meta: PropTypes.object,
  trans: PropTypes.bool,
};

export default SelectInput;
