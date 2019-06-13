import React, {Component} from 'react';
import {Text, View} from 'react-native';

import MainStylesheet from '../styles/MainStylesheet';
import WatchlistMovieScreen from './WatchedlistMovieScreen';
import {Rating, AirbnbRating} from 'react-native-elements';
import LottieView from 'lottie-react-native';

export default class UserProfileScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      moviesWatched: 0,
      ratedMovies: [], // each rating is in the format {moviename: xx, stars: x, comment: xx}
      loading: true,
    }
  }

  componentDidMount() {
    this.getUserProfile();
  }


  getUserProfile = () => {
    fetch("http://146.169.45.140:8000/cinect_api/getuserprofile?facebookid="
     + this.props.navigation.getParam('facebookid'))
    .then(response => response.json())
    .then((responseJson) => {
        this.setState ({
          ratedMovies: responseJson.ratedMovies,
          moviesWatched: responseJson.count,
          loading: false,
      })
    }).catch((error) => {
      console.error(error);
    });
  }

  render() {
    if (this.state.loading) {
      return (
        <View style={{alignItems: 'center', paddingTop: 15}}>
        <LottieView
              source={require('../assets/animations/loading.json')}
              autoPlay={true} loop={true}
              style={{width: 150, height: 150, justifyContent:'center'}}
        />
        </View>
      )
    } else {
    return (
      <View style={{paddingLeft: 30, paddingTop: 15}}>
        <Text style={MainStylesheet.title}>{this.props.navigation.getParam('name')}</Text>
        <View style={{flexDirection: 'row', paddingBottom: 12}}>
          <Text style={{fontFamily: 'PT_Sans-Caption-Bold', color: 'black'}}>Movies watched:</Text>
          <Text style={{fontFamily: 'PT_Sans-Caption-Regular'}}> {this.state.moviesWatched}</Text>
        </View>
        <Text style={{fontFamily: 'PT_Sans-Caption-Bold', fontSize: 16, color: 'black'}}>Ratings</Text>
        {this.state.ratedMovies.map((rating) => {
          return (
            <View>
              <Text>{rating.movieTitle}</Text>      
              <Rating imageSize={20} readonly startingValue={rating.stars}/>      
              <Text>"{rating.comment}"</Text>  
            </View>
          )
        })}
      </View>
    );
      }
  }
}