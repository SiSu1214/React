/**
 *
 * SplashScene Container
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Actions } from 'react-native-router-flux';
import { Image } from 'react-native';
import { compose } from 'redux';
import { connect } from 'react-redux';
import SplashScreen from 'react-native-splash-screen';
import { createPropsSelector } from 'reselect-immutable-helpers';
import { selectLanguage } from '../../selectors';

import DeviceStorage from '../../utils/DeviceStorage';
const splash = require('./../../assets/images/splash.png');
const style = { width: '100%', height: '100%', resizeMode: 'stretch' };

export class SplashScene extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //   };
  // }
  
  async componentDidMount() {
    const { language } = this.props;
    if (language !== '') {
      const firstOpen = await DeviceStorage.get('firstOpen');
      if (!firstOpen) {
        SplashScreen.hide();
        Actions.reset('firstOpen');
        DeviceStorage.save('firstOpen', true);
      } else {
        const currentUser = await DeviceStorage.get('currentUser');
        if (!currentUser) {
          Actions.reset('login');
        } else {
          Actions.reset('home');
        }
        SplashScreen.hide();
      }
    }
  }

  render() {
    return <Image source={splash} style={style} />;
  }
}

SplashScene.defaultProps = {};

SplashScene.propTypes = {
  language: PropTypes.string.isRequired,
};

const mapDispatchToProps = dispatch => ({
  // Use your actions here
  dispatch,
});

const mapStateToProps = createPropsSelector({
  language: selectLanguage,
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(SplashScene);
