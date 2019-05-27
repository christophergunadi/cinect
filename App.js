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

import GroupsScreen from './screens/GroupsScreen';
import MoviesScreen from './screens/MoviesScreen';

// type Props = {};
class HomeScreen extends React.Component {
// class HomeScreen extends Component<Props> {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Home Screen</Text>
        {/* <Button
          title="Groups"
          onPress={() => this.props.navigation.navigate('Groups')}
        />
        <Button
          title="Movies"
          onPress={() => this.props.navigation.navigate('Movies')}
        /> */}
      </View>
    );
  }
}

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

// export default createBottomTabNavigator(
//   {
//     // Home: HomeScreen,
//     Groups: GroupsScreen,
//     Movies: MoviesScreen
//   }
// )

export default App = createAppContainer(MainNavigator);
