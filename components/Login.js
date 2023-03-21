import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';

export const Login = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('http://localhost:3333/api/1.0.0/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "email": email,
        "password": password,
      }),
    })
      .then(response => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw "Unable to Login"
        }
      })
      .then(async (responseJSON) => {
        console.log(responseJSON)
        try {
          await AsyncStorage.setItem("whatsthat_user_id", responseJSON.id)
          await AsyncStorage.setItem("whatsthat_session_token", responseJSON.token)
        } catch {
          throw "An error has occurred"
        }
      })
      .catch(error => console.error(error));
  }

  return (

    <>
       
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.title}>Login</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={(value) => setEmail(value)}
          placeholder='youremail@gmail.com'
          keyboardType='email-address'
        />
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={(value) => setPassword(value)}
          placeholder='*******'
          secureTextEntry={true}
        />
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={() => props.onFormSwitch('register')}>
          <Text style={styles.secondaryButtonText}>Don't have an account? Sign up here!</Text>
        </TouchableOpacity>
      </View>
    </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    opacity: '80%',
    
  },
  box: {
    backgroundColor: 'rgba(35, 47, 56, 0.15)', // 50% opacity
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    textAlign:'center',
    opacity: '80%',
    alignItems: 'stretch'
    
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    

  },
  input: {
    borderWidth: 2,
    borderRadius: 5,
    borderColor: 'transparent',
    borderBottomColor: 'white',
    padding: 10,
    marginBottom: 20,
    color: 'white',
  },
  button: {
    backgroundColor: '#0066FF',
    borderRadius: 5,
    padding: 10,
    alignItems: 'stretch',
    marginBottom: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  secondaryButton: {
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#0066FF',
    textDecorationLine: 'underline',
  },
});
