import {AsyncStorage} from 'react-native';

export async function GetUserProperty(property) {
  userProperty = '';
  try {
    userProperty = await AsyncStorage.getItem(property);
  } catch (error) {
    alert(error.message);
  }
  return userProperty;
}
