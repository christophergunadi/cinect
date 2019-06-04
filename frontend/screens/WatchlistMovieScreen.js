import React, {Component} from 'react';
import {Text, View, Image, Button, Dimensions, TouchableOpacity, StyleSheet} from 'react-native';

import {GetUserProperty} from '../Helpers';

import MainStylesheet from '../styles/MainStylesheet';

export default class WatchlistMovieScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            width: '100%',
            height: '80%'
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
            // alert(value + id);
        formData.append('email', value)
        formData.append('movieid', id);
        fetch("http://146.169.45.140:8000/cinect_api/deleteswipedright", {
            method: 'POST',
            body: formData
        })
        .then(this.props.navigation.getParam('refresh'))
        .then(this.props.navigation.goBack())
        // .then(response = response.json())
        // .then((responseJson) => {
        //     alert(responseJson.title)
        // })
        })
      }


    render() {
        return (
        //   <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <View style={MainStylesheet.container}>
            {/* <View> */}
                <Image source={{uri: this.props.navigation.getParam('posterpath')}}
                    style={{width: this.state.width, height: this.state.height, borderRadius: 10}}/>
                <Text style={MainStylesheet.title}>
                    {this.props.navigation.getParam('title')}
                </Text>
            {/* </View> */}
            
            {/* <View style={{flex:2, justifyContent: "flex-end"}}> */}
                <View style={{flex:1, flexDirection:'row', justifyContent: 'space-evenly'}}>
                    <TouchableOpacity onPress={() => this.pressDeleteButton(this.props.navigation.getParam('id'))}
                                    style={styles.deleteButton}>
                        <Text style={styles.infoText}>Delete movie</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.watchedButton}>
                        <Text style={styles.infoText}>I've watched this</Text>
                    </TouchableOpacity>
                </View>
            {/* </View> */}
            

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
    infoText: {
        fontFamily: 'PT_Sans-Caption-Bold',
    }
});