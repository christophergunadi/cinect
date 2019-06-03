import React, {Component} from 'react';
import {Text, View, Image} from 'react-native';

export default class WatchList extends React.Component {
  render() {
    return (
        <View style={{flex:1, height:240, width:130, marginRight:20}}>
            <View style={{ height:200}}>
                <Image source={{uri: this.props.imageUri}}
                style={{flex:1, width:null, height:null, resizeMode:'cover', borderRadius:5}}/>
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