import React, { useState, Component } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Button, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import defaultImage from '../images/default.jpeg'

export class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      image: null,
      error: null,
      file: null,
      token: null,
    };
  }

  async componentDidMount() {
    this.state.token = await AsyncStorage.getItem('whatsthat_session_token')
    console.log("this", this.state.token)
    try {
      const id = await AsyncStorage.getItem("whatsthat_user_id");
      const token = await AsyncStorage.getItem("whatsthat_session_token");
      const response = await fetch(`http://localhost:3333/api/1.0.0/user/${id}/photo`, {
        headers: {
          'X-Authorization': `${token}`,
        },
      });
      const imageData = await response.blob();
      console.log(imageData)
      const imageUrl = URL.createObjectURL(imageData);
      console.log(imageUrl)
      this.setState({ image: imageUrl });
    } catch (error) {
      console.log(error)
      this.setState({ image: defaultImage, error });
    }
  }
  

  handleFileSelect = (event) => {
    this.setState({ file: event.target.files[0] });
  }

  handleSubmit = async (event) => {
    event.preventDefault();

    const { file } = this.state;

    if (!file) {
      alert('Please select an image file.');
      return;
    }

    const formData = new FormData();
    formData.append('photo', file);
    console.log(file)

    try {
      const id = await AsyncStorage.getItem("whatsthat_user_id");
      const response = await fetch(`http://localhost:3333/api/1.0.0/user/${id}/photo`, {
        method: 'POST',
        headers: {
          'X-Authorization': this.state.token,
          'Content-Type': file.type
          
        },
        body: file,
      });

      console.log(response)
      
      
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    const { image, error } = this.state;

    if (error) {
      return <div>Error: {error.message}</div>;
    }

    if (!image) {
      return <div>Loading...</div>;
    }

    return (
      <View style={styles.container}>
        <View style={styles.userSettings}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => this.props.navigation.goBack()}>
            <Ionicons name="arrow-back" size={25} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Your Profile</Text>
        </View>
        <Image source={{ uri: image }} style={styles.image} />
    
        <TouchableOpacity onPress={this.handleSubmit} style={styles.button}>
          <Text style={styles.buttonText}>Upload Image</Text>
        </TouchableOpacity>
    
        <input type="file" onChange={this.handleFileSelect} style={styles.input} />
      </View>
    );
    
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  input: {
    marginTop: 10,
  },
});
