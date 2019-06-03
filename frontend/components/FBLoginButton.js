import React, { Component } from 'react';
import { View } from 'react-native';
import { LoginButton, GraphRequest, GraphRequestManager } from 'react-native-fbsdk';


export default class FBLoginButton extends Component {

   constructor(props) {
     super(props);
     this._userInfoCallback = this._userInfoCallback.bind(this);
   }

  _userInfoCallback = (error, result) => {
    if (error) {
      alert('Error fetching data: ' + error.toString());
    } else {
      this.props.onChange(result.email, result.name, result.id);
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
          onLogoutFinished={() => alert("User logged out")}/>
      </View>
    );
  }
};

module.exports = FBLoginButton;
