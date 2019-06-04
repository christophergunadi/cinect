import React, {Component} from 'react';
import {Text, View, Image, Button, Dimensions, TouchableOpacity, ScrollView, StyleSheet} from 'react-native';

import MainStylesheet from '../styles/MainStylesheet';

export default class GroupMovieScreen extends React.Component {
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
          <ScrollView style={{height: '100%', width: '100%'}}>
            {/* <View> */}
                <Image source={{uri: "http://image.tmdb.org/t/p/w500/" + this.props.navigation.getParam('posterpath')}}
                // <Image source={{uri: "http://image.tmdb.org/t/p/w500/" + this.props.navigation.getParam('posterpath')}}
                    style={{width: 300, height: 500, borderRadius: 10}}/>
                <Text style={MainStylesheet.title}>
                    {this.props.navigation.getParam('title')}
                </Text>
            {/* </View> */}

            {/* <View style={{flex:2, justifyContent: "flex-end"}}> */}
                <View style={{flex:1, flexDirection:'row', justifyContent: 'space-evenly'}}>
                    <TouchableOpacity style={styles.watchedButton}>
                        <Text>Send movie invite</Text>
                    </TouchableOpacity>
                </View>
                <Text style={{fontWeight: 'bold'}}>Synopsis:{'\n'}</Text>
                <Text>
                {this.props.navigation.getParam('synopsis')}
                {'\n'}
                </Text>
                <Text style={{fontWeight: 'bold'}}>Available on:</Text>
                <View>
                  {/* // {this.state.showingOn.map(site => {
                  //   if site.url !== NULL
                  // })} */}
                  <Image source={{uri: "https://utellyassets7.imgix.net/locations_icons/utelly/black_new/Netflix.png?auto=compress&app_version=2977d84b-593d-4167-a904-57b1e6e814f1_2019-06-04&w=92"}}
                    style={{width: 100, height: 30, padding: 20}}/>
                </View>
            {/* </View> */}

          </ScrollView>
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
