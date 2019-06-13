import React, {Component} from 'react';
import {Text, Image, View, StyleSheet, Animated, TouchableOpacity, ScrollView} from 'react-native';
import {GraphRequest, GraphRequestManager } from 'react-native-fbsdk';
import UserProfileScreen from './UserProfileScreen';

export default class FriendsScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            myFriends: [],
            myFriendsPic: {},
        }
    }

    componentDidMount() {
        new GraphRequestManager().addRequest(
            new GraphRequest("/me/friends", null, this._getFriendsCallback,)).start();
    }

    _getFriendsCallback = (error, result) => {
        if (error) {
          alert("Failed to retrieve your friends. Please log in or sign up to create a group.")
        } else {
          var i;
          friends = [];
          marks = [];
          ticks = [];
          for (i = 0; i < result.data.length; i++) {
            friends.push({id: result.data[i].id, name: result.data[i].name});
          }
          this.setState({
            myFriends: friends,
          });
    
          this.state.myFriends.map((friend) => {
            new GraphRequestManager().addRequest(
              new GraphRequest("/"+ friend.id +"/picture?redirect=false", null, ((err, res) => {
                this.state.myFriendsPic[friend.id] = res.data.url;
                this.setState({}); 
              }))).start();
          });
        }
    }
    
    render() {
        return (
            <ScrollView style={{backgroundColor: 'white', paddingLeft: 15, paddingRight: 15}}>
                
                {this.state.myFriends.map((f) => { return (
            <TouchableOpacity onPress={() => 
            this.props.navigation.navigate('UserProfile', {name: f.name, facebookid: f.id, picture: this.state.myFriendsPic[f.id],})}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingTop: 15}}>
              <View style={{flexDirection:'row', paddingLeft: 17}}>
                <Image source={{uri: this.state.myFriendsPic[f.id]}} 
                   style={{width: 45, height: 45, borderRadius: 23, paddingTop: 10}}/>
                <Text style={{fontFamily: 'PT_Sans-Caption-Regular', color: '#000000', paddingTop: 10, 
                paddingLeft: 12, fontSize: 14}}>{f.name}</Text>
              </View>
            </View>
            </TouchableOpacity>)})}
           </ScrollView>
        )
    }
}