import React, {Component} from 'react';
import {Button, StyleSheet, Text, View, Animated, Dimensions, Image, PanResponder, Alert } from 'react-native';

import {GetUserProperty} from '../Helpers';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

const Movies = [
  { uri : 'https://image.tmdb.org/t/p/w500/AtsgWhDnHTq68L0lLsUrCnM7TjG.jpg', id: '299537'},
  // { uri : 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg'},
  // { uri : 'https://image.tmdb.org/t/p/w500/wgQ7APnFpf1TuviKHXeEe3KnsTV.jpg'},
  // { uri: require('../assets/movieposters/movie1.jpg') },
  // { uri: require('../assets/movieposters/movie2.jpg') },
  // { uri: require('../assets/movieposters/movie3.jpg') },
]

export default class HomeScreen extends React.Component {

  constructor() {
    super();

    this.addSwipedRightMovie = this.addSwipedRightMovie.bind(this);

    this.position = new Animated.ValueXY();
    this.state = {
      currentIndex: 0,
      currentMovie: {},
      nextMovie: {}
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

  fetchMovieFromApi = () => {
    fetch("http://146.169.45.140:8000/cinect_api/user")
    .then(response => response.json())
    .then((responseJson) => {
      Movies.push({ uri: ('https://image.tmdb.org/t/p/w500' + responseJson.poster_path), id: responseJson.id })
    })
  }

  addSwipedRightMovie = (id) => { //send swiped right movie id to cinect_api to add to populate database
    let formData = new FormData();
    GetUserProperty('email').then(value => {
      if (!value) {
        alert("Please log in or sign up to start swiping!")
      } else {
        formData.append('email', value)
        formData.append('movieid', id);
        fetch("http://146.169.45.140:8000/cinect_api/addswipedright", {
          method: 'POST',
          body: formData
        })
        .then(response => response.json())
      }
    });
  }

  fetchMovieById = (id) => {
    fetch(("http://146.169.45.140:8000/cinect_api/addswipedright?id=" + id))
    .then(response => response.json())
    .then((responseJson) => {
      alert(responseJson.movieTitle)
      // this.props.navigator.navigate()
    })
  }

  // replaceMovieInList = (i) => {
  //   fetch("http://146.169.45.140:8000/cinect_api/user")
  //   .then(response => response.json())
  //   .then((responseJson) => {
  //     Movies.push({ uri: 'https://image.tmdb.org/t/p/w500' + responseJson.poster_path })
  //   })
  // }

  componentWillMount() {
    for (var i = 0; i < 3; i++) {
      this.fetchMovieFromApi();
    }

    this.PanResponder = PanResponder.create({
      onStartShouldSetPanResponder:(evt, gestureState) => true,
      onPanResponderMove:(evt, gestureState) => {
        this.position.setValue({x: gestureState.dx, y: gestureState.dy})
      },
      onPanResponderRelease:(evt, gestureState) => {
        //swipe right
        if (gestureState.dx > 120) {
          Animated.spring(this.position, {
            toValue: {x: SCREEN_WIDTH + 100, y: gestureState.dy}
          }).start(() => {
            this.addSwipedRightMovie(Movies[this.state.currentIndex].id.toString());

            this.setState({currentIndex: this.state.currentIndex + 1}, () => {
              this.position.setValue({x: 0, y: 0})
            })
          })
          this.fetchMovieFromApi();

        } else if (gestureState.dx < -120) {
          //swipe left
          Animated.spring(this.position, {
            toValue: {x: -(SCREEN_WIDTH + 100), y: gestureState.dy}
          }).start(() => {
            this.setState({currentIndex: this.state.currentIndex + 1}, () => {
              this.position.setValue({x: 0, y: 0})
            })
          })
          this.fetchMovieFromApi();

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
            style={[this.rotateAndTranslate, styles.currentCard]}>

            <Animated.View style={[{ opacity: this.likeOpacity }, styles.likeSign]}>
              <Text
                style={styles.signText}>
                LIKE
              </Text>
            </Animated.View>

            <Animated.View style={[{ opacity: this.hateOpacity }, styles.hateSign]}>
              <Text
                style={styles.signText}>
                NOPE
              </Text>
            </Animated.View>

            <Image
              style={{ flex: 1, height: null, width: null, resizeMode: 'cover',
              borderRadius: 20 }}
              source={item} />
          </Animated.View>
        )
      } else {
        return (
          <Animated.View
            key={i}
            style={[{ opacity: this.nextCardOpacity, transform: [{scale: this.nextCardScale}] },
                      styles.nextCard]}>
            <Image
              style={{ flex: 1, height: null, width: null, resizeMode: 'cover',
              borderRadius: 20 }}
              source={item} />
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

const styles = StyleSheet.create({
  currentCard: {
    height: SCREEN_HEIGHT - 140,
    width: SCREEN_WIDTH,
    padding: 10,
    position: 'absolute'
  },
  nextCard: {
    height: SCREEN_HEIGHT - 140,
    width: SCREEN_WIDTH,
    padding: 10,
    position: 'absolute'
  },
  likeSign: {
    transform: [{rotate: '-30deg'}],
    position: 'absolute',
    top: 50,
    left: 40,
    zIndex: 1000
  },
  hateSign: {
    transform: [{rotate: '30deg'}],
    position: 'absolute',
    top: 50,
    right: 40,
    zIndex: 1000
  },
  signText: {
    borderWidth: 3,
    borderColor: 'white',
    color: 'white',
    fontSize: 32,
    fontWeight: '900',
    padding: 10
  },
});
