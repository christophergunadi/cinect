import React, {Component} from 'react';
import {Text, View, Image} from 'react-native';

export default class WatchedMovies extends React.Component {
  render() {
    return (
        <View style={{height:220, width:130, marginRight:20}}>
            <View style={{flex:2}}>
                <Image source={this.props.imageUri}
                style={{flex:1, width:null, height:null, resizeMode:'cover'}}/>
            </View>
            {/* <View style={{flex:1, paddingLeft:10, paddingTop:10}}> */}
            <Text 
            style={{paddingTop:5}}>
            {this.props.name}
            </Text>
            {/* </View> */}
      </View>
    );
  }
}