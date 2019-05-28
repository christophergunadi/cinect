/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Button, Platform, StyleSheet, Text, View} from 'react-native';
import {createStackNavigator, createAppContainer, createBottomTabNavigator, createMaterialTopTabNavigator} from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';

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

const MainNavigator = createMaterialTopTabNavigator(
  {
    Groups: {
      screen: GroupsScreen,
      navigationOptions: () => ({
        tabBarIcon: ({tintColor}) => (
          <Icon 
            name="md-people"
            color='black'
            size={24}
          />
        )
      })
    },
    Home: {screen: HomeScreen,
      navigationOptions: () => ({
        tabBarIcon: ({tintColor}) => (
          <Icon 
            name="md-home"
            color='black'
            size={24}
          />
        )
      })
    },
    Movies: {screen: MoviesScreen,
      navigationOptions: () => ({
        tabBarIcon: ({tintColor}) => (
          <Icon 
            name="md-film"
            color='black'
            size={24}
          />
        )
      })
    },
  },
  {
    initialRouteName: 'Home',
    swipeEnabled: false,
    tabBarOptions: {
      showIcon:true,
      showLabel:false,
      indicatorStyle: {
        backgroundColor:'gray'
      },
      style: {
        backgroundColor:'white',
      }
    }
  }
);

export default App = createAppContainer(MainNavigator);
