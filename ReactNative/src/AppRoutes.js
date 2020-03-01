/**
 *
 * app routes file
 *
 */

import React from 'react';
import { Router, Stack, Scene } from 'react-native-router-flux';

// import page container
import HomeScene from './containers/HomeScene';
import LoginScene from './containers/LoginScene';
import SplashScene from './containers/SplashScene';
import FirstOpenScene from './containers/FirstOpenScene';

export default function AppRoutes() {
  return (
    <Router>
      <Stack hideNavBar>
        <Scene key="splash" component={SplashScene} initial />
        <Scene key="firstOpen" component={FirstOpenScene} />
        <Scene key="login" component={LoginScene} />
        <Scene key="home" component={HomeScene} />
      </Stack>
    </Router>
  );
}
