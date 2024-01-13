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

// ... (imports remain unchanged)

const ViewAllUser = () => {
  const [flatListItems, setFlatListItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchStoreData();
  }, [searchTerm]);

  const fetchStoreData = () => {
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

  const deleteStore = (storeId) => {
    Alert.alert(
      'Delete Store',
      'Are you sure you want to delete this store?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => confirmDeleteStore(storeId),
        },
      ],
      { cancelable: true }
    );
  };

  const confirmDeleteStore = (storeId) => {
    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM table_user WHERE user_id=?',
        [storeId],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            fetchStoreData(); // Refresh the data after deletion
          } else {
            alert('Error deleting store information.');
          }
        }
      );
    });
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

  const listItemView = (item) => {
    return (
      <View
        key={item.user_id}
        style={{ backgroundColor: '#EEE', marginTop: 20, padding: 30, borderRadius: 10 }}>
        <Text style={styles.textheader}>Store ID</Text>
        <Text style={styles.textbottom}>{item.user_id}</Text>

        <Text style={styles.textheader}>Store Name</Text>
        <Text style={styles.textbottom}>{item.user_name}</Text>

        <Text style={styles.textheader}>Contact Person</Text>
        <Text style={styles.textbottom}>{item.user_contact}</Text>

        <Text style={styles.textheader}>Location</Text>
        <Text style={styles.textbottom}>{item.user_address}</Text>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteStore(item.user_id)}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: 'white', padding: 20 }}>
        <Text style={styles.searchLabel}>Search by Store ID or Name:</Text>
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

export default ViewAllUser;
