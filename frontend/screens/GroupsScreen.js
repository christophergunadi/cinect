import React, {Component} from 'react';
import {TouchableOpacity, Image, FlatList, Button, StyleSheet, Text, View, RefreshControl, ScrollView} from 'react-native';

import NewGroupModal from '../components/NewGroupModal';
import MainStylesheet from '../styles/MainStylesheet';
import {GetUserProperty} from '../Helpers';

export default class GroupsScreen extends React.Component {
  constructor(props) {
    super(props);
    this._onAddGroupButton  = this._onAddGroupButton.bind(this);
    this._onNavigateToGroup = this._onNavigateToGroup.bind(this);
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

  _onRefresh = () => {
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
      // TODO: ScrollView lines are buggy
      <ScrollView contentContainerStyle={{flexGrow: 1}} refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this._onRefresh}/>}>
      <View style={MainStylesheet.container}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={MainStylesheet.title}>My Groups</Text>
          <TouchableOpacity style={styles.addButton} onPress={this._onAddGroupButton}>
            <Text style={MainStylesheet.title}>+</Text>
          </TouchableOpacity>
        </View>

        <NewGroupModal ref={'newGroupModal'}>
        </NewGroupModal>

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
      </View>
    </ScrollView>
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
    borderColor: 'rgba(0,0,0,0)',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 100,
    marginTop: 5,
  },
});
