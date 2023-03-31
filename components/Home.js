import React, { Component } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SecondLogin from './Login';
import SecondRegister from './Register';
import { Profile } from './Profile';

const Tab = createBottomTabNavigator();

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedIn: false,
    };
  }

  render() {
    return (
      <>
      <Text>This a home screen</Text>
      <Text>Testing if github is workidwasdng</Text>
      </>
    );
  }
}


