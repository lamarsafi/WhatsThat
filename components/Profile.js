import React, { useState, Component } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Button } from 'react-native';

export class Profile extends Component {
    constructor(props) {
      super(props);
      this.state = {
        userName: 'Profile'
      };
    }
  
    render() {
      return (
        <View>
          <Text>{this.state.userName}</Text>
        </View>
      );
    }
  }
  