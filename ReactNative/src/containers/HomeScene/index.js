/**
 *
 * HomeScene Container
 *
 */

/* global translate changeLanguage */

import React from 'react';
import PropTypes from 'prop-types';
import { Actions } from 'react-native-router-flux';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createPropsSelector } from 'reselect-immutable-helpers';
import { Container, Content, Text, Button } from 'native-base';

import AppHeader from '../../components/AppHeader';
import AppFooter from '../../components/AppFooter';

import { selectCounter } from '../../selectors';
import { addToCounter, minusToCounter } from '../../actions';
import styles from './styles';
import Storage from '../../utils/DeviceStorage';

export class HomeScene extends React.PureComponent {
  renderLink = () => (
    <Button
      onPress={() => {
        Storage.delete('currentUser');
        Actions.reset('login');
      }}
      style={styles.button}
    >
      <Text>{translate('login')}</Text>
    </Button>
  );

  renderChangeLanguage = language => (
    <Button
      onPress={() => {
        changeLanguage(language);
      }}
      style={styles.button}
    >
      <Text>{translate(language)}</Text>
    </Button>
  );

  renderCalculate = type => {
    const { addCounter, minusCounter } = this.props;
    const calculateFunc = type === 'add' ? addCounter : minusCounter;
    return (
      <Button onPress={calculateFunc} style={styles.button}>
        <Text>{translate(type)}</Text>
      </Button>
    );
  };

  render() {
    const { counter } = this.props;
    return (
      <Container>
        <AppHeader title="homeScene" hasLeft={false} hasRight={false} />

        <Content
          contentContainerStyle={styles.contentContainer}
          style={styles.content}
        >
          {this.renderLink()}

          {this.renderChangeLanguage('vi')}
          {this.renderChangeLanguage('en')}

          {this.renderCalculate('add')}
          {this.renderCalculate('minus')}

          <Text style={styles.generateText}>{counter}</Text>
        </Content>

        <AppFooter pageName="HomeScene" />
      </Container>
    );
  }
}

HomeScene.defaultProps = {
  addCounter: null,
  counter: 0,
  minusCounter: null,
};

HomeScene.propTypes = {
  addCounter: PropTypes.func,
  counter: PropTypes.number,
  minusCounter: PropTypes.func,
};

const mapStateToProps = createPropsSelector({
  counter: selectCounter,
});

const mapDispatchToProps = dispatch => ({
  addCounter: () => dispatch(addToCounter()),
  minusCounter: () => dispatch(minusToCounter()),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(HomeScene);
