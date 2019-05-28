import React, {Component} from 'react';
import {Button, StyleSheet, Text, View, Animated, Dimensions, Image, PanResponder } from 'react-native';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

const Movies = [
  { uri: require('../assets/movieposters/movie1.jpg') },
  { uri: require('../assets/movieposters/movie2.jpg') },
  { uri: require('../assets/movieposters/movie3.jpg') },
]

export default class HomeScreen extends React.Component {

  // componentWillMount() {
  //   this.PanResponder = PanResponder.create({
  //     onStart
  //   })
  // }

  renderMovies = () => {

    return Movies.map((item, i) => {
      return (
        <Animated.View key={i} 
          style={{ height: SCREEN_HEIGHT - 120, width: SCREEN_WIDTH, padding: 10, position: 'absolute'}}>
          <Image
            style={{ flex: 1, height: null, width: null, resizeMode: 'cover', 
            borderRadius: 20 }}
            source={item.uri} />
        </Animated.View>
      )
    }).reverse()

    
  }

  render() {
    return (
      <View style={{ flex: 1 }}>

        <View style={{ flex: 1 }}>
          {this.renderMovies()}
        </View>

        <View style={{ height: 60 }}>

        </View>
      </View>
    );
  }
}
