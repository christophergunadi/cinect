import React, {Component} from 'react';
import {Text, View} from 'react-native';

export default class SettingsScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Settings</Text>
      </View>
    );
  }
}