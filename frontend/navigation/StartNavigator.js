import React, {Component} from 'react';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';

import MainNavigator from './MainNavigator';
import SplashScreen from '../screens/SplashScreen';

export default createAppContainer(createSwitchNavigator(
  {
    Splash: {screen: SplashScreen},
    Main: {screen: MainNavigator},

  }
));
