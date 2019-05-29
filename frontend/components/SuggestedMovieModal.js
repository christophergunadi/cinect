import React , {Component} from 'react';
import {Dimensions, Text, View, StyleSheet, FlatList, Image, TextInput,TouchableOpacity, Keyboard} from 'react-native';
import Modal from 'react-native-modalbox';

var windowSize = Dimensions.get('window');

export default class SuggestedMovieModal extends Component {

    constructor(props) {
        super(props);
    }

    openMovieModal = () => {
        this.refs.suggestedMovieModal.open();
    }

    render() {
        return (
        <Modal ref={'suggestedMovieModal'}
        style={styles.modalContainer}
        position='center'
        backdrop={true}>

        <View style={styles.container}>
          <View>
            <Text style={styles.title}>{this.props.movieTitle}</Text>
          </View>

          <View style={{flex: 1}}>
             <Image 
                style={{flex:1, width:null, height:null, resizeMode:'cover', borderRadius: 10 }}
                source={{uri: ("http://image.tmdb.org/t/p/w500/" + this.props.posterPath)}} />
          </View>
          
          <View style={{ justifyContent: 'flex-end', alignItems: 'center', bottom: 0, paddingTop: 20 }}>
            <TouchableOpacity style={styles.createButton} onPress={() => this.refs.suggestedMovieModal.close()}>
              <Text style={{ fontFamily: 'PT_Sans-Caption-Regular', color: '#000000' }}>Dismiss</Text>
            </TouchableOpacity>
          </View>

        </View>
      </Modal>
        )
    }

}

const styles = StyleSheet.create({
    modalContainer: {
      justifyContent: 'center',
      borderRadius: 20,
      shadowRadius: 10,
      width: windowSize.width - 70,
      height: windowSize.height - 200
    },
    container: {
      flex: 1,
      margin: 30,
    },
    title: {
      fontFamily: 'PT_Sans-Caption-Bold',
      fontSize: 25,
      color: '#463D3D',
      marginVertical: 5,
      marginBottom: 10,
    },
    groupName: {
      fontFamily: 'PT_Sans-Caption-Regular',
      fontSize: 15,
      color: '#000000',
      textAlign: 'left',
      marginLeft: 20,
      marginTop: 20,
    },
    profileicon: {
      width: 45,
      height: 45,
      borderRadius: 25,
      marginTop: 5,
      marginBottom: 5,
    },
    subtitle: {
      fontFamily: 'PT_Sans-Caption-Regular',
      fontSize: 17,
      color: '#000000',
      marginTop: 15,
      marginBottom: 5,
    },
    textInput: {
      width: windowSize.width - 220,
      borderBottomColor: '#000000',
      borderBottomWidth: 1,
      marginRight: 20,
      paddingBottom: -10,
      marginBottom: 10,
    },
    createButton: {
      borderRadius: 15,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#5ac4e8',
      height: 30,
      width: windowSize.width / 3,
    },
    addButton: {
      borderWidth: 1,
      borderColor: '#000000',
      alignItems: 'center',
      justifyContent: 'center',
      width: 45,
      height: 45,
      backgroundColor: '#fff',
      borderRadius: 25,
      marginRight: 30,
      marginTop: 5,
    },
  })