/**
 *
 * TextInput
 *
 */

/* global translate */

import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'native-base';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import { Animated, Easing, TextInput } from 'react-native';

import styles from '../styles';
import icoMoonConfig from '../../../assets/fonts/icomoon';
const Icomoon = createIconSetFromIcoMoon(
  icoMoonConfig,
  'Icomoon',
  'icomoon.ttf',
);

const InputFloatingLabel = props => {
  const {
    input,
    placeholder,
    label,
    icon,
    secureTextEntry,
    autoCapitalize,
    keyboardType,
    layout,
    itemSettings,
    itemstyle,
    labelStyle,
    setValue,
    meta: { error, touched },
    maxLength,
  } = props;

  let { value } = props;

  if (setValue) {
    value = setValue;
  }

  const cleanStyle = { top: styles.input.height / 1.2 };
  const dirtyStyle = { top: styles.input.height / 2.2 };
  let dirty = value || placeholder;
  const style = dirty ? dirtyStyle : cleanStyle;
  const labelAnimated = {
    // fontSize: new Animated.Value(style.fontSize),
    top: new Animated.Value(style.top),
  };

  const animate = check => {
    dirty = check;
    const nextStyle = check ? dirtyStyle : cleanStyle;
    const anims = Object.keys(nextStyle).map(prop =>
      Animated.timing(
        labelAnimated[prop],
        {
          toValue: nextStyle[prop],
          duration: 200,
        },
        Easing.ease,
      ),
    );
    Animated.parallel(anims).start();
  };

  const itemLayout = [styles.defaultItem, itemstyle];
  const labelVertical = [styles.labelDefault, labelStyle, labelAnimated];
  if (layout === 'vertical') {
    itemLayout.push(styles.fieldVertical);
    labelVertical.push(styles.labelVertical);
  }

  const labelText = label || input.name;
  const placeholderText =
    itemSettings && itemSettings.floatingLabel === true
      ? null
      : translate(placeholder);

  return (
    <View>
      <View
        style={[
          styles.fieldHorizontal,
          touched && error && styles.borderColorError,
        ]}
      >
        {icon && <Icomoon name={icon} style={styles.icon} />}
        <View style={styles.defaultItem}>
          <Animated.Text style={labelVertical}>
            {translate(labelText)}
          </Animated.Text>
          <TextInput
            underlineColorAndroid="transparent"
            style={styles.input}
            defaultValue={value}
            placeholder={placeholderText}
            onChangeText={input.onChange}
            secureTextEntry={secureTextEntry}
            autoCapitalize={autoCapitalize}
            keyboardType={keyboardType}
            returnKeyType="next"
            onFocus={() => {
              animate(true);
            }}
            onBlur={() => {
              if (!input.value) {
                animate(false);
              }
            }}
            maxLength={maxLength}
          />
        </View>
      </View>
      {touched && error && !!error.trim() && (
        <Text style={styles.labelError}>{error}</Text>
      )}
    </View>
  );
};

InputFloatingLabel.defaultProps = {
  input: {},
  placeholder: '',
  value: '',
  setValue: '',
  icon: null,
  label: '',
  layout: '',
  itemSettings: {},
  secureTextEntry: false,
  itemstyle: {},
  labelStyle: {},
  autoCapitalize: 'none',
  keyboardType: 'default',
  meta: {},
  maxLength: null,
};

InputFloatingLabel.propTypes = {
  input: PropTypes.object,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  setValue: PropTypes.string,
  icon: PropTypes.string,
  label: PropTypes.string,
  layout: PropTypes.string,
  itemSettings: PropTypes.object,
  secureTextEntry: PropTypes.bool,
  itemstyle: PropTypes.object,
  labelStyle: PropTypes.object,
  autoCapitalize: PropTypes.string,
  keyboardType: PropTypes.string,
  meta: PropTypes.object,
  maxLength: PropTypes.number,
};

export default InputFloatingLabel;
