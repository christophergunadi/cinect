import React, {Component} from 'react';
import {AsyncStorage, Button, Text, View, StyleSheet, ScrollView, Image, FlatList} from 'react-native';
import {createBottomTabNavigator, createStackNavigator, createAppContainer, BottomTabBar} from 'react-navigation'

import SettingsScreen from './SettingsScreen'
import UserProfileScreen from './UserProfileScreen'
import Watchlist from './MoviesScreen/Watchlist'
import WatchedMovies from './MoviesScreen/WatchedMovies'
import WatchList from './MoviesScreen/Watchlist';

var FBLoginButton = require('../components/FBLoginButton');



export default class MoviesScreen extends React.Component {

  getUserEmail = async() => {
    userEmail = '';
    try {
      userEmail = await AsyncStorage.getItem('userEmail');
    } catch (error) {
      alert(error.message);
    }
    return userEmail;
  }

  constructor(props) {
    super(props);
    this.state = {
      watchlist: [],
    }
  }

  componentDidMount() {
    this.getUserEmail().then(value => {
      fetch(("http://146.169.45.140:8000/cinect_api/getswipedright?useremail="+value))
      .then(response => response.json())
      .then((responseJson) => {
        this.setState({watchlist: responseJson.data});
      });
    })
  }

  render() {
    return (
      <View style={{flex:1}}>

        <ScrollView
         scrollEventThrottle='16'>
         <View style={{flex: 1, paddingTop: 30, flexDirection: 'row', justifyContent: 'space-between'}}>
           <Text style={{fontSize: 24, fontWeight: '700', fontFamily: 'PT Sans Caption', color: '#463D3D', paddingHorizontal: 20}}>
             My Watchlist
           </Text>
           <View style={{marginRight:10, marginTop: 3}}>
             <FBLoginButton onLogin = { this.onUserLogin }/>
           </View>

          </View>

          <View style={{height:250, marginTop:20}}>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              style={{marginLeft:20}}>

              {this.state.watchlist.map(movie => {
                return (
                  <WatchList imageUri={movie.posterpath}
                             name={movie.title} />
                )
              })
              }
            </ScrollView>
          </View>

         <View style={{marginTop:10}}>
           <Text style={{fontSize:24, fontWeight:'700', fontFamily:'PT Sans Caption', color: '#463D3D', paddingHorizontal:20}}>
             Movies I've watched
           </Text>

           <View style={{height:220, marginTop:20}}>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              style={{marginLeft:20}}>
              <WatchedMovies imageUri={require('../assets/captainmarvel.jpg')}
                name="Captain Marvel"/>
              <WatchedMovies imageUri={require('../assets/captainmarvel.jpg')}
                name="Captain Marvel"/>
              <WatchedMovies imageUri={require('../assets/captainmarvel.jpg')}
                name="Captain Marvel"/>
            </ScrollView>
           </View>

         </View>

        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  Text: {
    fontFamily:'PT Sans Caption'
  }
})
