import React, { useState, useEffect } from 'react';
import Mytextinput from './components/Mytextinput'; // Import Mytextinput component
import {
  FlatList,
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { DatabaseConnection } from '../database/database-connection';

const db = DatabaseConnection.getConnection();

const ViewAllUser = () => {
  const [flatListItems, setFlatListItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

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

  const deleteStudent = (userId) => {
    Alert.alert(
      'Delete Student',
      'Are you sure you want to delete this student?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => confirmDeleteStudent(userId),
        },
      ],
      { cancelable: true }
    );
  };

  const confirmDeleteStudent = (userId) => {
    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM table_user WHERE user_id=?',
        [userId],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            fetchStudentData(); // Refresh the data after deletion
          } else {
            alert('Error deleting student information.');
          }
        }
      );
    });
  };

  const listItemView = (item) => {
    return (
      <View
        key={item.user_id}
        style={{ backgroundColor: '#EEE', marginTop: 20, padding: 30, borderRadius: 10 }}>
        <Text style={styles.textheader}>Student ID</Text>
        <Text style={styles.textbottom}>{item.user_id}</Text>

        <Text style={styles.textheader}>Student Name</Text>
        <Text style={styles.textbottom}>{item.user_name}</Text>

        <Text style={styles.textheader}>Student Contact Number</Text>
        <Text style={styles.textbottom}>{item.user_contact}</Text>

        <Text style={styles.textheader}>Student Address</Text>
        <Text style={styles.textbottom}>{item.user_address}</Text>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteStudent(item.user_id)}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: 'white', padding: 20 }}>
        <Text style={styles.searchLabel}>Search by Student ID or Name:</Text>
        <Mytextinput
          placeholder="Search..."
          onChangeText={(term) => setSearchTerm(term)}
          style={{ marginBottom: 20 }}
        />
        <FlatList
          contentContainerStyle={{ paddingHorizontal: 20 }}
          data={flatListItems}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => listItemView(item)}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  textheader: {
    color: '#111',
    fontSize: 15,
    fontWeight: '700',
  },
  textbottom: {
    color: '#111',
    fontSize: 18,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  searchLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default ViewAllUser;
