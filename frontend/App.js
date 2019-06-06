/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';

import StartNavigator from './navigation/StartNavigator';

import {Button, Platform, StyleSheet, Text, View, Image} from 'react-native';
import {createStackNavigator, createAppContainer, createBottomTabNavigator, createMaterialTopTabNavigator, createSwitchNavigator} from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';

import HomeScreen from './screens/HomeScreen'
import GroupsScreen from './screens/GroupsScreen';
import MoviesScreen from './screens/MoviesScreen';
import SpecificGroupScreen from './screens/SpecificGroupScreen';
import SplashScreen from './screens/SplashScreen';

export default class App extends Component<Props> {
  render() {
    return (
      <StartNavigator />
    );
  }
}
