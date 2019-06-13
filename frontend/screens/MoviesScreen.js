import React, {Component} from 'react';
import {Button, Dimensions, Text, View, StyleSheet, ScrollView, Image, FlatList, TouchableOpacity, RefreshControl, Animated} from 'react-native';
import {createBottomTabNavigator, createStackNavigator, createAppContainer, BottomTabBar, withNavigationFocus} from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import {SearchBar} from 'react-native-elements';

import UserProfileScreen from './UserProfileScreen';
import Watchlist from './MoviesScreen/Watchlist';
import WatchlistMovieScreen from './WatchlistMovieScreen';
import WatchedlistMovieScreen from './WatchedlistMovieScreen';
import WatchedMovies from './MoviesScreen/WatchedMovies';
import WatchList from './MoviesScreen/Watchlist';
import SearchedMovieScreen from './SearchedMovieScreen';
import SettingsScreen from './SettingsScreen';
import {GetUserProperty} from '../Helpers';
import SearchMovieModal from '../components/SearchMovieModal';

var windowWidth = Dimensions.get('window').width;

class MoviesScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      watchlist: [],
      watchedlist: [],
      refreshing: false,
      searching: false,
      searchresults: [],
      searchBarWidth: new Animated.Value(0)
    }
    this.getUserMovies = this.getUserMovies.bind(this);
    this.getWatchedMovies = this.getWatchedMovies.bind(this);
    this.refreshWatchlist = this.refreshWatchlist.bind(this);
    this.refreshWatchedlist = this.refreshWatchedlist.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.updateSearch = this.updateSearch.bind(this);
    this.shrinkSearchBar = this.shrinkSearchBar.bind(this);
    this.expandSearchBar = this.expandSearchBar.bind(this);
    this.renderSettingsIcon = this.renderSettingsIcon.bind(this);
    this.getWatchedMovies()
    this.getUserMovies()
  }

  componentDidMount() {
    this.getUserMovies()
  }

  onRefresh = () => {
    this.setState({refreshing: true})
    this.getUserMovies()
    this.getWatchedMovies()
    this.setState({refreshing: false})
  }

  async getUserMovies() {
    GetUserProperty('email').then(value => {
      fetch(("http://146.169.45.140:8000/cinect_api/getswipedright?useremail="+value))
      .then(response => response.json())
      .then((responseJson) => {
        this.setState({watchlist: responseJson.data.reverse()})
      });
    });
  }

  async getWatchedMovies() {
    GetUserProperty('email').then(value => {
      fetch(("http://146.169.45.140:8000/cinect_api/getuserwatched?useremail="+value))
      .then(response => response.json())
      .then((responseJson) => {
        this.setState({watchedlist: responseJson.data.reverse()});
      });
    })
  }

  refreshWatchlist() {
    this.getUserMovies()
  }

  refreshWatchedlist() {
    this.getWatchedMovies()
  }

  watchlistOnPress = (posterpath, title, id, synopsis, rating) => {
    this.props.navigation.navigate('WatchlistMovieScreen', {posterpath: posterpath, title: title, id: id, synopsis: synopsis, 
      rating: rating, refresh: this.refreshWatchlist, refreshWatched: this.refreshWatchedlist, padTop: 30});
  }

  watchedlistOnPress = (posterpath, title, id, synopsis) => {
    this.props.navigation.navigate('WatchedlistMovieScreen', {posterpath: posterpath, title: title, id: id, synopsis: synopsis})
  }

  searchMovies = (query) => {
    fetch("http://146.169.45.140:8000/cinect_api/search?query="+query)
      .then(response => response.json())
      .then((responseJson) => {
        this.setState({searchresults: responseJson.data}, () => {
          this.refs.searchResultsModal.updateResultsModal(this.state.searchresults);
        });
      });
  }

  updateSearch = (search) => {
    this.setState({search: search}, () => {
      if (search != '') {
        this.expandSearchBar();
        this.searchMovies(search);
        this.refs.searchResultsModal.showResultsModal();
      } else {
        this.shrinkSearchBar();
        this.refs.searchResultsModal.updateResultsModal([]);
        this.refs.searchResultsModal.hideResultsModal();
      }
    });
  }

  onSearchBarFocus = () => {
    this.expandSearchBar();
    this.refs.searchResultsModal.showResultsModal();
  }

  expandSearchBar = () => {
    Animated.timing(this.state.searchBarWidth, {
      toValue: 1,
      duration: 500
    }).start();
    this.setState({
      searching: true
    });
  }

  shrinkSearchBar = () => {
    Animated.timing(this.state.searchBarWidth, {
      toValue: 0,
      duration: 500
    }).start();
    this.setState({
      searching: false
    })
  }

  _onAddGroupButton() {
    this.refs.newGroupModal.showAddModal();
  }

  renderSettingsIcon = () => {
    if (!this.state.searching) {
      return (
        <View style={{position: 'absolute', bottom: 0, right: 0, marginBottom: 20, marginRight: 23}}>
          <TouchableOpacity style={{backgroundColor: '#ff044e', opacity: 50, padding: 10, borderRadius: 25, width: 50, height: 50, alignItems: 'center', elevation: 8}}
            onPress={() => this.props.navigation.navigate('Settings')}>
            <Icon name='md-settings' style={{color: 'white'}} size={30}></Icon>
          </TouchableOpacity>
        </View>
      )
    }
  }

  render() {
    const barWidth = this.state.searchBarWidth.interpolate(
      {
        inputRange: [0, 1],
        outputRange: [windowWidth/2, windowWidth - 40]
      }
    );
    const textWidth = this.state.searchBarWidth.interpolate(
      {
        inputRange: [0, 1],
        outputRange: [windowWidth/2 - 15, 0]
      }
    )
    return (
      <View style={{flex:1}}>
        <SearchMovieModal ref={'searchResultsModal'} navigate={this.props.navigation.navigate} refreshWatchlist={this.refreshWatchlist} refreshWatchedlist={this.refreshWatchedlist} shrinkSearchBar={this.shrinkSearchBar}/>
        <ScrollView style={{zIndex: 2}} refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh}/>} scrollEventThrottle='16'>
         <View style={{flex: 1, paddingTop: 30, flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'nowrap'}}>
           <Animated.View style={{width: textWidth, height: 40, overflow: 'hidden'}}>
             <Text style={{fontSize: 24, fontWeight: '700', fontFamily: 'PT Sans Caption', color: '#463D3D', paddingHorizontal: 20, paddingTop: 8}}>
               My Watchlist
             </Text>
           </Animated.View>
           <Animated.View style={{width:barWidth, height:32, marginRight: 20}}>
             <SearchBar platform="android"
               placeholder="Search for a movie..."
               containerStyle={{height: 32, zIndex: 5, backgroundColor: 'transparent'}}
               inputStyle={{marginLeft: 3, marginRight: 0, fontFamily: 'PT Sans Caption', fontSize: 12}}
               inputContainerStyle={{backgroundColor:'#ededed', borderRadius: 20, height: 32, zIndex: 5}}
               onChangeText={this.updateSearch}
               value={this.state.search}
               onFocus={this.onSearchBarFocus}
               onCancel={this.shrinkSearchBar}
               returnKeyType='search'/>
          </Animated.View>

          </View>

          </ScrollView>
        <ScrollView refreshControl={<RefreshControl progressViewOffset={-80} refreshing={this.state.refreshing} onRefresh={this.onRefresh}/>} scrollEventThrottle='16'>


          <View style={{height:250, marginTop:20}}>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              style={{marginLeft:20}}>

              {this.state.watchlist.map(movie => {
                return (
                  <TouchableOpacity onPress={() => this.watchlistOnPress(movie.posterpath, movie.title, movie.key, movie.synopsis, movie.rating)}>
                    <WatchList imageUri={movie.posterpath}
                               name={movie.title} />
                  </TouchableOpacity>

                )
              })
              }
            </ScrollView>
          </View>

          <View style={{flex: 1, paddingTop: 20, flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={{fontSize: 24, fontWeight: '700', fontFamily: 'PT Sans Caption', color: '#463D3D', paddingHorizontal: 20}}>
              Movies I've watched
            </Text>
          </View>

          <View style={{height:250, marginTop:20}}>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              style={{marginLeft:20}}>

              {this.state.watchedlist.map(movie => {
                return (
                  <TouchableOpacity onPress={() => this.watchedlistOnPress(movie.posterpath, movie.title, movie.key, movie.synopsis)}>
                    <WatchList imageUri={movie.posterpath}
                               name={movie.title} />
                  </TouchableOpacity>

                )
              })
              }
            </ScrollView>
            {this.renderSettingsIcon()}
          </View>

        </ScrollView>
      </View>
    );
  }
}

const MoviesScreenNavigator = createStackNavigator(
{
  Movies: {
    screen: MoviesScreen
  },
  WatchlistMovieScreen: {
    screen: WatchlistMovieScreen
  },
  WatchedlistMovieScreen: {
    screen: WatchedlistMovieScreen
  },
  SearchedMovieScreen: {
    screen: SearchedMovieScreen
  },
  Settings: {
    screen: SettingsScreen
  },
},
{
  initialRouteName: 'Movies',
  headerMode: 'none',
  navigationOptions: {
    headerVisible: false
  }
}
)


const styles = StyleSheet.create({
  Text: {
    fontFamily:'PT Sans Caption'
  }
})

export default createAppContainer(MoviesScreenNavigator);
