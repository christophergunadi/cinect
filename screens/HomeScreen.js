import React, {Component} from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';

export default class HomeScreen extends React.Component {
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
