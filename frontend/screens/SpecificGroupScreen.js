import React, {Component} from 'react';
import {Dimensions, TouchableOpacity, Image, FlatList, Button, StyleSheet, Text, View, ScrollView} from 'react-native';

import MainStylesheet from '../styles/MainStylesheet';
import SuggestedMovieModal from '../components/SuggestedMovieModal';
import WatchList from './MoviesScreen/Watchlist';

export default class SpecificGroupScreen extends Component {
  constructor(props) {
    super(props);
    this.selectMovieForGroup = this.selectMovieForGroup.bind(this);
    this.getMembers = this.getMembers.bind(this);
    this.state = {
      suggestedMovies: [],
      members: [],
    }
  }

  componentDidMount() {
    this.selectMovieForGroup()
    this.getMembers()
  }

  selectMovieForGroup = () => {
    fetch("http://146.169.45.140:8000/cinect_api/suggest?groupid=" + this.props.navigation.getParam('groupid'))
    .then(response => response.json())
    .then((responseJson) => {
        this.setState ({
          suggestedMovies: responseJson.data,
      })
    }).catch((error) => {
      console.error(error);
    });
  }

  getMembers = () => {
    fetch("http://146.169.45.140:8000/cinect_api/getmembers?groupid=" + this.props.navigation.getParam('groupid'))
    .then(response => response.json())
    .then((responseJson) => {
        this.setState ({
          members: responseJson.data,
      })
    }).catch((error) => {
      console.error(error);
    });
  }


  render() {
    return (
      <View style={MainStylesheet.container}>
        <Text style={MainStylesheet.title}>{this.props.navigation.getParam('groupname')}</Text>
        <Text>Members</Text>
          {/* {
            this.state.members.map(member => {
              return (
                <View style={{ flexDirection: 'row' }}>
                  <Image source={require('../assets/img/tempprofileicon.png')} style={styles.profileicon}/>
                  <Text style={styles.groupName}>{member.groupname}</Text>
                </View>
              )
          })} */}
        <View style={{paddingTop: 20}}>
           <Text style={{fontSize: 24, fontWeight: '700', fontFamily: 'PT Sans Caption', color: '#463D3D'}}>
             What to watch
           </Text>
           <View style={{height:220, marginTop:10}}>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}>

              {this.state.suggestedMovies.map(movie => {
                return (
                  <View>
                    <WatchList imageUri={"https://image.tmdb.org/t/p/w500/"+ movie.posterPath}
                              name={movie.movieTitle} />
                    <Text>{movie.count}</Text>
                  </View>
                )
              })}

            </ScrollView>
          </View>
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
