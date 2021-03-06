import React, {Component} from 'react';
import {Text, View, Image, Dimensions, TouchableOpacity, StyleSheet,
    TouchableWithoutFeedback, TextInput, Keyboard} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Modal from 'react-native-modalbox';
import {Rating, AirbnbRating} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';

import {GetUserProperty} from '../Helpers';
import MovieScreenPoster from '../components/MovieScreenPoster';

import MainStylesheet from '../styles/MainStylesheet';

export default class WatchlistMovieScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            width: '100%',
            height: '80%',
            stars: 3,
            comment: '',
            movieRatings: [], // each rating is in the format {moviename: xx, stars: x, comment: xx}
            loading: true,
        }
    }

    componentDidMount() {
        this.getMovieRatings()
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


    submitRating = () => {
        let formData = new FormData();
        GetUserProperty('email').then(value => {
            formData.append('email', value);
            formData.append('stars', this.state.stars);
            formData.append('comment', this.state.comment);
            formData.append('movieid', this.props.navigation.getParam('id'));
            fetch("http://146.169.45.140:8000/cinect_api/rateMovie", {
              method: 'POST',
              body: formData
            }).then(() => {
                this.refs.rateModal.close();
                this.state.comment = '';
                this.state.stars = 0;
                this.props.navigation.goBack();
            });
          });
    }

    renderNoFriendsRating = () => {
        if (this.state.movieRatings.length == 0) {
            return(<Text>No friends rated this movie yet! :(</Text>);
        }
    }

    render() {
        return (
        <View style={MainStylesheet.container}>
        <Modal ref={'rateModal'}
        style={{borderRadius: 20, shadowRadius: 10, width: Dimensions.get('window').width - 70, height: Dimensions.get('window').height - 500}}
        position='center' swipeToClose={false} backButtonClose={true}>
        <TouchableWithoutFeedback>
          <View style={{padding: 30, alignItems: 'center'}}>
            <Rating
            onFinishRating={(rating) => this.state.stars = rating}
            style={{ paddingBottom: 20}}/>
            <View style={{paddingBottom: 12}}>
            <TextInput style={styles.textInput} placeholder="  Write a comment" maxLength={60}
            value={this.state.comment} underlineColorAndroid='transparent' placeholderStyle={{paddingLeft: 10, marginLeft: 10}}
            onBlur={Keyboard.dismiss} onChangeText={(text) => this.setState({comment: text})}/>
            </View>

              <View style={{paddingTop: 30, justifyContent: 'flex-end', flex: 1}}>
                <TouchableOpacity style={styles.rateButton} onPress={this.submitRating}>
                  <Text style={{ fontFamily: 'PT_Sans-Caption-Regular', color: '#000000' }}>Rate</Text>
                </TouchableOpacity>
              </View>


            </View>
          </TouchableWithoutFeedback>
         </Modal>


            <ScrollView style={{width: '103%', height: '100%'}}>
                <MovieScreenPoster source={this.props.navigation.getParam('posterpath')}/>
                <Text style={MainStylesheet.title}>
                    {this.props.navigation.getParam('title')}
                </Text>
                <Text style={styles.movietitleStyle}>Synopsis:</Text>
                <Text style={styles.infoText}>
                    {this.props.navigation.getParam('synopsis')}
                </Text>
                <View style={{paddingBottom: 13}}>
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
                </View>

            </ScrollView>
            <LinearGradient locations={[0.85, 0.898]} colors={['transparent', '#FFFFFF']} style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}/>


            <View style={{flexDirection:'row', justifyContent: 'space-between', marginTop: 10}}>
                <TouchableOpacity onPress={() => this.refs.rateModal.open()}
                                  style={styles.watchedButton}>
                    <Text style={styles.buttonText}>Rate movie</Text>
                </TouchableOpacity>
            </View>
        </View>
        );
    }

}

const styles = StyleSheet.create({
    rateButton: {
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
        width: Dimensions.get('window').width / 2.5,
    },
    buttonText: {
        fontFamily: 'PT_Sans-Caption-Bold',
    },
    infoText: {
        marginBottom:10
    },
    textInput: {
        width: Dimensions.get('window').width / 2,
        height: 40,
        borderBottomColor: '#000000',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#c2c4c6',
        marginBottom: 10,
        alignItems: 'center',
    },
    movietitleStyle: {
        fontFamily: 'PT_Sans-Caption-Bold',
        fontSize: 15,
        color: 'black',
    },
});
