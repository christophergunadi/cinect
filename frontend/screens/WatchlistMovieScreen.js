import React, {Component} from 'react';
import {Text, View, Image, Button, Dimensions, Linking, TouchableOpacity, StyleSheet, TouchableWithoutFeedback} from 'react-native';

import {GetUserProperty} from '../Helpers';
import OriginalSizeImage from '../components/OriginalSizeImage';
import {Rating} from 'react-native-elements';


import MainStylesheet from '../styles/MainStylesheet';
import { ScrollView } from 'react-native-gesture-handler';
import Modal from 'react-native-modalbox';
import {GraphRequest, GraphRequestManager } from 'react-native-fbsdk';

export default class WatchlistMovieScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            width: '100%',
            height: '80%',
            showingOn: [],
            friendsWhoAlsoLike: [],
            movieRatings: [], // each rating is in the format {moviename: xx, stars: x, comment: xx}
            loading: true,
        }
        this.renderStreamingAvailability = this.renderStreamingAvailability.bind(this);
    }

    componentDidMount() {
        this.getStreamingAvailability()
        this.getFriendsWhoAlsoLikeThis()
        this.getMovieRatings()
    }

    getMovieRatings() {
      GetUserProperty('email').then(email => {
        fetch("http://146.169.45.140:8000/cinect_api/getmovieratings?movieid="+ this.props.navigation.getParam('id')
          + "&email=" + email)
        .then(response => response.json())
        .then((responseJson) => {
          this.setState ({
            movieRatings: responseJson.movieRatings,
            loading: false,
          })
        }).catch((error) => {
          console.error(error);
        });
      })
    }

    renderNoFriendsRating = () => {
      if (this.state.movieRatings.length == 0) {
          return(<Text>No friends rated this movie yet! :(</Text>);
      }
  }

    getFriendsWhoAlsoLikeThis = () => {
      new GraphRequestManager().addRequest(
        new GraphRequest("/me/friends", null, this._getFriendsCallback,)).start();
    }

    _getFriendsCallback = (err, result) => {
      let formData = new FormData();
      formData.append('movieid', this.props.navigation.getParam('id'));
      var i;
      for (i = 0; i < result.data.length; i++) {
        formData.append('friendids', result.data[i].id)
        formData.append('friendnames', result.data[i].name)
      }

      fetch("http://146.169.45.140:8000/cinect_api/friendswholike", {
        method: 'POST',
        body: formData
      }).then(response => response.json())
      .then((responseJson) => {
        this.setState ({
          friendsWhoAlsoLike: responseJson.data,
        });
      })

    }

    showFriendsWhoAlsoLike = () => {

    }

    renderFriendsWhoAlsoLike = () => {
      if (this.state.friendsWhoAlsoLike.length == 0) {
        return (<View></View>)
      } else if (this.state.friendsWhoAlsoLike.length == 1) {
        return (
          <View style={{flex: 1, flexDirection: 'row', paddingBottom: 15}}>
            <Text style={{fontFamily: 'PT_Sans-Caption-Bold', color: 'black'}}>{this.state.friendsWhoAlsoLike[0]}</Text>
            <Text style={{paddingLeft: 4, color: 'black'}}>also wants to watch this</Text>
          </View>
        );
      } else {
        return (
        <View style={{flex: 1, flexDirection: 'row', paddingBottom: 15}}>
          <Text style={{fontFamily: 'PT_Sans-Caption-Bold', color: 'black'}}>{this.state.friendsWhoAlsoLike[0]}</Text>
          <Text style={{paddingLeft: 4, color: 'black'}}>and</Text>
          <TouchableOpacity onPress={() => this.refs.friendsWhoLikeModal.open()} style={{paddingLeft: 4, color: 'black'}}>
            <Text style={{fontFamily: 'PT_Sans-Caption-Bold', color: 'black'}}>{this.state.friendsWhoAlsoLike.length - 1} others</Text>
            </TouchableOpacity>
          <Text> want to watch this</Text>
        </View>
        )
      }
    }

    getUserEmail = async() => {
        userEmail = '';
        try {
          userEmail = await AsyncStorage.getItem('userEmail');
        } catch (error) {
          alert(error.message);
        }
        if (!userEmail) {
          // TODO: Improve what happens when you swipe without being logged in
          alert("Please log in or sign up to start swiping!")
        }
        return userEmail;
    }

    pressDeleteButton = (id) => {
        let formData = new FormData();
        GetUserProperty('email').then(value => {
        formData.append('email', value)
        formData.append('movieid', id);
        fetch("http://146.169.45.140:8000/cinect_api/deleteswipedright", {
            method: 'POST',
            body: formData
        })
        .then(this.props.navigation.getParam('refreshWatchlist'))
        .then(this.props.navigation.getParam('refresh'))
        .then(this.props.navigation.goBack())
        })
    }

    pressWatchedButton = (id) => {
        let formData = new FormData();
        GetUserProperty('email').then(value => {
        formData.append('email', value)
        formData.append('movieid', id);
        fetch("http://146.169.45.140:8000/cinect_api/presswatched", {
            method: 'POST',
            body: formData
        })
        .then(this.props.navigation.getParam('refreshWatched'))
        .then(this.props.navigation.getParam('refresh'))
        .then(this.props.navigation.goBack())
        })
    }

    getStreamingAvailability = () => {
        fetch("https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/lookup?term="+ this.props.navigation.getParam('title') +"&country=uk", {
          headers: new Headers({
            'X-RapidAPI-Host': 'utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com',
            'X-RapidAPI-Key':'10cd8edd93msh174b0f61d4ea30dp1361a6jsn1dddee813f67'
          })
        })
        .then(response => response.json())
        .then((responseJson) => {
          if (responseJson.results[0].name == this.props.navigation.getParam('title')) {
            sites = responseJson.results[0].locations
            for (let i = 0; i < sites.length; i++) {
              this.setState({
                showingOn: [...this.state.showingOn, {
                  url: sites[i].url,
                  logo: sites[i].icon,
                }]
              })
            }
          }
        });
        // this.setState({
        //   showingOn: [...this.state.showingOn, {
        //     url: 'https://www.netflix.com/title/80095314',
        //     logo: 'https://utellyassets7.imgix.net/locations_icons/utelly/black_new/Netflix.png?auto=compress&app_version=2977d84b-593d-4167-a904-57b1e6e814f1_2019-06-04&w=92',
        //   }, {
        //     url: null,
        //     logo: 'https://utellyassets7.imgix.net/locations_icons/utelly/black_new/Amazon.png?auto=compress&app_version=2977d84b-593d-4167-a904-57b1e6e814f1_2019-06-04&w=92',
        //   }, {
        //     url: null,
        //     logo: 'http://utellyassets7.imgix.net/locations_icons/utelly/live_tv_square/50d352abf0ca9f5798000383.jpg?auto=compress&app_version=2977d84b-593d-4167-a904-57b1e6e814f1_2019-06-04&w=92',
        //   }]
        // })
      }

    renderStreamingAvailability = () => {
      if (Object.keys(this.state.showingOn).length === 0) {
        return (
          <View style={{paddingBottom: 13}}>
            <Text>No streaming availability at this time.</Text>
          </View>
        )
      } else {
        alert(JSON.stringify(this.state.showingOn));
        return (
          <View style={{flex: 1, flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center', paddingBottom: 13}}>
            {this.state.showingOn.map(site => {
              if (site.url !== null) {
                return (
                  <TouchableOpacity onPress={() => Linking.openURL(site.url).catch(error => alert(error))}>
                    <OriginalSizeImage source={site.logo}/>
                  </TouchableOpacity>
                )
              } else {
                return (<OriginalSizeImage source={site.logo}/>)
              }
            })}
          </View>
        )
      }
    }

    render() {
        return (
        <View style={{flex: 1,
          paddingTop: this.props.navigation.getParam('padTop'),
          paddingLeft: 30,
          paddingRight: 30,
          paddingBottom: 30,
          backgroundColor: 'transparent',}}>
          <Modal ref={'friendsWhoLikeModal'}
        style={{borderRadius: 20, shadowRadius: 10, width: Dimensions.get('window').width - 70, height: Dimensions.get('window').height - 500}}
        position='center' swipeToClose={false} backButtonClose={true}>
        <TouchableWithoutFeedback>
          <View style={styles.container}>
            <Text style={styles.title}>Other friends</Text>
              {this.state.friendsWhoAlsoLike.map((friend) => {
                return (
                  <View>
                    <Text style={{fontFamily: 'PT_Sans-Caption-Regular', color: 'black', paddingTop: 6}}>{friend}</Text>
                  </View>
                )
              })}
            <View style={{paddingTop: 30, justifyContent: 'flex-end', flex: 1}}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <TouchableOpacity style={styles.closeButton} onPress={() => {
                  this.refs.friendsWhoLikeModal.close();
                }}>
                  <Text style={{ fontFamily: 'PT_Sans-Caption-Regular', color: '#000000' }}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>

            </View>
          </TouchableWithoutFeedback>
         </Modal>
            <ScrollView style={{width: '103%', height: '100%'}}>
                <Image source={{uri: this.props.navigation.getParam('posterpath')}}
                    style={{width: 330, height: 500, borderRadius: 10}}/>
                <Text style={MainStylesheet.title}>
                    {this.props.navigation.getParam('title')}
                </Text>

                  {this.renderFriendsWhoAlsoLike()}

                <Text style={styles.movietitleStyle}>Synopsis:</Text>
                <Text style={styles.infoText}>
                    {this.props.navigation.getParam('synopsis')}
                </Text>

                <Text style={styles.infoText}>
                  <Text style={styles.movietitleStyle}>IMDb rating:</Text> {this.props.navigation.getParam('rating')}
                </Text>

                <Text style={styles.movietitleStyle}>Friends' Ratings:</Text>
                {this.renderNoFriendsRating()}

                {this.state.movieRatings.map((rating) => {
                  return (
                    <View style={{paddingTop: 7}}>
                      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                      <Text style={{fontWeight: 'bold',fontFamily: 'PT_Sans-Caption-Bold'}}>"{rating.comment}"</Text>
                      <Rating imageSize={20} readonly startingValue={rating.stars}/>
                      </View>
                      <Text style={styles.commentStyle}> - {rating.name}</Text>
                    </View>
                  )
                })}

                <Text style={styles.availableOnStyle}>Available on:</Text>
                {this.renderStreamingAvailability()}

            </ScrollView>

            <View style={{flexDirection:'row', justifyContent: 'space-between'}}>
                <TouchableOpacity onPress={() => this.pressDeleteButton(this.props.navigation.getParam('id'))}
                                  style={styles.deleteButton}>
                    <Text style={styles.buttonText}>Delete movie</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.pressWatchedButton(this.props.navigation.getParam('id'))}
                                  style={styles.watchedButton}>
                    <Text style={styles.buttonText}>I've watched this</Text>
                </TouchableOpacity>
            </View>
        </View>
        );
    }

}

const styles = StyleSheet.create({
    deleteButton: {
      borderRadius: 15,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fc9797',
      height: 35,
      width: Dimensions.get('window').width / 2.5,
    },
    watchedButton: {
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'skyblue',
        height: 35,
        width: Dimensions.get('window').width / 2.5,
    },
    buttonText: {
        fontFamily: 'PT_Sans-Caption-Bold',
    },
    infoText: {
        marginBottom:10
    },
    closeButton: {
      borderRadius: 15,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#5ac4e8',
      height: 30,
      width: Dimensions.get('window').width / 3,
    },
    container: {
      flex: 1,
      margin: 30,
    },
    title: {
      fontFamily: 'PT_Sans-Caption-Bold',
      fontSize: 25,
      color: '#463D3D',
      marginVertical: 5,
      marginBottom: 10,
    },
    movietitleStyle: {
      fontFamily: 'PT_Sans-Caption-Bold',
      fontSize: 15,
      color: 'black',
    },
    availableOnStyle: {
      fontFamily: 'PT_Sans-Caption-Bold',
      fontSize: 15,
      color: 'black',
      paddingTop: 7,
    },
});
