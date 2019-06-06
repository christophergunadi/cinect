import React, {Component} from 'react';
import {Text, View, Image, Button, Dimensions, TouchableOpacity, StyleSheet} from 'react-native';

import {GetUserProperty} from '../Helpers';

import MainStylesheet from '../styles/MainStylesheet';
import { ScrollView } from 'react-native-gesture-handler';

export default class WatchlistMovieScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            width: '100%',
            height: '80%'
        }
        this.pressRateButton = this.pressRateButton.bind(this)
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

    pressRateButton() {
        this.props.navigation.goBack()
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
                <Text style={styles.infoText}>
                    {this.props.navigation.getParam('synopsis')}
                </Text>
            </ScrollView>
            
            <View style={{flexDirection:'row', justifyContent: 'space-between'}}>
                <TouchableOpacity onPress={() => this.pressRateButton()}
                                  style={styles.watchedButton}>
                    <Text style={styles.buttonText}>Rate movie</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity onPress={() => this.pressDeleteButton(this.props.navigation.getParam('id'))}
                                  style={styles.deleteButton}>
                    <Text style={styles.buttonText}>Delete movie</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.pressWatchedButton(this.props.navigation.getParam('id'))}
                                  style={styles.watchedButton}>
                    <Text style={styles.buttonText}>I've watched this</Text>
                </TouchableOpacity> */}
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