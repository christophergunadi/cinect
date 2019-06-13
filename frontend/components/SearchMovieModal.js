import React , {Component} from 'react';
import {TouchableOpacity, ScrollView, Dimensions, Text, View, StyleSheet, FlatList, Image, Animated, TouchableWithoutFeedback} from 'react-native';
import Modal from 'react-native-modalbox';
import LinearGradient from 'react-native-linear-gradient';

var windowSize = Dimensions.get('window');

export default class SearchMovieModal extends Component {
  constructor(props) {
    super(props);

    this.state = ({
      results: []
    })

    this.updateResultsModal = this.updateResultsModal.bind(this);
    this.renderResult = this.renderResult.bind(this);
  }

  showResultsModal = () => {
    this.refs.searchResultsModal.open();
  }

  updateResultsModal = (results) => {
    this.setState({
      results: results
    });
  }

  hideResultsModal = () => {
    this.refs.searchResultsModal.close();
  }

  renderResult = ({item}) => {
    var strResult = JSON.stringify(item);
    return (
      <TouchableOpacity onPress={() => this.props.navigate('SearchedMovieScreen', {posterpath: item.posterPath, title: item.movieTitle, id: item.movieid, synopsis: item.synopsis, rating: item.rating, refreshWatchlist: this.props.refreshWatchlist, refreshWatched: this.props.refreshWatchedlist})}>
        <View style={{width: Dimensions.get('window').width - 210, height: 170, flexDirection: 'row'}}>
          <Image source={{uri: item.posterPath}}
            style={{width: 110, height: 160, borderRadius: 10, marginRight: 10}}/>
          <View style={{height: 140, marginTop: 15}}>
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>{item.movieTitle}</Text>
            <Text style={{flex: 1}}>{item.synopsis}</Text>
            <LinearGradient colors={['transparent', 'transparent', 'transparent', '#FFF']} style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}/>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  noResultComponent = () => {
    return (
      <Text>No results!</Text>
    );
  }

  resultSeparator = () => {
    return (
      <View style={{margin: 10, height: 0.5, width: '120%', backgroundColor: '#cccccc'}}/>
    );
  }

  render() {
    return (
      <Modal ref={'searchResultsModal'} onClosed={this.props.shrinkSearchBar}
        style={{borderRadius: 20, width: windowSize.width - 30, height: windowSize.height - 190, marginTop: 40}}
        position='center' swipeToClose={false} backButtonClose={true} swipeArea={50}>
        <TouchableWithoutFeedback>
          <View style={styles.container}>
            <Text style={styles.title}>Search Results:</Text>
            <ScrollView keyboardShouldPersistTaps='never' keyboardDismissMode='on-drag'>
              <FlatList data={this.state.results} extraData={this.state.results} renderItem={this.renderResult} ItemSeparatorComponent={this.resultSeparator} ListEmptyComponent={this.noResultComponent}/>
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 30,
  },
  title: {
    fontFamily: 'PT_Sans-Caption-Bold',
    fontSize: 20,
    color: '#463D3D',
    marginVertical: 5,
    marginBottom: 10,
  },
})
