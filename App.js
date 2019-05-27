/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Button, Platform, StyleSheet, Text, View} from 'react-native';
import {createStackNavigator, createAppContainer} from 'react-navigation';

import HomeScreen from './screens/HomeScreen'
import GroupsScreen from './screens/GroupsScreen';
import MoviesScreen from './screens/MoviesScreen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});

const MainNavigator = createStackNavigator(
  {
    Home: {screen: HomeScreen},
    Groups: {screen: GroupsScreen},
    Movies: {screen: MoviesScreen},
  },
);

export default App = createAppContainer(MainNavigator);
