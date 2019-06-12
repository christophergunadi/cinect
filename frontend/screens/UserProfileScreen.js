import React, {Component} from 'react';
import {Text, View} from 'react-native';

import MainStylesheet from '../styles/MainStylesheet';
import WatchlistMovieScreen from './WatchedlistMovieScreen';

export default class UserProfileScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      moviesWatched: 0,
      ratings: [], // each rating is in the format {moviename: xx, stars: x, comment: xx}
    }
  }

  componentDidMount() {

  }

  render() {
    return (
      <View style={{paddingLeft: 30, paddingTop: 15}}>
        <Text style={MainStylesheet.title}>{this.props.navigation.getParam('name')}</Text>
        <View style={{flexDirection: 'row', paddingBottom: 12}}>
          <Text style={{fontFamily: 'PT_Sans-Caption-Bold', color: 'black'}}>Movies watched:</Text>
          <Text style={{fontFamily: 'PT_Sans-Caption-Regular'}}> {this.state.moviesWatched}</Text>
        </View>
        <Text style={{fontFamily: 'PT_Sans-Caption-Bold', fontSize: 16, color: 'black'}}>Ratings</Text>
      </View>
    );
  }
}