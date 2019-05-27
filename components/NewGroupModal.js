import React , {Component} from 'react';
import {Dimensions, Text, View, StyleSheet, FlatList, Image, TextInput,TouchableOpacity, Keyboard} from 'react-native';
import Modal from 'react-native-modalbox';

var windowSize = Dimensions.get('window');

export default class NewGroupModal extends Component {

  showAddModal = () => {
    this.refs.newGroupModal.open();
  }

  constructor(props) {
    super(props);
  }

  _onAddMemberButton = () => {}

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

          <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
            <TouchableOpacity onPress={() => alert("I want to set a DP")}>
              <Image source={require('../assets/img/tempprofileicon.png')} style={styles.profileicon}/>
            </TouchableOpacity>
            <TextInput
              style={styles.textInput}
              placeholder="Enter group name"
              maxLength={15}
              onBlur={Keyboard.dismiss}
            />
          </View>

          <Text style={styles.subtitle}>Current members</Text>
          <View>
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

          <TouchableOpacity style={styles.addButton} onPress={this._onAddMemberButton}>
            <Text style={styles.title}>+</Text>
          </TouchableOpacity>

          <View style={{ justifyContent: 'flex-end', alignItems: 'center', bottom: 0, flex: 1 }}>
            <TouchableOpacity style={styles.createButton}>
              <Text style={{ fontFamily: 'PT_Sans-Caption-Regular', color: '#000000' }}>Create</Text>
            </TouchableOpacity>
          </View>

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
