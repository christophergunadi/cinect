import React, {Component} from 'react';
import {Dimensions, TouchableOpacity, Image, FlatList, Button, StyleSheet, Text, View} from 'react-native';

import MainStylesheet from '../styles/MainStylesheet';
import SuggestedMovieModal from '../components/SuggestedMovieModal';

export default class SpecificGroupScreen extends Component {

  constructor(props) {
    super(props);
    this.selectMovieForGroup = this.selectMovieForGroup.bind(this);
    this.state = {
      movieTitle: "2342",
      posterPath: "123",
    }
  }

  selectMovieForGroup = (grpname) => {
    fetch("http://146.169.45.140:8000/cinect_api/suggest?groupid=1")
    .then(response => response.json())
    .then((responseJson) => {
      this.setState ({
        movieTitle: responseJson.title,
        posterPath: responseJson.poster_path
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
        <Text>Now we need to go to database the fetch users lol</Text>


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
