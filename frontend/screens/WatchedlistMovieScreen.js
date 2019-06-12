import React, {Component} from 'react';
import {Text, View, Image, Dimensions, TouchableOpacity, StyleSheet, 
    TouchableWithoutFeedback, TextInput, Keyboard} from 'react-native';

import {GetUserProperty} from '../Helpers';

import MainStylesheet from '../styles/MainStylesheet';
import { ScrollView } from 'react-native-gesture-handler';
import Modal from 'react-native-modalbox';
import {Rating, AirbnbRating} from 'react-native-elements';

export default class WatchlistMovieScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            width: '100%',
            height: '80%',
            stars: 0,
            comment: '',
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


    submitRating = () => {
        let formData = new FormData();

        GetUserProperty('email').then(value => {
            formData.append('email', value);
            formData.append('stars', this.state.stars);
            formData.append('comment', this.state.comment);
            formData.append('movieid', this.props.navigation.getParam('id'));
            fetch("http://146.169.45.140:8000/cinect_api/submitRating", {
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
            <TextInput style={styles.textInput} placeholder="Write a comment" maxLength={20} value={this.state.comment}
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
                <Image source={{uri: this.props.navigation.getParam('posterpath')}}
                    style={{width: 330, height: 500, borderRadius: 10}}/>
                <Text style={MainStylesheet.title}>
                    {this.props.navigation.getParam('title')}
                </Text>
                <Text style={styles.infoText}>
                    {this.props.navigation.getParam('synopsis')}
                </Text>
            </ScrollView>
            
            <View style={{flexDirection:'row', justifyContent: 'space-between'}}>
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
        borderBottomColor: '#000000',
        borderBottomWidth: 1,
        marginBottom: 10,
      },
});