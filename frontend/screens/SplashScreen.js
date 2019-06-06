import React, {Component} from 'react';
import {Text, Image, View, StyleSheet, Animated} from 'react-native';
import LottieView from 'lottie-react-native';

import {GetUserProperty} from '../Helpers';

export default class SplashScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            progress: new Animated.Value(0),
        }
    }

    componentDidMount() {
        Animated.timing(this.state.progress, {
            toValue: 1,
            duration: 1900,
          }).start(({ finished }) => {
            if (finished) {
                GetUserProperty('email').then((value) => {
                    if (!value) {
                        this.props.navigation.navigate('Login');
                    } else {
                        this.props.navigation.navigate('Main');
                    }
                })
            }
          });
    }



    render() {
        return (
          <View style={{backgroundColor: 'white', alignItems:'center', flex:1, justifyContent:'center'}}>
            <Image source={require('../assets/img/cinectlogo.png')} style={{width: 250, height: 55}}/>
            <LottieView source={require('../assets/animations/splash.json')}
              progress={this.state.progress}
              style={{width: 400, height: 400, justifyContent:'center'}}/>
          </View>
        )
      

    }

}
