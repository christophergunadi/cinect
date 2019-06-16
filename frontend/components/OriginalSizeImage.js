import React, { Component } from 'react';
import {View, Image} from 'react-native';

export default class OriginalSizeImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      height: 0,
    }
    this.getOriginalSize = this.getOriginalSize.bind(this);
  }

  getOriginalSize = () => {
    Image.getSize(this.props.source, (srcWidth, srcHeight) => {
      this.setState({
        width: srcWidth,
        height: srcHeight,
      });
    });
  }

  componentDidMount() {
    this.getOriginalSize();
  }

  render() {
    return (
      <View>
        <Image source={{uri: this.props.source}} style={{width: this.state.width, height: this.state.height, margin: 10}}/>
      </View>
    );
  }
}
