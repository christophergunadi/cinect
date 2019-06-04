import React, {Component} from 'react';
import {Text, View, Image, Button, Dimensions, TouchableOpacity, StyleSheet} from 'react-native';

import MainStylesheet from '../styles/MainStylesheet';

export default class WatchlistMovieScreen extends React.Component {
    constructor(props) {
        super(props)
        let {width, height} = Dimensions.get('window')
        this.state = {
            width: '100%',
            height: '80%'
        }
    }

    pressDeleteButton() {
        
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
                    <TouchableOpacity onPress={this.pressDeleteButton}
                                    style={styles.deleteButton}>
                        <Text>Delete Movie</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                                    style={styles.watchedButton}>
                        <Text>Watched</Text>
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
      width: Dimensions.get('window').width / 3,
    },
    watchedButton: {
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'skyblue',
        height: 35,
        width: Dimensions.get('window').width / 3,
      },
});