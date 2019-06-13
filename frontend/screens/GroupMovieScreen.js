import React, {Component, memo} from 'react';
import {Text, View, Image, Button, Dimensions, Linking, TouchableOpacity, ScrollView, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import OriginalSizeImage from '../components/OriginalSizeImage';

import MainStylesheet from '../styles/MainStylesheet';

export default class GroupMovieScreen extends React.Component {
    constructor(props) {
        super(props)
        let {width, height} = Dimensions.get('window')
        this.state = {
            width: '100%',
            height: '80%',
            showingOn: [],
            members: [],
        }
        this.pressWatched = this.pressWatched.bind(this)
    }

    componentDidMount() {
      this.getStreamingAvailability()
      this.setState({members: this.props.navigation.getParam('members')})
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

    pressDeleteButton() {

    }

    pressWatched() {
      for (i = 0; i < this.state.members.length; i++) {
        let formData = new FormData();

        formData.append('facebookid', this.state.members[i].facebookid)
        formData.append('movieid', this.props.navigation.getParam('movieid'));
        fetch("http://146.169.45.140:8000/cinect_api/pressgroupwatched", {
            method: 'POST',
            body: formData
        })
        .then(this.props.navigation.goBack())
      }
    }

    render() {
        return (
        <View style={MainStylesheet.container}>
          <ScrollView style={{height: '100%', width: '103%'}}>
            {/* <View> */}
            {/* TODO: Change width and height*/}
                <Image source={{uri: "http://image.tmdb.org/t/p/w500/" + this.props.navigation.getParam('posterpath')}}
                    style={{width: 330, height: 500, borderRadius: 10}}/>
                <Text style={MainStylesheet.title}>
                    {this.props.navigation.getParam('title')}
                </Text>
            {/* </View> */}

            {/* <View style={{flex:2, justifyContent: "flex-end"}}> */}
                <View style={{flex:1, flexDirection:'row', justifyContent: 'space-evenly'}}>
                    {/* <TouchableOpacity style={styles.watchedButton}>
                        <Text>Send movie invite</Text>
                    </TouchableOpacity> */}
                </View>
                <Text style={styles.movietitleStyle}>Synopsis:{"\n"}</Text>
                <Text>
                  {this.props.navigation.getParam('synopsis')}
                  {"\n"}
                </Text>
                <Text style={styles.movietitleStyle}>Available on:</Text>
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
            {/* </View> */}

          </ScrollView>
          <LinearGradient locations={[0.85, 0.898]} colors={['transparent', '#FFFFFF']} style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}/>


          <View style={{flex:1, flexDirection:'row', justifyContent: 'space-evenly', marginBottom:30}}>
            <TouchableOpacity style={styles.watchedButton} onPress={this.pressWatched}>
              <Text style={styles.buttonTextStyle}>We've watched this</Text>
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
      width: Dimensions.get('window').width / 3,
    },
    watchedButton: {
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'skyblue',
        height: 35,
        width: Dimensions.get('window').width / 2,
    },
    movietitleStyle: {
      fontFamily: 'PT_Sans-Caption-Bold',
      fontSize: 15,
      color: 'black',
    },
    buttonTextStyle: {
      fontFamily: 'PT_Sans-Caption-Bold',
      fontSize: 15,
      color: 'black',
    },
});
