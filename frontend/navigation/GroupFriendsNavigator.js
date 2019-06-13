import React, {Component} from 'react';
import {createMaterialTopTabNavigator} from 'react-navigation';
import FriendsScreen from '../screens/FriendsScreen';
import GroupsNavigator from './GroupsNavigator';
import UserProfileScreen from '../screens/UserProfileScreen';
import {createStackNavigator} from 'react-navigation';
import WatchlistMovieScreen from '../screens/WatchlistMovieScreen';

const FriendsNavigator = createStackNavigator(
  {
    Friends: {screen: FriendsScreen},
    UserProfile: {screen: UserProfileScreen},
    WatchlistMovie : {screen: WatchlistMovieScreen},
  },
  {
    defaultNavigationOptions: {
      header: null
    }
  }
);

const GroupFriendsNavigator = createMaterialTopTabNavigator(
  {
    Groups: {screen: GroupsNavigator},
    Friends: {screen: FriendsNavigator},
  },
  {
    defaultNavigationOptions: {
      header: null,
      tabBarOptions: {
        style: {
          backgroundColor: 'white',
          shadowOpacity: 0,
          elevation: 0,
        },
        indicatorStyle: {
          backgroundColor: 'white'
        },
        activeTintColor: {
          color: 'black',
        },
        inactiveTintColor: {
          color: 'grey',
        },
        labelStyle: {
          fontFamily: 'PT_Sans-Caption-Bold',
          fontSize: 15,
        },
        upperCaseLabel: false,
      }
    }
  }
);

export default GroupFriendsNavigator;
