import React, { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { Login } from './components/Login';
import { Register } from './components/Register';
import Home from './components/Home';
import { Profile } from './components/Profile';
import SecondLogin from './components/Login';
import SecondRegister from './components/Register';
import Screens from './components/Screens';
import BlockedContacts from './components/BlockedContacts';
import Contacts from './components/Contacts';
import Settings from './components/Settings';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const AuthStack = createStackNavigator();
const Tabs = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const ContactStack = createStackNavigator();
const SettingsStack = createStackNavigator();

const HomeStackScreen = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name='HomeMain' component={Home} options={{ title: 'Home' }} />
    </HomeStack.Navigator>
  );
};

const ProfileStackScreen = () => {
  
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen name='ProfileMain' component={Profile} />
    </ProfileStack.Navigator>
  );
};

const ContactStackScreen = () => {
  return (
    <ContactStack.Navigator>
      <ContactStack.Screen name='ContactContacts' component={Contacts} options={{ headerShown: false }}/>
    </ContactStack.Navigator>
  );
};

const SettingsStackScreen = () => {
  return (
    <SettingsStack.Navigator>

      <SettingsStack.Screen name='SettingsStack' component={Settings} options={{ headerShown: false }} />
    </SettingsStack.Navigator>
  );
};

const AuthStackScreen = () => {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen name='SecondLogin' component={SecondLogin} options={{ headerShown: false }}/>
      <AuthStack.Screen name='SecondRegister' component={SecondRegister} options={{ headerShown: false }}/>
    </AuthStack.Navigator>
  );
};

const Stack = createStackNavigator();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <Tabs.Navigator>
          <Tabs.Screen name='Home' component={HomeStackScreen} />
          <Tabs.Screen name='Profile' component={ProfileStackScreen} />
          <Tabs.Screen name='Contacts' component={ContactStackScreen} />
          <Tabs.Screen name='Settings' component={SettingsStackScreen} />
        </Tabs.Navigator>
      ) : (
        <Stack.Screen name="Login">
          {props => <LoginScreen {...props} handleLogin={handleLogin} />}
        </Stack.Screen>
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
});
