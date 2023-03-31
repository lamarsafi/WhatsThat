import React, {Component} from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Button } from 'react-native';
import Home from './Home';
import Register from './Register';
import Login from './Login';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Profile } from './Profile';
import Settings from './Settings';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createBottomTabNavigator();

export default class Screens extends Component {
    constructor(props) {
        super(props)

        this.state = {
            loggedIn: false
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
        if(value == null) {
            this.props.navigation.navigate('Login');
        }
    }

    render() {
        return (
          <Tab.Navigator>
            <Tab.Screen name='Home' component={Home} /> 
            <Tab.Screen name='Profile' component={Profile} /> 
            <Tab.Screen name='Login' component={Login} /> 
            <Tab.Screen name='Register' component={Register} /> 
            <Tab.Screen name='Settings' component={Settings} /> 
          </Tab.Navigator>
        );
      }
}