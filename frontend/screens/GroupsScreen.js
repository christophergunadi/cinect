import React, {Component} from 'react';
import {TouchableOpacity, Image, FlatList, Button, StyleSheet, Text, View, RefreshControl, ScrollView} from 'react-native';

import NewGroupModal from '../components/NewGroupModal';
import {GetUserProperty} from '../Helpers';

export default class GroupsScreen extends React.Component {
  constructor(props) {
    super(props);
    this._onAddGroupButton  = this._onAddGroupButton.bind(this);
    this._onNavigateToGroup = this._onNavigateToGroup.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.state = {
      myGroups: [],
      refreshing: false,
    };
  }

  componentDidMount() {
    // Get group info for rendering
    GetUserProperty('email').then(value => {
      fetch("http://146.169.45.140:8000/cinect_api/getgroups?email=" + value)
      .then(response => response.json())
      .then((responseJson) => {
        this.setState ({
          myGroups: responseJson.data
        });
      }).catch((error) => {
        console.error(error);
      });
    })
  }

  onRefresh = () => {
    this.setState({refreshing: true});
    GetUserProperty('email').then(value => {
      fetch("http://146.169.45.140:8000/cinect_api/getgroups?email=" + value)
      .then(response => response.json())
      .then((responseJson) => {
        this.setState ({
          myGroups: responseJson.data,
          refreshing: false,
        });

      }).catch((error) => {
        console.error(error);
      });
    })
  }

  _onAddGroupButton() {
    this.refs.newGroupModal.showAddModal();
  }

  _onNavigateToGroup(grpname, grpid) {
    this.props.navigation.navigate('SpecificGroup', {groupname: grpname, groupid: grpid});
  }

  render() {
    return (
      <View style={{flex: 1, paddingTop: 12, paddingLeft: 30, paddingRight: 30, paddingBottom: 30, backgroundColor: 'transparent',}}>
      <NewGroupModal ref={'newGroupModal'} refresh={this._onRefresh} />
        <ScrollView contentContainerStyle={{flexGrow: 1}} refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh}/>}>

        {this.state.myGroups.map((group) => {
          return (
            <View style={{ flexDirection: 'row' }}>
              <Image source={require('../assets/img/tempprofileicon.png')} style={styles.profileicon}/>
              <TouchableOpacity onPress={() => this._onNavigateToGroup(group.groupname, group.groupid)}>
                <Text style={styles.groupName}>{group.groupname}</Text>
              </TouchableOpacity>
            </View>
          );
        })}
        </ScrollView>
        <View style={{position: 'absolute', bottom: 0, right: 0, marginBottom: 35, marginRight: 40}}>
          <TouchableOpacity style={styles.addButton} onPress={this._onAddGroupButton}>
            <Text style={{fontFamily: 'PT_Sans-Caption-Bold', fontSize: 30, color: 'white',
               marginVertical: 5, marginBottom: 10,}}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
    borderColor: '#ff044e',
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    backgroundColor: '#ff044e',
    borderRadius: 100,
    marginTop: 5,
    elevation: 3,
  },
});
