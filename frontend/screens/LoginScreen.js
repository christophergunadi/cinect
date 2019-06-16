import React, {Component} from 'react';
import {Text, View ,Image, AsyncStorage} from 'react-native';
import { LoginButton, GraphRequest, GraphRequestManager } from 'react-native-fbsdk';

import { FluidNavigator, Transition } from 'react-navigation-fluid-transitions';

var FBLoginButton = require('../components/FBLoginButton');

export default class LoginScreen extends Component {

    constructor(props) {
        super(props);
        this._onUserLogin      = this._onUserLogin.bind(this);
        this._onUserLogout     = this._onUserLogout.bind(this);
        this._addUser          = this._addUser.bind(this);
        this._userInfoCallback = this._userInfoCallback.bind(this);
      }
    
      _addUser = (email, facebookid, name) => {
        let formData = new FormData();
        formData.append('email', email);
        formData.append('facebookid', facebookid);
        formData.append('name', name);
        fetch("http://146.169.45.140:8000/cinect_api/user", {
          method: 'POST',
          body: formData
        })
      }
    
      _onUserLogin = async(email, name, facebookid) => {
        try {
          await AsyncStorage.setItem('email', email);
          await AsyncStorage.setItem('name', name);
          await AsyncStorage.setItem('id', facebookid);
        } catch (error) {
          alert(error.message);
        }
        this._addUser(email, facebookid, name);
      }
    
      _onUserLogout = async() => {
        try {
          await AsyncStorage.removeItem('email');
          await AsyncStorage.removeItem('name');
          await AsyncStorage.removeItem('id');
        } catch (error) {
          alert(error.message);
        }
      }
    
      _userInfoCallback = (error, result) => {
        if (error) {
          alert('Error fetching data: ' + error.toString());
        } else {
          this._onUserLogin(result.email, result.name, result.id)
          .then(() => this.props.navigation.navigate('Main'));
        }
      }  

    render() {
        return (
          <View style={{backgroundColor: 'white', alignItems:'center', flex:1, 
          justifyContent: 'space-between', paddingTop: 130}}>
            <View style={{alignItems: 'center'}}>
            <Transition shared="logo">
              <Image source={require('../assets/img/popcorn.png')} style={{width: 150, height: 150}}/>
            </Transition>
            <Image source={require('../assets/img/cinect.png')} style={{width: 150, height: 40, marginTop: 14}}/>
            <Text style={{fontSize: 18, fontFamily: 'PT_Sans-Caption-Regular', color: '#000000', paddingTop: 20}}>Making movies easy.</Text>
            </View>
            <View style={{paddingBottom: 200}}>
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
              onLogoutFinished={this._onUserLogout}/>
            </View> 
            
         </View>
        )
    }
}