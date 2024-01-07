import React, { useState, useEffect } from 'react';
import { FlatList, Text, View, SafeAreaView, StyleSheet, TextInput } from 'react-native';
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
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: 'white', padding: 20 }}>
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
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  textheader: {
    color: '#111',
    fontSize: 12,
    fontWeight: '700',
  },
  textbottom: {
    color: '#111',
    fontSize: 18,
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
  },
});

export default ViewAllUser;
