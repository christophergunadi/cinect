import React, {Component} from 'react';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';

import MainNavigator from './MainNavigator';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import { FluidNavigator, Transition } from 'react-navigation-fluid-transitions';


export default createAppContainer(FluidNavigator(
  {
    Splash: {screen: SplashScreen},
    Login: {screen: LoginScreen}, 
    Main: {screen: MainNavigator},
  }, 
));
