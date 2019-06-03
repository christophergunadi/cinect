import React, {Component} from 'react';
// import {AsyncStorage, Button, Text, View, StyleSheet, ScrollView, Image} from 'react-native';
import {Button, Text, View, StyleSheet, ScrollView, Image, FlatList} from 'react-native';
import {createBottomTabNavigator, createStackNavigator, createAppContainer, BottomTabBar} from 'react-navigation'

import SettingsScreen from './SettingsScreen'
import UserProfileScreen from './UserProfileScreen'
import Watchlist from './MoviesScreen/Watchlist'
import WatchedMovies from './MoviesScreen/WatchedMovies'
// import { FlatList } from 'react-native-gesture-handler';
import WatchList from './MoviesScreen/Watchlist';

var FBLoginButton = require('../components/FBLoginButton');

getUserMovies = (useremail) => {
  fetch(("http://146.169.45.140:8000/cinect_api/getswipedright?useremail="+useremail))
  .then(response => response.json())
  .then((responseJson) => {
    return responseJson.data
  })
};

export default class MoviesScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      name: '',
    }
    this.onUserLogin = this.onUserLogin.bind(this);
  }

  addUser = (email) => { //send swiped right movie id to cinect_api to add to populate database
    let formData = new FormData();
    formData.append('email', email);
    fetch("http://146.169.45.140:8000/cinect_api/user", {
      method: 'POST',
      body: formData
    })
  }

  onUserLogin = async(email, name) => {
    // userEmail = '';
    // try {
      // await AsyncStorage.setItem('userEmail', email);
      // await AsyncStorage.setItem('userName', name);
      // userEmail = await AsyncStorage.getItem('userEmail');
    // } catch (error) {
      // alert(error.message);
    // }
    // alert(userEmail);
    this.addUser(email);
    this.setState({'email': email, 'name': name});
  }

  render() {
    return (
      <View style={{flex:1}}>

        <ScrollView
         scrollEventThrottle='16'>
         <View style={{flex: 1, paddingTop: 20, flexDirection: 'row', justifyContent: 'space-between'}}>
           <Text style={{fontSize: 24, fontWeight: '700', fontFamily: 'PT Sans Caption', color: '#463D3D', paddingHorizontal: 20}}>
             My Watchlist
           </Text>
           <FBLoginButton onChange = { this.onUserLogin }/>
        </View>
        <View style={{flex: 1, paddingTop: 20}}>
           <View style={{height:220, marginTop:10}}>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              style={{marginLeft:20}}>

              <FlatList
                data={getUserMovies('kate@example.com')}
                // data={[
                //   {key: '299537',
                //    imageUri: 'https://image.tmdb.org/t/p/w500/AtsgWhDnHTq68L0lLsUrCnM7TjG.jpg',
                //    name: 'Detective Pikachu'},
                //    {key: '99537',
                //    imageUri: 'https://image.tmdb.org/t/p/w500/AtsgWhDnHTq68L0lLsUrCnM7TjG.jpg',
                //    name: 'Detective Pikachu'},
                //    {key: '29937',
                //    imageUri: 'https://image.tmdb.org/t/p/w500/AtsgWhDnHTq68L0lLsUrCnM7TjG.jpg',
                //    name: 'Detective Pikachu'},
                //    {key: '2937',
                //    imageUri: 'https://image.tmdb.org/t/p/w500/AtsgWhDnHTq68L0lLsUrCnM7TjG.jpg',
                //    name: 'Detective Pikachu'},

                  // {key: 'secondmovie',
                  //  imageUri: require('../assets/pikachu.jpg'),
                  //  name: 'Detective Pikachu'},
                  // {key: 'thirdmovie',
                  //  imageUri: require('../assets/pikachu.jpg'),
                  //  name: 'Detective Pikachu'},
                // ]}
                // extraData={this.state}
                horizontal={true}
                renderItem={({item}) =>
                // <Image source={{uri:item.imageUri}}/>}
                <WatchList imageUri={item.posterpath}
                           name={item.title}/>}
              />

              {/* <Watchlist imageUri={require('../assets/pikachu.jpg')}
                name="Detective Pikachu"/>
              <Watchlist imageUri={require('../assets/pikachu.jpg')}
                name="Detective Pikachu"/>
              <Watchlist imageUri={require('../assets/pikachu.jpg')}
                name="Detective Pikachu"/> */}
            </ScrollView>
           </View>

         </View>

         <View style={{marginTop:40}}>
           <Text style={{fontSize:24, fontWeight:'700', fontFamily:'PT Sans Caption', color: '#463D3D', paddingHorizontal:20}}>
             Movies I've watched
           </Text>

           <View style={{height:220, marginTop:10}}>
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
