import React, {Component} from 'react';
import {createStackNavigator} from 'react-navigation';

import GroupsScreen from '../screens/GroupsScreen';
import SpecificGroupScreen from '../screens/SpecificGroupScreen';

const GroupsNavigator = createStackNavigator(
  {
    Groups: {screen: GroupsScreen},
    SpecificGroup: {screen: SpecificGroupScreen},
  },
  {
    defaultNavigationOptions: {
      header: null
    }
  }
);

export default GroupsNavigator;
