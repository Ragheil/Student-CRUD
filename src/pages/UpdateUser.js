import React, { useState, useEffect } from 'react';
import {
  FlatList,
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { DatabaseConnection } from '../database/database-connection';

const db = DatabaseConnection.getConnection();

const ViewAllUser = () => {
  const [flatListItems, setFlatListItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedUserName, setSelectedUserName] = useState('');
  const [selectedUserContact, setSelectedUserContact] = useState('');
  const [selectedUserAddress, setSelectedUserAddress] = useState('');

  useEffect(() => {
    fetchStudentData();
  }, [searchTerm]);

  const fetchStudentData = () => {
    db.transaction((tx) => {
      const query = searchTerm
        ? 'SELECT * FROM table_user WHERE user_id LIKE ? OR user_name LIKE ?'
        : 'SELECT * FROM table_user';
      const params = searchTerm ? [`%${searchTerm}%`, `%${searchTerm}%`] : [];

      tx.executeSql(query, params, (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i)
          temp.push(results.rows.item(i));
        setFlatListItems(temp);
      });
    });
  };

  const listItemView = (item) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setSelectedUserId(item.user_id);
          setSelectedUserName(item.user_name);
          setSelectedUserContact(item.user_contact);
          setSelectedUserAddress(item.user_address);
        }}
      >
        <View
          key={item.user_id}
          style={{
            backgroundColor: '#EEE',
            marginTop: 15,
            padding: 30,
            borderRadius: 10,
          }}
        ><Text style={styles.editTextHeader}>Information</Text>
          <Text style={styles.textheader}>Student ID</Text>
          <Text style={styles.textbottom}>{item.user_id}</Text>

          <Text style={styles.textheader}>Student Name</Text>
          <Text style={styles.textbottom}>{item.user_name}</Text>

          <Text style={styles.textheader}>Student Contact Number</Text>
          <Text style={styles.textbottom}>{item.user_contact}</Text>

          <Text style={styles.textheader}>Student Address</Text>
          <Text style={styles.textbottom}>{item.user_address}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const updateStudent = () => {
    if (!selectedUserId) {
      alert('Please select a student to edit!');
      return;
    }

    db.transaction((tx) => {
      tx.executeSql(
        'UPDATE table_user set user_name=?, user_contact=? , user_address=? where user_id=?',
        [selectedUserName, selectedUserContact, selectedUserAddress, selectedUserId],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            alert('Student Data Updated!');
            setSelectedUserId('');
            setSelectedUserName('');
            setSelectedUserContact('');
            setSelectedUserAddress('');
            fetchStudentData(); // Refresh the list after update
          } else {
            alert('Error updating student record');
          }
        }
      );
    });
  };

  const cancelEdit = () => {
    setSelectedUserId('');
    setSelectedUserName('');
    setSelectedUserContact('');
    setSelectedUserAddress('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
      <Text style={styles.editHeader}>Tap the Information Section for you to Edit</Text>
        <TextInput
        
          style={styles.searchInput}
          placeholder="Search by Student ID or Name"
          onChangeText={(term) => setSearchTerm(term)}
          
        />
        <FlatList
          contentContainerStyle={{ paddingHorizontal: 20 }}
          data={flatListItems}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => listItemView(item)}
        />

        {/* Edit Section */}
        {selectedUserId ? (
          <View style={styles.editSection}>
            <Text style={styles.editHeader}>Edit Student</Text>
            <Text style={styles.textheader}>Student Name</Text>
            <TextInput
              placeholder="Enter Student Name"
              value={selectedUserName}
              style={styles.textInput}
              onChangeText={(name) => setSelectedUserName(name)}
            />
            <Text style={styles.textheader}>Contact Number</Text>
            <TextInput
             placeholder="Enter Student Contact Number"
             value={selectedUserContact.toString()}
             style={styles.textInput}
             onChangeText={(contact) => setSelectedUserContact(contact)}
             />
            <Text style={styles.textheader}>Address</Text>
            <TextInput
              placeholder="Enter Student Address"
              value={selectedUserAddress}
              style={styles.textInput}
              onChangeText={(address) => setSelectedUserAddress(address)}
            />
            <TouchableOpacity
              style={styles.updateButton}
              onPress={updateStudent}
            >
              <Text style={styles.buttonText}>Update Student</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={cancelEdit}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    width: '100%',
    padding: 20,
  },
  textheader: {
    color: '#111',
    fontSize: 16,
    fontWeight: '700',
  },
  editTextHeader: {
    color: '#111',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
  },
  textbottom: {
    color: '#111',
    fontSize: 22,
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
  },
  editSection: {
    marginTop: 20,
  },
  editHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
    paddingBottom: 10,
  },
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
  },
  updateButton: {
    backgroundColor: '#A45BB9',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },

});

export default ViewAllUser;
