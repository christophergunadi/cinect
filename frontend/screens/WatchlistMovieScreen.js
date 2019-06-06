import React, {Component} from 'react';
import {Text, View, Image, Button, Dimensions, TouchableOpacity, StyleSheet} from 'react-native';

import {GetUserProperty} from '../Helpers';
import OriginalSizeImage from '../components/OriginalSizeImage';

import MainStylesheet from '../styles/MainStylesheet';
import { ScrollView } from 'react-native-gesture-handler';

export default class WatchlistMovieScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            width: '100%',
            height: '80%',
            showingOn: [],
        }
    }

    componentDidMount() {
        this.getStreamingAvailability()
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
        // .then(alert('deleted'))
        // .then()
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
        // fetch("https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/lookup?term="+ this.props.navigation.getParam('title') +"&country=uk", {
        //   headers: new Headers({
        //     'X-RapidAPI-Host': 'utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com',
        //     'X-RapidAPI-Key':'10cd8edd93msh174b0f61d4ea30dp1361a6jsn1dddee813f67'
        //   })
        // })
        // .then(response => response.json())
        // .then((responseJson) => {
        //   // TODO: Check movie name matches?
        //   if (responseJson.results[0].name == this.props.navigation.getParam('title')) {
        //     sites = responseJson.results[0].locations
        //     for (let i = 0; i < sites.length; i++) {
        //       this.setState({
        //         showingOn: [...this.state.showingOn, {
        //           url: sites[i].url,
        //           logo: sites[i].icon,
        //         }]
        //       })
        //     }
        //   }
        //   // DEBUG
        //   console.log(responseJson.results);
        // });
        this.setState({
          showingOn: [...this.state.showingOn, {
            url: 'https://www.netflix.com/title/80095314',
            logo: 'https://utellyassets7.imgix.net/locations_icons/utelly/black_new/Netflix.png?auto=compress&app_version=2977d84b-593d-4167-a904-57b1e6e814f1_2019-06-04&w=92',
          }, {
            url: null,
            logo: 'https://utellyassets7.imgix.net/locations_icons/utelly/black_new/Amazon.png?auto=compress&app_version=2977d84b-593d-4167-a904-57b1e6e814f1_2019-06-04&w=92',
          }, {
            url: null,
            logo: 'http://utellyassets7.imgix.net/locations_icons/utelly/live_tv_square/50d352abf0ca9f5798000383.jpg?auto=compress&app_version=2977d84b-593d-4167-a904-57b1e6e814f1_2019-06-04&w=92',
          }]
        })
      }
  

    render() {
        return (
        <View style={MainStylesheet.container}>
            <ScrollView style={{width: '103%', height: '100%'}}>
                <Image source={{uri: this.props.navigation.getParam('posterpath')}}
                    style={{width: 330, height: 500, borderRadius: 10}}/>
                <Text style={MainStylesheet.title}>
                    {this.props.navigation.getParam('title')}
                </Text>
                <Text style={{fontWeight: 'bold'}}>Synopsis:</Text>
                <Text style={styles.infoText}>
                    {this.props.navigation.getParam('synopsis')}
                </Text>
                <Text style={styles.infoText}>
                <Text style={{fontWeight: 'bold'}}>IMDb rating:</Text> {this.props.navigation.getParam('rating')}
                </Text>

                <Text style={{fontWeight: 'bold'}}>Available on:</Text>
                <View style={{flex: 1, flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center'}}>
                  {this.state.showingOn.map(site => {
                    if (site.url !== null) {
                      return (
                        <TouchableOpacity onPress={() => Linking.openURL(site.url).catch(error => alert(error))}>
                          <OriginalSizeImage source={site.logo}/>
                          {/* <Image source={{uri: site.logo}} style={{width: imgWidth, height: imgHeight, padding: 20}}/> */}
                        </TouchableOpacity>
                      )
                    } else {
                      return (<OriginalSizeImage source={site.logo}/>)
                      {/* return (<Image source={{uri: site.logo}} style={{width: imgWidth, height: imgHeight, padding: 20}}/>) */}
                    }
                  })}
                </View>

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
    }
});