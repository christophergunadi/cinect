import React, {Component} from 'react';
import {Button, Text, View, StyleSheet, ScrollView, Image, FlatList, TouchableOpacity, RefreshControl} from 'react-native';
import {createBottomTabNavigator, createStackNavigator, createAppContainer, BottomTabBar, withNavigationFocus} from 'react-navigation'

import SettingsScreen from './SettingsScreen'
import UserProfileScreen from './UserProfileScreen'
import Watchlist from './MoviesScreen/Watchlist'
import WatchlistMovieScreen from './WatchlistMovieScreen'
import WatchedMovies from './MoviesScreen/WatchedMovies'
import WatchList from './MoviesScreen/Watchlist';
import {GetUserProperty} from '../Helpers';
// import console = require('console');

var FBLoginButton = require('../components/FBLoginButton');

class MoviesScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      watchlist: [],
      watchedlist: [],
      refreshing: false,
    }
    this.getUserMovies = this.getUserMovies.bind(this);
    this.getWatchedMovies = this.getWatchedMovies.bind(this);
    this.refreshWatchlist = this.refreshWatchlist.bind(this);
    this.refreshWatchedlist = this.refreshWatchedlist.bind(this);
    this.getWatchedMovies()
    this.getUserMovies()
    // alert(this.state.watchedlist.length)
  }

  componentDidMount() {
    this.getUserMovies()
  }

  onRefresh = () => {
    this.setState({refreshing: true})
    this.getUserMovies()
    this.getWatchedMovies()
    this.setState({refreshing: false})
  }

  async getUserMovies() {
    GetUserProperty('email').then(value => {
      fetch(("http://146.169.45.140:8000/cinect_api/getswipedright?useremail="+value))
      .then(response => response.json())
      .then((responseJson) => {
        this.setState({watchlist: responseJson.data.reverse()})
      });
    });
  }

  async getWatchedMovies() {
    GetUserProperty('email').then(value => {
      fetch(("http://146.169.45.140:8000/cinect_api/getuserwatched?useremail="+value))
      .then(response => response.json())
      .then((responseJson) => {
        this.setState({watchedlist: responseJson.data.reverse()});
      });
    })
  }

  refreshWatchlist() {
    this.getUserMovies()
  }

  refreshWatchedlist() {
    this.getWatchedMovies()
  }

  watchlistOnPress = (posterpath, title, id, synopsis) => {
    this.props.navigation.navigate('WatchlistMovieScreen', {posterpath: posterpath, title: title, id: id, synopsis: synopsis, refresh: this.refreshWatchlist, refreshWatched: this.refreshWatchedlist});
  }

  render() {
    // this.getWatchedMovies()
    return (
      <View style={{flex:1}}>

        <ScrollView refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh}/>} scrollEventThrottle='16'>
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
                  <TouchableOpacity onPress={() => this.watchlistOnPress(movie.posterpath, movie.title, movie.key, movie.synopsis)}>
                    <WatchList imageUri={movie.posterpath}
                               name={movie.title} />
                  </TouchableOpacity>

                )
              })
              }
            </ScrollView>
          </View>
          
          
          <View style={{flex: 1, paddingTop: 20, flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={{fontSize: 24, fontWeight: '700', fontFamily: 'PT Sans Caption', color: '#463D3D', paddingHorizontal: 20}}>
              Movies I've watched
            </Text>
          </View>

          <View style={{height:250, marginTop:20}}>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              style={{marginLeft:20}}>

              {this.state.watchedlist.map(movie => {
                return (
                  // alert('here'),
                  <TouchableOpacity onPress={() => this.watchlistOnPress(movie.posterpath, movie.title, movie.key, movie.synopsis)}>
                    <WatchList imageUri={movie.posterpath}
                               name={movie.title} />
                  </TouchableOpacity>

                )
              })
              }
            </ScrollView>
          </View>

          {/* <View style={{marginTop:10}}>
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

          </View> */}

        </ScrollView>
      </View>
    );
  }
}

const MoviesScreenNavigator = createStackNavigator(
{
  Movies: {
    screen: MoviesScreen
  },
  WatchlistMovieScreen: {
    screen: WatchlistMovieScreen
  }
},
{
  initialRouteName: 'Movies',
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
