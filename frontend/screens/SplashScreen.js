import React, {Component} from 'react';
import {Text, Image, View, StyleSheet, Animated} from 'react-native';
import LottieView from 'lottie-react-native';
import { FluidNavigator, Transition } from 'react-navigation-fluid-transitions';

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
          <View style={{backgroundColor: 'white', alignItems:'center', justifyContent:'center',
          paddingTop: 150}}>
            <Transition shared="logo">
               <Image source={require('../assets/img/popcorn.png')} style={{width: 200, height: 200}}/>
            </Transition>
            <LottieView source={require('../assets/animations/splash.json')}
              progress={this.state.progress}
              style={{width: 400, height: 400, justifyContent:'center', marginBottom: 100}}/>
          </View>
        )
      

    }

}
