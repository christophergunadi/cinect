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

import GroupsScreen from './screens/GroupsScreen';
import MoviesScreen from './screens/MoviesScreen';

type Props = {};
class HomeScreen extends React.Component {
// class HomeScreen extends Component<Props> {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Home Screen</Text>
        <Button
          title="Groups"
          onPress={() => this.props.navigation.navigate('Groups')}
        />
        <Button
          title="Movies"
          onPress={() => this.props.navigation.navigate('Movies')}
        />
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

const MainNavigator = createStackNavigator(
  {
    Home: {screen: HomeScreen},
    Groups: {screen: GroupsScreen},
    Movies: {screen: MoviesScreen},
  },
);

export default App = createAppContainer(MainNavigator);
