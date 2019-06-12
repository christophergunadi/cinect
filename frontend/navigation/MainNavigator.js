import React, {Component} from 'react';
// import {connect} from 'react-redux';
import {Image} from 'react-native';
import {createMaterialTopTabNavigator} from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
// import {createReduxBoundAddListener, createReduxNavigationReduxMiddleware} from 'react-navigation-redux-helpers';

import GroupsNavigator from './GroupsNavigator';
import GroupFriendsNavigator from './GroupFriendsNavigator';

import HomeScreen from '../screens/HomeScreen'
import MoviesScreen from '../screens/MoviesScreen';

const MainNavigator = createMaterialTopTabNavigator(
  {
    Groups: {screen: GroupFriendsNavigator,
      navigationOptions: () => ({
        tabBarIcon: ({tintColor}) => (
          <Icon
            name="md-people"
            color='black'
            size={30}
          />
        )
      })
    },
    Home: {screen: HomeScreen,
      navigationOptions: () => ({
        tabBarIcon: ({ focused, tintColor}) => (
          <Image
            focused={focused}
            source={require("../assets/img/cinectlogo.png")}
            style={{width: 90, height: 20}}
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
            size={30}
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

export default MainNavigator;
