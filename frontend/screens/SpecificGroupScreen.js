import React, {Component} from 'react';
import {Dimensions, TouchableOpacity, Image, FlatList, Button, StyleSheet, Text, View, ScrollView} from 'react-native';

import MainStylesheet from '../styles/MainStylesheet';
import SuggestedMovieModal from '../components/SuggestedMovieModal';
import WatchList from './MoviesScreen/Watchlist';

export default class SpecificGroupScreen extends Component {

  constructor(props) {
    super(props);
    this.selectMovieForGroup = this.selectMovieForGroup.bind(this);
    this.state = {
      suggestedMovies: [],
      movieTitle: "2342",
      posterPath: "123",
    }
  }

  selectMovieForGroup = (grpname) => {
    fetch("http://146.169.45.140:8000/cinect_api/suggest?groupid=" + this.props.navigation.getParam('groupid'))
    .then(response => response.json())
    .then((responseJson) => {
      this.state.suggestedMovies.push({movieTitle: responseJson.movieTitle, 
        posterPath: "https://image.tmdb.org/t/p/w500/" + responseJson.posterPath});
      this.setState ({
        movieTitle: responseJson.movieTitle,
        posterPath: responseJson.posterPath,
      })
      this.refs.suggestedMovieModal.openMovieModal();
    }).catch((error) => {
      console.error(error);
    });
  }

  render() {
    return (
      <View style={MainStylesheet.container}>
        <Text style={MainStylesheet.title}>{this.props.navigation.getParam('groupname')}</Text>
        <Text>Members</Text>

        <View style={{flex: 1, paddingTop: 20, flexDirection: 'row', justifyContent: 'space-between'}}>
           <Text style={{fontSize: 24, fontWeight: '700', fontFamily: 'PT Sans Caption', color: '#463D3D', paddingHorizontal: 20}}>
             What to watch
           </Text>
        </View>
        <View style={{flex: 1, paddingTop: 20}}>
           <View style={{height:220, marginTop:10}}>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              style={{marginLeft:20}}>

              {this.state.suggestedMovies.map(movie => {
                return (
                  <WatchList imageUri={movie.posterPath}
                             name={movie.movieTitle} />
                )
              })}

            </ScrollView>
          </View>
        </View> 

        <View style={{ justifyContent: 'flex-end', alignItems: 'center', bottom: 0, flex: 1 }}>
          <TouchableOpacity style={styles.suggestButton} 
                 onPress={() => this.selectMovieForGroup(this.props.navigation.getParam('groupname'))}>
            <Text style={{ fontFamily: 'PT_Sans-Caption-Regular', color: '#000000' }}>Suggest a movie</Text>
          </TouchableOpacity>
        </View>

        <Text>{this.state.title}</Text>
        <SuggestedMovieModal ref="suggestedMovieModal" movieTitle={this.state.movieTitle} posterPath={this.state.posterPath} ></SuggestedMovieModal>

      </View>
    )
  }

}

const styles = StyleSheet.create({
  suggestButton: {
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fc9797',
    height: 35,
    width: Dimensions.get('window').width / 2,
  },
});
