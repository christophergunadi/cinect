import React, { Component } from 'react';
import {View, Image, Dimensions} from 'react-native';

export default class MovieScreenPoster extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: Dimensions.get('window').width - 60,
      height: 0,
    }
    this.getHeight = this.getHeight.bind(this);
  }

  getHeight = () => {
    Image.getSize(this.props.source, (srcWidth, srcHeight) => {
      this.setState({
        height: (this.state.width / srcWidth) * srcHeight
      });
    });
  }

  componentDidMount() {
    this.getHeight();
  }

  render() {
    return (
      <View>
        <Image source={{uri: this.props.source}} style={{width: this.state.width, height: this.state.height, borderRadius: 10}}/>
      </View>
    );
  }
}
