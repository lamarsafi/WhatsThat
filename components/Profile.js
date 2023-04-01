import React, { useState, Component } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Button, Image } from 'react-native';

import defaultImage from '../images/default.jpeg'

export class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      image: null,
      error: null,
      file: null,
    };
  }

  async componentDidMount() {
    try {
      const id = await AsyncStorage.getItem("whatsthat_user_id");
      const token = await AsyncStorage.getItem("whatsthat_session_token");
      const response = await fetch(`http://localhost:3333/api/1.0.0/user/${id}/photo`, {
        headers: {
          'X-Authorization': `${token}`,
        },
      });
      const imageData = await response.blob();
      const imageUrl = URL.createObjectURL(imageData);
      this.setState({ image: imageUrl });
    } catch (error) {
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

    try {
      const id = await AsyncStorage.getItem("whatsthat_user_id");
      const response = await fetch(`http://localhost:3333/api/1.0.0/user/${id}/photo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const data = await response.json();
      console.log(data);
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
