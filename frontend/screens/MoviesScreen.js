import React, {Component} from 'react';
import {Button, Text, View, StyleSheet, ScrollView, Image, FlatList} from 'react-native';

import {createBottomTabNavigator, createStackNavigator, createAppContainer, BottomTabBar} from 'react-navigation'

import SettingsScreen from './SettingsScreen'
import UserProfileScreen from './UserProfileScreen'
import Watchlist from './MoviesScreen/Watchlist'
import WatchedMovies from './MoviesScreen/WatchedMovies'
// import { FlatList } from 'react-native-gesture-handler';
import WatchList from './MoviesScreen/Watchlist';

var FBLoginButton = require('../components/FBLoginButton');

export default class MoviesScreen extends React.Component {
  render() {
    return (
      <View style={{flex:1}}>

        <ScrollView
         scrollEventThrottle='16'>
         <View style={{flex: 1, paddingTop: 20, flexDirection: 'row', justifyContent: 'space-between'}}>
           <Text style={{fontSize: 24, fontWeight: '700', fontFamily: 'PT Sans Caption', color: '#463D3D', paddingHorizontal: 20}}>
             My Watchlist
           </Text>
           <FBLoginButton />
        </View>
        <View style={{flex: 1, paddingTop: 20}}>
           <View style={{height:220, marginTop:10}}>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              style={{marginLeft:20}}>

              <FlatList
                data={[
                  {key: '299537',
                   imageUri: 'https://image.tmdb.org/t/p/w500/AtsgWhDnHTq68L0lLsUrCnM7TjG.jpg',
                   name: 'Detective Pikachu'},
                   {key: '99537',
                   imageUri: 'https://image.tmdb.org/t/p/w500/AtsgWhDnHTq68L0lLsUrCnM7TjG.jpg',
                   name: 'Detective Pikachu'},
                   {key: '29937',
                   imageUri: 'https://image.tmdb.org/t/p/w500/AtsgWhDnHTq68L0lLsUrCnM7TjG.jpg',
                   name: 'Detective Pikachu'},
                   {key: '2937',
                   imageUri: 'https://image.tmdb.org/t/p/w500/AtsgWhDnHTq68L0lLsUrCnM7TjG.jpg',
                   name: 'Detective Pikachu'},
                  // {key: 'secondmovie',
                  //  imageUri: require('../assets/pikachu.jpg'),
                  //  name: 'Detective Pikachu'},
                  // {key: 'thirdmovie',
                  //  imageUri: require('../assets/pikachu.jpg'),
                  //  name: 'Detective Pikachu'},
                ]}
                extraData={this.state}
                horizontal={true}
                renderItem={({item}) => 
                // <Image source={{uri:item.imageUri}}/>}
                <WatchList imageUri={item.imageUri}
                           name={item.name}/>}
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
