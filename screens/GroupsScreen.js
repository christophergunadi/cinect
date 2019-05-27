import React, {Component} from 'react';
import {TouchableOpacity, Image, FlatList, Button, StyleSheet, Text, View} from 'react-native';
// import {createStackNavigator, createAppContainer} from 'react-navigation';

export default class GroupsScreen extends React.Component {
// class HomeScreen extends Component<Props> {
  render() {
    return (
      <View style={styles.container}>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={styles.title}>My Groups</Text>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.title}>+</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={[
            {key: 'group19'},
            {key: 'flatmates'},
            {key: 'family'},
            {key: 'fambam'},
          ]}
          renderItem={({item}) =>
            <View style={{ flexDirection: 'row' }}>
              <Image source={require('../assets/img/tempprofileicon.png')} style={styles.profileicon}/>
              <Text style={styles.groupName}>{item.key}</Text>
            </View>
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    paddingLeft: 30,
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontFamily: 'PT_Sans-Caption-Bold',
    fontSize: 30,
    color: '#463D3D',
    marginVertical: 5,
    marginBottom: 10,
  },
  profileicon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginTop: 5,
    marginBottom: 5,
  },
  groupName: {
    fontFamily: 'PT_Sans-Caption-Regular',
    fontSize: 18,
    color: '#000000',
    textAlign: 'left',
    marginLeft: 20,
    marginTop: 20,
  },
  addButton: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0)',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 100,
    marginRight: 30,
    marginTop: 5,
  },
});
