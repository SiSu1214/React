/**
 *
 * FirstOpenScene Container
 *
 */

/* global translate */

import React from 'react';
// import PropTypes from 'prop-types';
import { Actions } from 'react-native-router-flux';
import { Dimensions, StatusBar } from 'react-native';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Button, Container, Text, View } from 'native-base';
import Carousel from 'react-native-looped-carousel';

// utils => ... => containers => components => form

// import xxx from 'components/xxx';

// ./
import styles from './styles';
const { width, height } = Dimensions.get('window');

export class FirstOpenScene extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      size: { width, height },
    };
  }
  
  // componentDidMount() {
  // }
  
  render() {
    const { size } = this.state;
    return (
      <Container>
        <StatusBar hidden />
        <Carousel
          style={size}
          leftArrowText="＜"
          leftArrowStyle={styles.arrowStyle}
          rightArrowText="＞"
          rightArrowStyle={styles.arrowStyle}
          arrows
          bullets
          isLooped={false}
          autoplay={false}
          // onAnimateNextPage={p => console.log(p)}
        >
          <View style={[styles.bgBrand, size]}>
            <Text>1</Text>
          </View>
          <View style={[styles.bgSuccess, size]}>
            <Text>2</Text>
          </View>
          <View style={[styles.bgRed, size]}>
            <Button onPress={() => Actions.reset('login')}>
              <Text>{translate('login')}</Text>
            </Button>
          </View>
        </Carousel>
      </Container>
    );
  }
}

FirstOpenScene.defaultProps = {};

FirstOpenScene.propTypes = {};

const mapDispatchToProps = dispatch => ({
  // Use your actions here
  dispatch,
});

const withConnect = connect(
  null,
  mapDispatchToProps,
);

export default compose(withConnect)(FirstOpenScene);
