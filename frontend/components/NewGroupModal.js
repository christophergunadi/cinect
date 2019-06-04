import React , {Component} from 'react';
import {AsyncStorage, Dimensions, Text, View, StyleSheet, FlatList, Image, TextInput,TouchableOpacity,
  Keyboard, LayoutAnimation, UIManager} from 'react-native';
import Modal from 'react-native-modalbox';
import {GraphRequest, GraphRequestManager } from 'react-native-fbsdk';

import {GetUserProperty} from '../Helpers';

var windowSize = Dimensions.get('window');

export default class NewGroupModal extends Component {
  constructor(props) {
    super(props);
    this.createGroup = this.createGroup.bind(this);
    this._onAddMemberButton = this._onAddMemberButton.bind(this);
    this._onFinishAddingFriends = this._onFinishAddingFriends.bind(this);
    this._getFriendsCallback = this._getFriendsCallback.bind(this);
    this.renderFriends = this.renderFriends.bind(this);
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

    this.state = {
      addingFriends: false,
      groupName: "Group",
      myFriends: [], // Maps friend_id to friend name
      groupMembers: [], // Currently added group members
    };
  }

  showAddModal = () => {
    this.refs.newGroupModal.open();
  }

  createGroup = () => {
    let formData = new FormData();
    formData.append('groupname', this.state.groupName);

    var i;
    for (i = 0; i < this.state.groupMembers.length; i++) {
      formData.append('members', this.state.groupMembers[i].id);
    }

    // Add own ID to formData in request, then post to backend API
    GetUserProperty('id').then(value => {
      formData.append('members', value);
      fetch("http://146.169.45.140:8000/cinect_api/creategroup", {
        method: 'POST',
        body: formData
      }).then(response => response.json()).then((responseJson) => {
        alert(responseJson.movieTitle)
      });
    })

    // Close model and reset form
    this.refs.newGroupModal.close();
    this.setState({
      groupMembers: [],
    });
  }

  _getFriendsCallback = (error, result) => {
    if (error) {
      alert("Failed to retrieve your friends. Please log in or sign up to create a group.")
    } else {
      var i;
      friends = [];
      for (i = 0; i < result.data.length; i++) {
        friends.push({id: result.data[i].id, name: result.data[i].name});
      }
      this.setState({
        myFriends: friends,
      });
    }
  }

  _onAddMemberButton = () => {
    // Fetch my friends and store it in state.
    new GraphRequestManager().addRequest(new GraphRequest("/me/friends", null, this._getFriendsCallback,)).start();
    const animation = LayoutAnimation.create(300, 'linear', 'opacity');
    LayoutAnimation.configureNext(animation, () => {});
    this.setState({
      addingFriends: true,
    });
  }

  _onFinishAddingFriends = () => {
    const animation = LayoutAnimation.create(300, 'linear', 'opacity');
    LayoutAnimation.configureNext(animation, () => {});
    this.setState({
      addingFriends: false,
    });
  }

  _onAddSpecificFriend = (friend) => {
    //TODO : Adding someone to the group twice?
    var i;
    for (i = 0; i < this.state.groupMembers.length; i++) {
      if (this.state.groupMembers[i].id == friend.id) {
        return;
      }
    }
    this.state.groupMembers.push(friend);
  }

  renderFriends = () => {
    var friends = this.state.myFriends;
    return (friends.map((f) => {
      return (
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <TouchableOpacity onPress={() => this._onAddSpecificFriend(f)}>
            <Text style={{ fontFamily: 'PT_Sans-Caption-Regular', color: '#000000' }}>{f.name}</Text>
          </TouchableOpacity>
        </View>
      );
    }))
  }

  renderCurrentMembers = () => {
    return (this.state.groupMembers.map((f) => {
      return (
        <View style={{ flexDirection: 'row' }}>
          <Image source={require('../assets/img/tempprofileicon.png')} style={styles.profileicon}/>
          <Text style={styles.groupName}>{f.name}</Text>
        </View>
      );
    }))
  }

  render() {
    if (this.state.addingFriends) {
      return (
        <Modal ref={'newGroupModal'}
        style={{
          padding: 40,
          borderRadius: 20,
          shadowRadius: 10,
          width: windowSize.width - 70,
          height: windowSize.height - 200
        }}
        position='center'
        backdrop={true}
      >
        <View style={styles.container}>
          <View style={{flex: 1, flexDirection: 'column', justifyContent: 'space-between'}}>
            <Text style={styles.title}>Add friends</Text>
              {this.renderFriends()}
            <TouchableOpacity style={styles.createButton} onPress={this._onFinishAddingFriends}>
            <Text style={{ fontFamily: 'PT_Sans-Caption-Regular', color: '#000000' }}>Back</Text>
          </TouchableOpacity>
          </View>
        </View>

      </Modal>
      )
    } else {
      return (
        <Modal ref={'newGroupModal'}
          style={{
            justifyContent: 'center',
            borderRadius: 20,
            shadowRadius: 10,
            width: windowSize.width - 70,
            height: windowSize.height - 200
          }}
          position='center'
          backdrop={true}
        >
          <View style={styles.container}>
            <Text style={styles.title}>Create a new group</Text>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
              <TouchableOpacity onPress={() => alert("I want to set a DP")}>
                <Image source={require('../assets/img/tempprofileicon.png')} style={styles.profileicon}/>
              </TouchableOpacity>
              <TextInput style={styles.textInput} placeholder="Enter group name" maxLength={15}
                onBlur={Keyboard.dismiss} onChangeText={(text) => this.setState({groupName: text})}/>
            </View>
            <Text style={styles.subtitle}>Current members</Text>

            {this.renderCurrentMembers()}

            <TouchableOpacity style={styles.addButton} onPress={this._onAddMemberButton}>
              <Text style={styles.title}>+</Text>
            </TouchableOpacity>

            <View style={{ justifyContent: 'flex-end', alignItems: 'center', bottom: 0, flex: 1 }}>
              <TouchableOpacity style={styles.createButton} onPress={this.createGroup}>
                <Text style={{ fontFamily: 'PT_Sans-Caption-Regular', color: '#000000' }}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 30,
  },
  title: {
    fontFamily: 'PT_Sans-Caption-Bold',
    fontSize: 25,
    color: '#463D3D',
    marginVertical: 5,
    marginBottom: 10,
  },
  groupName: {
    fontFamily: 'PT_Sans-Caption-Regular',
    fontSize: 15,
    color: '#000000',
    textAlign: 'left',
    marginLeft: 20,
    marginTop: 20,
  },
  profileicon: {
    width: 45,
    height: 45,
    borderRadius: 25,
    marginTop: 5,
    marginBottom: 5,
  },
  subtitle: {
    fontFamily: 'PT_Sans-Caption-Regular',
    fontSize: 17,
    color: '#000000',
    marginTop: 15,
    marginBottom: 5,
  },
  textInput: {
    width: windowSize.width - 220,
    borderBottomColor: '#000000',
    borderBottomWidth: 1,
    marginRight: 20,
    paddingBottom: -10,
    marginBottom: 10,
  },
  createButton: {
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#5ac4e8',
    height: 30,
    width: windowSize.width / 3,
  },
  addButton: {
    borderWidth: 1,
    borderColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    width: 45,
    height: 45,
    backgroundColor: '#fff',
    borderRadius: 25,
    marginRight: 30,
    marginTop: 5,
  },
})
