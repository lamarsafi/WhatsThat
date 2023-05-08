import React, { Component } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import IonIcons from 'react-native-vector-icons/Ionicons';
import UserSettings from './components/Settings';
import { Profile } from './components/Profile';
import Login from './components/Login';
import Register from './components/Register';
import Chats from './components/Chats';
import BlockedContacts from './components/BlockedContacts';
import Search from './components/Search';
import ChatRoom from './components/chat_components/ChatRoom.js'
import ChatSettings from './components/chat_components/ChatSettings';
import { ChangeName } from './components/ChangeName';
import {ChangeEmail} from './components/ChangeEmail';
import { ChangePassword } from './components/ChangePassword';



const AuthStack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasToken: false,
    };
  }

  async componentDidMount() {
    const token = await AsyncStorage.getItem('whatsthat_session_token');
    if (token) {
      this.setState({ hasToken: true });
    }
  }

  componentWillUnmount(){
    this.unsubscribe();
}

checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('whatsthat_session_token');
    console.log(value)
    if(value != null) {
        this.props.navigation.navigate('Home');
    }
  }

  render() {
    const { hasToken } = this.state;
    if (!hasToken) {
      return (
        <NavigationContainer>
          <AuthStack.Navigator>
            <AuthStack.Screen name="Login" component={Login} options={{ headerShown: false }} />
            <AuthStack.Screen name="Register" component={Register} options={{ headerShown: false }} />
          </AuthStack.Navigator>
        </NavigationContainer>
      );
    }

    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Main" options={{ headerShown: false }}>
            {() => (
              <Tab.Navigator
                screenOptions={({ route }) => ({
                  tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    

                    if (route.name === 'Search') {
                      iconName = focused ? 'search' : 'search-outline';
                    }else if (route.name === 'Settings') {
                      iconName = focused ? 'settings' : 'settings-outline';
                    } else if (route.name === 'Chats') {
                      iconName = focused ? 'chatbox' : 'chatbox-ellipses-outline';
                    } else if (route.name === 'Profile') {
                      iconName = focused ? 'person' : 'person-outline';
                    }
                    
                    return <IonIcons name={iconName} size={size} color={color} />;
                  },
                })}
              >
                
                <Tab.Screen name="Chats" component={Chats} options={{ headerShown: false }}/>
                <Tab.Screen name="Search" component={Search} options={{ headerShown: false }}/>
                <Tab.Screen name="Profile" component={Profile} options={{ headerShown: false }}/>
                <Tab.Screen name="Settings" component={UserSettings} options={{ headerShown: false }}/>
              </Tab.Navigator>
            )}
          </Stack.Screen>
          <Stack.Screen name="BlockedContacts" component={BlockedContacts} options={{ headerShown: false }}/>
          <Stack.Screen name="ChatRoom" component={ChatRoom} options={{ headerShown: false }}/>
          <Stack.Screen name="ChatSettings" component={ChatSettings} options={{ headerShown: false }}/>
          <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }}/>
          <Stack.Screen name="ChangeName" component={ChangeName} options={{ headerShown: false }}/>
          <Stack.Screen name="ChangeEmail" component={ChangeEmail} options={{ headerShown: false }}/>
          <Stack.Screen name="ChangePassword" component={ChangePassword} options={{ headerShown: false }}/>
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default App;
