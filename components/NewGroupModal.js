import React , {Component} from 'react';
import {Dimensions, Text, View, StyleSheet, FlatList, Image} from 'react-native';
import Modal from 'react-native-modalbox';

var windowSize = Dimensions.get('window');

export default class NewGroupModal extends Component {

  showAddModal = () => {
    this.refs.newGroupModal.open();
  }

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Modal ref={'newGroupModal'}
        style={{
          justifyContent: 'center',
          borderRadius: 20,
          shadowRadius: 10,
          width: windowSize.width - 70,
          height: windowSize.height - 200
        }}
        position='center'
        backdrop={true}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Create a new group</Text>

          <FlatList
            data={[
              {key: 'David'},
              {key: 'Kate'},
            ]}
            renderItem={({item}) =>
              <View style={{ flexDirection: 'row' }}>
                <Image source={require('../assets/img/tempprofileicon.png')} style={styles.profileicon}/>
                <Text style={styles.groupName}>{item.key}</Text>
              </View>
            }
          />

        </View>

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
    fontSize: 25,
    color: '#463D3D',
    marginVertical: 5,
    marginBottom: 10,
  },
  groupName: {
    fontFamily: 'PT_Sans-Caption-Regular',
    fontSize: 18,
    color: '#000000',
    textAlign: 'left',
    marginLeft: 20,
    marginTop: 20,
  },
  profileicon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginTop: 5,
    marginBottom: 5,
  },
})
