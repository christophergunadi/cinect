import React, { Component } from 'react';
import { AsyncStorage, View } from 'react-native';
import { LoginButton, GraphRequest, GraphRequestManager } from 'react-native-fbsdk';


export default class FBLoginButton extends Component {

  addUser = (email, facebookid) => {
    let formData = new FormData();
    formData.append('email', email);
    formData.append('facebookid', facebookid);
    fetch("http://146.169.45.140:8000/cinect_api/user", {
      method: 'POST',
      body: formData
    })
  }

  onUserLogin = async(email, name, facebookid) => {
    try {
      await AsyncStorage.setItem('userEmail', email);
      await AsyncStorage.setItem('userName', name);
      await AsyncStorage.setItem('userId', facebookid);
    } catch (error) {
      alert(error.message);
    }
    this.addUser(email, facebookid);
  }

  onUserLogout = async() => {
    try {
      await AsyncStorage.removeItem('userEmail');
      await AsyncStorage.removeItem('userName');
      await AsyncStorage.removeItem('userId');
    } catch (error) {
      alert(error.message);
    }
  }

  constructor(props) {
    super(props);
    this._userInfoCallback = this._userInfoCallback.bind(this);
  }

  _userInfoCallback = (error, result) => {
    if (error) {
      alert('Error fetching data: ' + error.toString());
    } else {
      this.onUserLogin(result.email, result.name, result.id);
    }
  }

  render() {
    return (
      <View>
      <LoginButton
      readPermissions={["email", "user_friends"]}
      onLoginFinished={
        (error, result) => {
          if (error) {
            alert("Login failed with error: " + error.message);
          } else if (result.isCancelled) {
            alert("Login was cancelled");
          } else {
            const userInfoReq = new GraphRequest('/me?fields=name,email,id', null, this._userInfoCallback,);
            new GraphRequestManager().addRequest(userInfoReq).start();
          }
        }
      }
      onLogoutFinished={() => this.onUserLogout()}/>
      </View>
    );
  }
};

module.exports = FBLoginButton;
