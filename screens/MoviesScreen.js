import React, {Component} from 'react';
import {Button, Text, View, StyleSheet, ScrollView, Image} from 'react-native';

import {createBottomTabNavigator, createStackNavigator, createAppContainer, BottomTabBar} from 'react-navigation'

import SettingsScreen from './SettingsScreen'
import UserProfileScreen from './UserProfileScreen'
import Watchlist from './MoviesScreen/Watchlist'
import WatchedMovies from './MoviesScreen/WatchedMovies'

export default class MoviesScreen extends React.Component {
  render() {
    return (
      <View style={{flex:1}}>
        {/* <Button
          style={styles.button}
          title="Settings"
          onPress={() => this.props.navigation.navigate('Settings')}
        />
        <Button
          style={styles.button}
          title="My Profile"
          onPress={() => this.props.navigation.navigate('UserProfile')}
        /> */}

        <ScrollView 
         scrollEventThrottle='16'>
         <View style={{flex:1, paddingTop:20}}>
           <Text style={{fontSize:24, fontWeight:'700', fontFamily:'PT Sans Caption', paddingHorizontal:20}}>
             My Watchlist
           </Text>

           <View style={{height:220, marginTop:10}}>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              style={{marginLeft:20}}>
              <Watchlist imageUri={require('../assets/pikachu.jpg')}
                name="Detective Pikachu"/>  
              <Watchlist imageUri={require('../assets/pikachu.jpg')}
                name="Detective Pikachu"/>
              <Watchlist imageUri={require('../assets/pikachu.jpg')}
                name="Detective Pikachu"/>
            </ScrollView>
           </View>

         </View>


         <View style={{marginTop:40}}>
           <Text style={{fontSize:24, fontWeight:'700', fontFamily:'PT Sans Caption', paddingHorizontal:20}}>
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

// const MoviesScreenNavigator = createStackNavigator(
//   {
//     Movies: MoviesScreen,
//     Settings: SettingsScreen,
//     UserProfile: UserProfileScreen
//   },
//   {
//     initialRouteName: 'Movies'
//   }

// );

// export default createAppContainer(MoviesScreenNavigator);

// export default createBottomTabNavigator({
//   Settings: SettingsScreen,
//   UserProfile: UserProfileScreen
// })

const styles = StyleSheet.create({
  Text: {
    fontFamily:'PT Sans Caption'
  }
})