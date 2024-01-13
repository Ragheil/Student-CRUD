import React, { useState } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
  SafeAreaView,
} from 'react-native';
import Mytextinput from './components/Mytextinput';
import Mybutton from './components/Mybutton';
import { DatabaseConnection } from '../database/database-connection';

const db = DatabaseConnection.getConnection();



const RegisterUser = ({ navigation }) => {
  let [storeID, setStoreID] = useState('');
  let [storeName, setStoreName] = useState('');
  let [contactPerson, setContactPerson] = useState('');
  let [location, setLocation] = useState('');

  let register_store = () => {
    console.log(storeID, storeName, contactPerson, location);

    if (!storeID) {
      alert('Please fill in the Store ID!');
      return;
    }
    if (!storeName) {
      alert('Please fill in the Store Name!');
      return;
    }
    if (!contactPerson) {
      alert('Please fill in the Contact Person');
      return;
    }
    if (!location) {
      alert('Please fill in the Location!');
      return;
    }

    db.transaction(function (tx) {
      tx.executeSql(
        'INSERT INTO table_user (user_id, user_name, user_contact, user_address) VALUES (?,?,?,?)',
        [storeID, storeName, contactPerson, location],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            Alert.alert(
              'Success',
              'Successfully Registered Store !!!',
              [
                {
                  text: 'Ok',
                  onPress: () => navigation.navigate('HomeScreen'),
                },
              ],
              { cancelable: false }
            );
          } else alert('Error trying to register Store !!!');
        }
      );
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={{ flex: 1 }}>
          <ScrollView keyboardShouldPersistTaps="handled">
            <KeyboardAvoidingView
              behavior="padding"
              style={{ flex: 1, justifyContent: 'space-between' }}>
              <Mytextinput
                placeholder="Enter Store ID"
                onChangeText={(storeID) => setStoreID(storeID)}
                keyboardType="numeric"
                style={{ padding: 10 }}
              />
              <Mytextinput
                placeholder="Enter Store Name"
                onChangeText={(storeName) => setStoreName(storeName)}
                style={{ padding: 10 }}
              />
              <Mytextinput
                placeholder="Enter Contact Person"
                onChangeText={(contactPerson) => setContactPerson(contactPerson)}
                style={{ padding: 10 }}
              />
              <Mytextinput
                placeholder="Enter Location"
                onChangeText={(location) => setLocation(location)}
                style={{ padding: 10 }}
              />
              <Mybutton title="Register Store" customClick={register_store} />
            </KeyboardAvoidingView>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default RegisterUser;
