import React, { useState, Component } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Button, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';

export class ChangePassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      password: '',
      passwordError: false,
      isModalVisible: false,
    };
  }

  handlePasswordChange = (text) => {
    this.setState({ password: text, passwordError: false });
  };

  validateFields = () => {
    const { password } = this.state;
    let isValid = true;

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (password.trim() === '') {
      this.setState({ passwordError: true });
      isValid = false;
    } else if (!passwordRegex.test(password)) {
      this.setState({ passwordError: true });
      isValid = false;
    }

    return isValid;
  };

  submitChanges = async () => {
    if (!this.validateFields()) {
      return;
    }

    const { password } = this.state;
    const userId = await AsyncStorage.getItem('whatsthat_user_id');
    const token = await AsyncStorage.getItem('whatsthat_session_token');

    const url = `http://localhost:3333/api/1.0.0/user/${userId}`;

    const headers = {
      'Content-Type': 'application/json',
      'X-Authorization': `${token}`,
    };

    const body = JSON.stringify({
      password: password,
    });

    fetch(url, {
      method: 'PATCH',
      headers,
      body,
    })
      .then((response) => {
        console.log(response);
        if (response.ok) {
          this.showSuccessModal();
        }
      });
  };

  showSuccessModal = () => {
    this.setState({ isModalVisible: true });
  };

  hideModal = () => {
    this.setState({ isModalVisible: false });
  };

  render() {
    const { password, passwordError } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.userSettings}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => this.props.navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={25} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Change Your Password</Text>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={true}
            value={password}
            onChangeText={this.handlePasswordChange}
          />
          {passwordError && (
            <Text style={styles.errorText}>Please enter a valid password</Text>
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
            <Text style={styles.modalText}>Your password was successfully changed!</Text>
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
    backgroundColor: '#fff',
  },
  userSettings: {
    backgroundColor: '#2f95dc',
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    paddingRight: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  inputContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center'
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  submitButton: {
    backgroundColor: '#2f95dc',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
});

