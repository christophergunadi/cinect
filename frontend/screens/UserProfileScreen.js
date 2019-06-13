import React, {Component} from 'react';
import {Text, View, Image, StyleSheet, ScrollView} from 'react-native';

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
        <View style={{alignItems: 'center', paddingTop: 50, justifyContent: 'center'}}>
        <LottieView
              source={require('../assets/animations/loading.json')}
              autoPlay={true} loop={true}
              style={{width: 150, height: 150, justifyContent:'center'}}
        />
        </View>
      )
    } else {
    return (
      <ScrollView style={{paddingLeft: 30, paddingTop: 15, paddingRight: 30}}>
          <View style={{flexDirection:'row', paddingBottom: 20}}>
            <Image source={{uri: this.props.navigation.getParam('picture')}} 
              style={{width: 45, height: 45, borderRadius: 23, paddingTop: 10}}/>
            <Text style={styles.title}>{this.props.navigation.getParam('name')}</Text>
          </View>
        <View style={{flexDirection: 'row', paddingBottom: 12}}>
          <Text style={{fontFamily: 'PT_Sans-Caption-Bold', color: 'black', fontSize: 18}}>Movies watched:</Text>
          <Text style={{fontFamily: 'PT_Sans-Caption-Regular', fontSize: 18}}> {this.state.moviesWatched}</Text>
        </View>
        <Text style={{fontFamily: 'PT_Sans-Caption-Bold', fontSize: 20, color: 'black'}}>Ratings</Text>
        {this.state.ratedMovies.map((rating) => {
          return (
            <View style={{paddingTop: 7}}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={styles.movietitleStyle}>{rating.movieTitle}</Text>      
              <Rating imageSize={20} readonly startingValue={rating.stars}/>  
              </View>    
              <Text style={styles.commentStyle}>"{rating.comment}"</Text>  
            </View>
          )
        })}
      </ScrollView>
    );
      }
  }
}

const styles = StyleSheet.create({
  title: {
    fontFamily: 'PT_Sans-Caption-Bold',
    fontSize: 30,
    color: '#463D3D',
    marginVertical: 5,
    marginBottom: 10,
    paddingLeft: 12,
  },
  commentStyle: {
    fontStyle: 'italic',
    fontSize: 14,
    paddingTop: 4,
  },
  movietitleStyle: {
    fontFamily: 'PT_Sans-Caption-Bold',
    fontSize: 15,
    color: 'black',
  },
})