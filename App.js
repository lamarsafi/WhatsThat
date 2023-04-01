import React, { useState, Component } from 'react';
import { StyleSheet, View, ImageBackground } from 'react-native';
import { Login } from './components/Login';
import { Register } from './components/Register';
import Home from './components/Home'
import {Profile} from './components/Profile';
import SecondLogin from './components/Login'
import SecondRegister from './components/Register';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator, useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { registerAsset } from 'react-native-web/dist/cjs/modules/AssetRegistry';
import Screens from './components/Screens';
import BlockedContacts from './components/BlockedContacts';


const AuthStack = createStackNavigator();





export default function App() {
 
  


  return (
    <ImageBackground
      source={require('./images/bg4.jpg')}
      style={styles.container}
    >
      <NavigationContainer>
        <AuthStack.Navigator
        screenOptions={{
          headerShown: false
        }}>
          
          <AuthStack.Screen name='Screen' component={Screens} />
          <AuthStack.Screen name='Home' component={Home} />
          <AuthStack.Screen name='BlockedContacts' component={BlockedContacts}  />
          
          <AuthStack.Screen name='LoginScreen' component={SecondLogin} />
          <AuthStack.Screen name='Register' component={SecondRegister} />
          <AuthStack.Screen name='Profile' component={Profile} />

        </AuthStack.Navigator>
       {/*  <Tabs.Navigator
          screenOptions={{
            headerShown: false
          }}
        >
          <Tabs.Screen name='Home' component={HomeStackScreen} />
          <Tabs.Screen name='Profile' component={ProfileStackScreen} />
          
        </Tabs.Navigator> */}
      </NavigationContainer>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
});
