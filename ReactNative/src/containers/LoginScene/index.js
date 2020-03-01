/**
 *
 * LoginScene Container
 *
 */

/* global translate */

import React from 'react';
// import PropTypes from 'prop-types';
import { Actions } from 'react-native-router-flux';
import { compose } from 'redux';
import { connect } from 'react-redux';
// import { Alert } from 'react-native'
import { Button, Container, Content, Text } from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';

import Storage from '../../utils/DeviceStorage';
import AppHeader from '../../components/AppHeader';
import AppFooter from '../../components/AppFooter';
import LoginForm from '../../forms/LoginForm';

import styles from './styles';

export class LoginScene extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      spinner: false,
    };
  }

  onSubmit = (value, distch, form) => {
    const data = value.toJS();
    this.setState({ spinner: true });
    setTimeout(() => {
      this.setState({ spinner: false });
      Storage.save('currentUser', JSON.stringify(data));
      Actions.reset('home');
    }, 1000);
  };

  render() {
    const { spinner } = this.state;
    return (
      <Container>
        <Spinner visible={spinner} textContent="Loading..." />
        <AppHeader hasLeft={false} title="loginScene" />
        <Content
          contentContainerStyle={styles.contentContainer}
          style={styles.content}
        >
          <LoginForm
            onSubmit={(value, distch, form) =>
              this.onSubmit(value, distch, form)
            }
            setRef={e => {
              this.form = e;
            }}
            initialValues={{ email: 'lang@gf.co', password: 'password text' }}
            initialValid={{
              email: { required: true, isEmail: true },
              password: { minLength: 6 },
            }}
          />
          <Button
            block
            primary
            style={styles.button}
            onPress={() => this.form.props.onSubmit()}
          >
            <Text>{translate('submit')}</Text>
          </Button>
        </Content>

        <AppFooter pageName="LoginScene" />
      </Container>
    );
  }
}

LoginScene.defaultProps = {};

LoginScene.propTypes = {};

const mapDispatchToProps = dispatch => ({
  dispatch,
});

const withConnect = connect(
  null,
  mapDispatchToProps,
);

export default compose(withConnect)(LoginScene);
