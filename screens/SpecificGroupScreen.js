import React, {Component} from 'react';
import {Dimensions, TouchableOpacity, Image, FlatList, Button, StyleSheet, Text, View} from 'react-native';

export default class SpecificGroupScreen extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{this.props.navigation.getParam('groupname')}</Text>
        <Text>Now we need to go to database the fetch users lol</Text>

        <View style={{ justifyContent: 'flex-end', alignItems: 'center', bottom: 0, flex: 1 }}>
          <TouchableOpacity style={styles.suggestButton}>
            <Text style={{ fontFamily: 'PT_Sans-Caption-Regular', color: '#000000' }}>Suggest a movie</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    paddingLeft: 30,
    paddingRight: 30,
    backgroundColor: 'white',
    paddingBottom: 30,
  },
  title: {
    fontFamily: 'PT_Sans-Caption-Bold',
    fontSize: 30,
    color: '#463D3D',
    marginVertical: 5,
    marginBottom: 10,
  },
  suggestButton: {
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fc9797',
    height: 35,
    width: Dimensions.get('window').width / 2,
  },
});
