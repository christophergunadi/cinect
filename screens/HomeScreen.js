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

  constructor() {
    super();

    this.position = new Animated.ValueXY();
    this.state = {
      currentIndex: 0
    }
    this.rotate = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH/2, 0, SCREEN_WIDTH/2],
      outputRange: ['-10deg', '0deg', '10deg'],
      extrapolate: 'clamp'
    })

    this.rotateAndTranslate = {
      transform: [{
        rotate: this.rotate
      },
      ...this.position.getTranslateTransform() 
    ]
    }

    this.likeOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH/2, 0, SCREEN_WIDTH/2],
      outputRange: [0, 0, 1],
      extrapolate: 'clamp'
    })

    this.hateOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH/2, 0, SCREEN_WIDTH/2],
      outputRange: [1, 0, 0],
      extrapolate: 'clamp'
    })

    this.nextCardOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH/2, 0, SCREEN_WIDTH/2],
      outputRange: [1, 0, 1],
      extrapolate: 'clamp'
    })

    this.nextCardScale = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH/2, 0, SCREEN_WIDTH/2],
      outputRange: [1, 0.8, 1],
      extrapolate: 'clamp'
    })
  }

  componentWillMount() {
    this.PanResponder = PanResponder.create({
      onStartShouldSetPanResponder:(evt, gestureState) => true,
      onPanResponderMove:(evt, gestureState) => {
        this.position.setValue({x: gestureState.dx, y: gestureState.dy})
      },
      onPanResponderRelease:(evt, gestureState) => {
        if (gestureState.dx > 120) {
          Animated.spring(this.position, {
            toValue: {x: SCREEN_WIDTH + 100, y: gestureState.dy}
          }).start(() => {
            this.setState({currentIndex: this.state.currentIndex + 1}, () => {
              this.position.setValue({x: 0, y: 0})
            })
          })
        } else if (gestureState.dx < -120) {
          Animated.spring(this.position, {
            toValue: {x: -(SCREEN_WIDTH + 100), y: gestureState.dy}
          }).start(() => {
            this.setState({currentIndex: this.state.currentIndex + 1}, () => {
              this.position.setValue({x: 0, y: 0})
            })
          })
        } else {
          Animated.spring(this.position, {
            toValue: {x: 0, y: 0},
            friction: 4
          }).start()
        }

      }
    })
  }

  renderMovies = () => {

    return Movies.map((item, i) => {
      if (i < this.state.currentIndex) {
        return null;
      } else if (i == this.state.currentIndex) {
        return (
          <Animated.View 
            {...this.PanResponder.panHandlers}
            key={i} 
            style={[this.rotateAndTranslate, 
            { height: SCREEN_HEIGHT - 120, width: SCREEN_WIDTH, padding: 10, position: 'absolute'}]}>

            <Animated.View style={{ opacity: this.likeOpacity, transform: [{rotate: '-30deg'}], position: 'absolute', top: 50, left: 40, zIndex: 1000 }}>
              <Text
                style={{borderWidth: 1, borderColor: 'white', color: 'white', 
                fontSize: 32, fontWeight: '800', padding: 10}}>
                LIKE
              </Text>
            </Animated.View>

            <Animated.View style={{ opacity: this.hateOpacity, transform: [{rotate: '30deg'}], position: 'absolute', top: 50, right: 40, zIndex: 1000 }}>
              <Text
                style={{borderWidth: 1, borderColor: 'white', color: 'white', 
                fontSize: 32, fontWeight: '800', padding: 10}}>
                HATE
              </Text>
            </Animated.View>

            <Image
              style={{ flex: 1, height: null, width: null, resizeMode: 'cover', 
              borderRadius: 20 }}
              source={item.uri} />
          </Animated.View>
        )
      } else {
        return (
          <Animated.View 
            key={i} 
            style={[{ opacity: this.nextCardOpacity, transform: [{scale: this.nextCardScale}],
              height: SCREEN_HEIGHT - 120, width: SCREEN_WIDTH, padding: 10, 
              position: 'absolute'}]}>
            <Image
              style={{ flex: 1, height: null, width: null, resizeMode: 'cover', 
              borderRadius: 20 }}
              source={item.uri} />
          </Animated.View>
        )
      }

      
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
};