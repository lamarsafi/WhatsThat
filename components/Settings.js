import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

function Settings() {
  const navigation = useNavigation();
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('whatsthat_session_token');
      setIsLoggedIn(!!token);
    };
    checkLoginStatus();
  }, []);

  async function logOut() {
    console.log('Attempting to log out...');

    try {
      const response = await fetch('http://localhost:3333/api/1.0.0/logout', {
        method: 'POST',
        headers: {
          'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
        },
      });

      if (response.status === 200) {
        console.log('logged out');
        await AsyncStorage.removeItem('whatsthat_session_token');
        await AsyncStorage.removeItem('whatsthat_user_id');
        setIsLoggedIn(false);
        
      } else if (response.status === 401) {
        console.log('Unauthorised');
        await AsyncStorage.removeItem('whatsthat_session_token');
        await AsyncStorage.removeItem('whatsthat_user_id');
        setIsLoggedIn(false);
        
      } else {
        throw 'Something went wrong';
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (!isLoggedIn) {
      location.reload();
    }
  }, [isLoggedIn]);

  return (
    <View style={styles.container}>
      <View style={styles.userSettings}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={logOut}>
        <Text style={styles.buttonText}>Log out</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('BlockedContacts')}>
        <Text style={styles.buttonText}>View blocked contacts</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Profile')}>
        <Text style={styles.buttonText}>View Profile</Text>
      </TouchableOpacity>
    </View>
  );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  userSettings: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4b9cdb',
    height: 50,
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  backButton: {
    position: 'absolute',
    left: 10,
    padding: 10,
  },
  headerTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#4b9cdb',
    borderRadius: 10,
    padding: 16,
    width: '80%',
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});


export default Settings;
