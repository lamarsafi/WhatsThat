import React, { useState, Component } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Button, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';

export class ChangeName extends Component {
  constructor(props) {
    super(props);

    this.state = {
        firstName: '',
        lastName: '',
        firstNameError: false,
        lastNameError: false,
        isModalVisible: false,
    };
  }

  handleFirstNameChange = (text) => {
    this.setState({ firstName: text, firstNameError: false });
  };

  handleLastNameChange = (text) => {
    this.setState({ lastName: text, lastNameError: false });
  };

  validateFields = () => {
    const { firstName, lastName } = this.state;
    let isValid = true;

    if (firstName.trim() === '') {
      this.setState({ firstNameError: true });
      isValid = false;
    }

    if (lastName.trim() === '') {
      this.setState({ lastNameError: true });
      isValid = false;
    }

    return isValid;
  };

  submitChanges = async() => {

    if (!this.validateFields()) {
        return;
      }
      
    const { firstName, lastName } = this.state;
    const userId = await AsyncStorage.getItem("whatsthat_user_id"); 
    const token = await AsyncStorage.getItem("whatsthat_session_token")
  
    const url = `http://localhost:3333/api/1.0.0/user/${userId}`;
  
    const headers = {
      "Content-Type": "application/json",
      'X-Authorization': `${token}`,
    };
  
    const body = JSON.stringify({ 
        first_name: firstName,
        last_name: lastName });
  
    fetch(url, {
      method: "PATCH",
      headers,
      body,
    })
      .then((response) => {
        console.log(response)
        if (response.ok) {
            this.showSuccessModal();
        } 
      })
  };

  showSuccessModal = () => {
    this.setState({ isModalVisible: true }); 
  };

  hideModal = () => {
    this.setState({ isModalVisible: false }); 
  };
  

  render() {
    const { firstName, lastName, firstNameError, lastNameError } = this.state;

    return (
        <View style={styles.container}>
          <View style={styles.userSettings}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => this.props.navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={25} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Change Your Name</Text>
          </View>
  
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="First Name"
              value={firstName}
              onChangeText={this.handleFirstNameChange}
            />
            {firstNameError && (
              <Text style={styles.errorText}>Please enter your first name</Text>
            )}
  
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              value={lastName}
              onChangeText={this.handleLastNameChange}
            />
            {lastNameError && (
              <Text style={styles.errorText}>Please enter your last name</Text>
            )}
  
            <TouchableOpacity style={styles.submitButton} onPress={this.submitChanges}>
              <Text style={styles.submitButtonText}>Submit Changes</Text>
            </TouchableOpacity>
          </View>

        <Modal
          isVisible={this.state.isModalVisible}
          onBackdropPress={this.hideModal}
          backdropOpacity={0.5}
          backdropColor="#000"
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Changes were successfully made!</Text>
            <Button title="OK" onPress={this.hideModal} />
          </View>
        </Modal>
      </View>
    );
  }
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
    backgroundColor: '#3498db',
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
  inputContainer: {
    alignItems: 'center',
    
  },
  input: {
    width: '300px',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  submitButton: {
    marginTop: 10,
    backgroundColor: '#3498db',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: '300px',
    borderRadius: 5,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    marginTop: 5,
    fontSize: 12,
  },
  
});
