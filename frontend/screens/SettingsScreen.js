import React, {Component} from 'react';
import {Button, Text, View, TouchableOpacity, StyleSheet, Dimensions} from 'react-native';
import FBLoginButton from '../components/FBLoginButton';
import {GetUserProperty} from '../Helpers';

export default class SettingsScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      Action: false,
      Comedy: false,
      Thriller: false,
      Animation: false,
      Romance: false,
      Scifi: false,
      Horror: false,
      Family: false,
    }
  }


  componentDidMount() { 
    this.getPreferences(); 
  }

  getPreferences = () => {
    GetUserProperty('email').then(email => {
      fetch("http://146.169.45.140:8000/cinect_api/getpreferences?email=" + email, {
      }).then(response => response.json())
      .then((responseJson) => {
        this.setState ({
          Action: responseJson.Action,
          Comedy: responseJson.Comedy,
          Thriller: responseJson.Thriller,
          Animation: responseJson.Animation,
          Romance: responseJson.Romance,
          Scifi: responseJson.Scifi,
          Horror: responseJson.Horror,
          Family: responseJson.Family,
        });
      })
    })  
  }

  renderGridEntry = (genre) => {
    if (this.state[genre]) {
      return (
        <TouchableOpacity style={{
          backgroundColor: '#93f2a9',
          width: (Dimensions.get('window').width / 2) - 30, 
          height: (Dimensions.get('window').height / 4) - 50,
          margin: 5,
          alignItems: 'center',
          padding: 20,
          justifyContent:'center',
          borderRadius: 15,
          }}
          onPress={() => {
            this.state[genre] = !this.state[genre];
            this.setState({})
          }}>
          <Text style={styles.gridEntryText}>{genre}</Text>
        </TouchableOpacity>
      )
    } else {
      return (
        <TouchableOpacity style={{
          backgroundColor: '#dee0de',
          width: (Dimensions.get('window').width / 2) - 30, 
          height: (Dimensions.get('window').height / 4) - 50,
          margin: 5,
          alignItems: 'center',
          padding: 20,
          justifyContent:'center',
          borderRadius: 15,
          }}
          onPress={() => {
            this.state[genre] = !this.state[genre];
            this.setState({});
          }}>
          <Text style={styles.gridEntryText}>{genre}</Text>
        </TouchableOpacity>
      )
    }
  }

  _onUpdatePreferences = () => {
    let formData = new FormData();
    var i;
    GetUserProperty('email').then(email => {
      formData.append('email', email);
      for (i = 0; i < 8; i++) {
        formData.append('Action', this.state.Action)
        formData.append('Comedy', this.state.Comedy)
        formData.append('Thriller', this.state.Thriller)
        formData.append('Animation', this.state.Animation)
        formData.append('Romance', this.state.Romance)
        formData.append('Scifi', this.state.Scifi)
        formData.append('Horror', this.state.Horror)
        formData.append('Family', this.state.Family)
      }

      fetch("http://146.169.45.140:8000/cinect_api/updatepreferences", {
        method: 'POST',
        body: formData,
      });
    })
    .then(this.props.navigation.goBack()) 
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <View style={{flexDirection: 'row', paddingTop: 10}}>
            {this.renderGridEntry('Action')}
            {this.renderGridEntry('Animation')}
        </View>
        <View style={{flexDirection: 'row'}}>
          {this.renderGridEntry('Comedy')}
          {this.renderGridEntry('Family')}
        </View>
        <View style={{flexDirection: 'row'}}>
          {this.renderGridEntry('Horror')}
          {this.renderGridEntry('Romance')}
        </View>
        <View style={{flexDirection: 'row'}}>
          {this.renderGridEntry('Scifi')}
          {this.renderGridEntry('Thriller')}
        </View>
        <View style={{flexDirection: 'row', paddingTop: 10, paddingBottom: 30, alignItems: 'center'}}>
          <TouchableOpacity style={styles.saveButton} onPress={this._onUpdatePreferences}>
            <Text style={{fontFamily: 'PT_Sans-Caption-Regular'}}>Save</Text>
          </TouchableOpacity>
          <FBLoginButton onLogin = { this.onUserLogin } refresh = { this.onRefresh }/>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  gridEntryText: {
    fontFamily: 'PT_Sans-Caption-Regular',
    fontSize: 22,
  },
  saveButton: {
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fc9797',
    height: 32,
    width: Dimensions.get('window').width / 2.5,
    marginRight: 15
  },
})