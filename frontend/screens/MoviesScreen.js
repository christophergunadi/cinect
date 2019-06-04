import React, {Component} from 'react';
import {AsyncStorage, Button, Text, View, StyleSheet, ScrollView, Image, FlatList, TouchableOpacity} from 'react-native';
import {createBottomTabNavigator, createStackNavigator, createAppContainer, BottomTabBar} from 'react-navigation'

import SettingsScreen from './SettingsScreen'
import UserProfileScreen from './UserProfileScreen'
import Watchlist from './MoviesScreen/Watchlist'
import WatchlistMovieScreen from './WatchlistMovieScreen'
import WatchedMovies from './MoviesScreen/WatchedMovies'
import WatchList from './MoviesScreen/Watchlist';

var FBLoginButton = require('../components/FBLoginButton');

class MoviesScreen extends React.Component {

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
      email: '',
      name: '',
    }
    this.onUserLogin = this.onUserLogin.bind(this);
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

  addUser = (email, facebookid) => { //send swiped right movie id to cinect_api to add to populate database
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
    } catch (error) {
      alert(error.message);
    }
    this.addUser(email, facebookid);
    this.setState({'email': email, 'name': name});
  }

  watchlistOnPress = (posterpath, title) => {
    this.props.navigation.navigate('WatchlistMovieScreen', {posterpath: posterpath, title: title});
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
             <FBLoginButton onChange = { this.onUserLogin }/>
           </View>
           
          </View>
          
          <View style={{height:250, marginTop:20}}>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              style={{marginLeft:20}}>

              {this.state.watchlist.map(movie => {
                return (
                  <TouchableOpacity onPress={() => this.watchlistOnPress(movie.posterpath, movie.title)}>
                    <WatchList imageUri={movie.posterpath}
                               name={movie.title} />
                  </TouchableOpacity>
                  
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
                <WatchedMovies imageUri={require('../assets/pikachu.jpg')}
                  name="Detective Pikachu"/>
                <WatchedMovies imageUri={require('../assets/pikachu.jpg')}
                  name="Detective Pikachu"/>
                <WatchedMovies imageUri={require('../assets/pikachu.jpg')}
                  name="Detective Pikachu"/>
              </ScrollView>
            </View>

          </View>

        </ScrollView>
      </View>
    );
  }
}

const MoviesScreenNavigator = createStackNavigator(
{
  Home: {
    screen: MoviesScreen
  },
  WatchlistMovieScreen: {
    screen: WatchlistMovieScreen
  }
},
{
  headerMode: 'none',
  navigationOptions: {
    headerVisible: false
  }
}
)

const styles = StyleSheet.create({
  Text: {
    fontFamily:'PT Sans Caption'
  }
})

export default createAppContainer(MoviesScreenNavigator);
