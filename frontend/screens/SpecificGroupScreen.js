import React, {Component} from 'react';
import {Dimensions, TouchableOpacity, Image, FlatList, Button, StyleSheet, Text, View, ScrollView} from 'react-native';
import {createStackNavigator, createAppContainer} from 'react-navigation';

import GroupMovieScreen from './GroupMovieScreen';

import MainStylesheet from '../styles/MainStylesheet';

class SpecificGroupScreen extends Component {
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

  watchlistOnPress = (posterpath, title, synopsis) => {
    this.props.navigation.navigate('GroupMovie', {posterpath: posterpath, title: title, synopsis: synopsis});
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
      <ScrollView>
      <View style={MainStylesheet.container}>
        <Text style={MainStylesheet.title}>{this.props.navigation.getParam('groupname')}</Text>
        <Text style={{fontSize: 24, fontWeight: '700', fontFamily: 'PT Sans Caption', color: '#463D3D'}}>Members</Text>
          {
            this.state.members.map(member => {
              return (
                <View style={{paddingTop: 20, flexDirection: 'row', justifyContent: 'space-between'}}>
                  <Image source={require('../assets/img/tempprofileicon.png')} style={{width: 20, height: 20}}/>
                  <Text style={{fontSize: 15, fontWeight: '700', fontFamily: 'PT Sans Caption',}}>{member.name}</Text>
                </View>
              )
          })}
        <View style={{paddingTop: 30}}>
           <Text style={{fontSize: 24, fontWeight: '700', fontFamily: 'PT Sans Caption', color: '#463D3D'}}>
             What to watch
           </Text>
           <View style={{height:270, marginTop:10}}>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}>

              {this.state.suggestedMovies.map(movie => {
                return (
                  <View style={{flex:1, height:270, width:130, marginRight:20}}>
                    <TouchableOpacity onPress={() => this.watchlistOnPress(movie.posterPath, movie.movieTitle, movie.synopsis)}>
                      <View style={{ height:200}}>
                        <Image source={{uri: "https://image.tmdb.org/t/p/w500/"+ movie.posterPath}}
                          style={{flex:1, width:null, height:null, resizeMode:'cover', borderRadius:5}}/>
                      </View>
                    </TouchableOpacity>
                    <View style={{flexDirection: 'column'}}>
                      <Text style={{paddingTop:5}}>{movie.movieTitle}</Text>
                      <View style={{paddingTop:5, flexDirection: 'row'}}>
                        <Image source={require('../assets/img/count.png')} style={{width: 14, height: 14, marginTop: 3}}/>
                        <Text style={{paddingLeft: 10, fontSize: 13, fontWeight: '700', fontFamily: 'PT Sans Caption',}}>{movie.count}</Text>
                      </View>
                    </View>
                  </View>
                )
              })}

            </ScrollView>
          </View>
        </View>
      </View>
      </ScrollView>
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

const SpecificGroupsScreenNavigator = createStackNavigator(
{
  SpecificGroup: {
    screen: SpecificGroupScreen
  },
  GroupMovie: {
    screen: GroupMovieScreen
  }
},
{
  initialRouteName: 'SpecificGroup',
  headerMode: 'none',
  navigationOptions: {
    headerVisible: false
  }
}
)

export default createAppContainer(SpecificGroupsScreenNavigator);
