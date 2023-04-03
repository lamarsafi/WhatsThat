import React, {Component} from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Button } from 'react-native';
import Home from './Home';
import Register from './Register';
import Login from './Login';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Profile } from './Profile';
import Settings from './Settings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Contacts from './Contacts';
import { createStackNavigator } from '@react-navigation/stack';

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const ContactStack = createStackNavigator();
const SettingsStack = createStackNavigator();


const HomeStackScreen = () => {
    <HomeStack.Navigator>
        <HomeStack.Screen name='Home' component={Home} />
        <HomeStack.Screen name='Profile' component={Profile} /> 
        <HomeStack.Screen name='Contacts' component={Contacts}/> 
        <HomeStack.Screen name='Settings' component={Settings} />
    </HomeStack.Navigator>
}

const ProfileStackScreen = () => {
    <ProfileStack.Navigator>
        <ProfileStack.Screen name='Profile' component={Profile} />
    </ProfileStack.Navigator>
}

const ContactStackScreen = () => {
    <ContactStack.Navigator>
        <ContactStack.Screen name='Home' component={Home} />
        <ContactStack.Screen name='Profile' component={Profile} /> 
        <ContactStack.Screen name='Contacts' component={Contacts}/> 
        <ContactStack.Screen name='Settings' component={Settings} />
    </ContactStack.Navigator>
}

const SettingsStackScreen = () => {
    <SettingsStack.Navigator>
        <SettingsStack.Screen name='Home' component={Home} />
        <SettingsStack.Screen name='Profile' component={Profile} /> 
        <SettingsStack.Screen name='Contacts' component={Contacts}/> 
        <SettingsStack.Screen name='Settings' component={Settings} />
    </SettingsStack.Navigator>
}

export default class Screens extends Component {
    constructor(props) {
        super(props)

        this.state = {
            loggedIn: false
        }
    }


    render() {
        return (
          <Tab.Navigator>
            <Tab.Screen name='Home' component={HomeStackScreen} /> 
            <Tab.Screen name='Profile' component={ProfileStackScreen} /> 

          </Tab.Navigator> 
        );
      }
}