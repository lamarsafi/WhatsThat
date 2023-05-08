import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Modal } from 'react-native';

export default class SecondLogin extends Component {
  
    constructor(props) {
        super(props);

        this.state = {
            name: null,
            password: null,
            error: null,
            showModal: false,
        }
    }

    componentDidMount(){
      this.unsubscribe = this.props.navigation.addListener('focus', () => {
          this.checkLoggedIn();
      })
    }

    componentWillUnmount(){
        this.unsubscribe();
    }

    checkLoggedIn = async () => {
        const value = await AsyncStorage.getItem('whatsthat_session_token');
        console.log(value)
        if(value != null) {
          
        }
    }

    handleChange = (key, value) => {
      this.setState({ [key]: value });
      
    }

    handleSubmit = (e) => {
      fetch('http://localhost:3333/api/1.0.0/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: this.state.email,
          password: this.state.password,
        }),
      })
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else {
            throw new Error("Incorrect email/password");
          }
        })
        .then(async (responseJSON) => {
          console.log(responseJSON);
          try {
            await AsyncStorage.setItem("whatsthat_user_id", responseJSON.id);
            await AsyncStorage.setItem("whatsthat_session_token", responseJSON.token);
            window.location.reload();
          } catch {
            throw new Error("An error has occurred");
          }
        })
        .catch((error) => {
          console.error(error);
          this.setState({ error: "Incorrect email/password", showModal: true });
        });
    };
  
    render() {
      return (
        <View style={styles.container}>
          <View style={styles.box}>
            <Text style={styles.title}>Login</Text>
            <TextInput
              style={styles.input}
              value={this.state.email}
              onChangeText={(value) => this.setState({ email: value })}
              placeholder="youremail@gmail.com"
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              value={this.state.password}
              onChangeText={(value) => this.setState({ password: value })}
              placeholder="*******"
              secureTextEntry={true}
            />
  
            <TouchableOpacity style={styles.button} onPress={this.handleSubmit}>
              <Text style={styles.buttonText}>Log In</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => this.props.navigation.navigate('Register')}
            >
              <Text style={styles.secondaryButtonText}>Don't have an account? Sign up here!</Text>
            </TouchableOpacity>
          </View>
  
          {/* Modal pop-up */}
          <Modal
            visible={this.state.showModal}
            transparent={true}
            animationType="fade"
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.errorText}>{this.state.error}</Text>
                <Button style={styles.modalButton}
                  title="Close"
                  onPress={() => this.setState({ showModal: false })}
                />
              </View>
            </View>
          </Modal>
        </View>
      );
    }


}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
     
      
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
      color: '#1F1F1F',
      marginBottom: 20,
      
      
  
    },
    input: {
      borderWidth: 2,
      borderRadius: 5,
      borderColor: 'transparent',
      borderBottomColor: 'white',
      padding: 10,
      marginBottom: 20,
      color: 'black',
      
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
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      borderRadius: 5
    },
    modalContent: {
      backgroundColor: '#FFFFFF',
      borderRadius: 10,
      padding: 20,
      alignItems: 'center',
      borderRadius: 5
    },
    errorText: {
      fontSize: 18,
      marginBottom: 10,
      textAlign: 'center',
      color: 'red',
    },
    modalButton: {
      borderRadius: 10
    }
  });
  