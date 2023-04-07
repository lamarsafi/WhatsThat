import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

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
    <>
      <Text>This is your settings screen</Text>
      <TouchableOpacity onPress={logOut}>
        <Text>Log out</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('BlockedContacts')}>
        <Text>View blocked contacts</Text>
      </TouchableOpacity>
    </>
  );
}

export default Settings;
