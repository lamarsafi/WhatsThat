import React, { Component } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import IonIcons from 'react-native-vector-icons/Ionicons';
import Home from './components/Home';
import Contacts from './components/Contacts';
import UserSettings from './components/Settings';
import { Profile } from './components/Profile';
import SecondLogin from './components/Login';
import SecondRegister from './components/Register';
import Chats from './components/Chats';
import BlockedContacts from './components/BlockedContacts';
import Search from './components/Search';
import ChatRoom from './components/chat_components/ChatRoom.js'



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
            <AuthStack.Screen name="Login" component={SecondLogin} options={{ headerShown: false }} />
            <AuthStack.Screen name="Register" component={SecondRegister} options={{ headerShown: false }} />
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
                    

                    if (route.name === 'Home') {
                      iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Contacts') {
                      iconName = focused ? 'send' : 'send-outline';
                    } else if (route.name === 'Search') {
                      iconName = focused ? 'search' : 'search-outline';
                    }else if (route.name === 'Settings') {
                      iconName = focused ? 'settings' : 'settings-outline';
                    } else if (route.name === 'Chats') {
                      iconName = focused ? 'chatbox' : 'chatbox-ellipses-outline';
                    }
                    
                    return <IonIcons name={iconName} size={size} color={color} />;
                  },
                })}
              >
                <Tab.Screen name="Home" component={Home} options={{ headerShown: false }}/>
                <Tab.Screen name="Chats" component={Chats} options={{ headerShown: false }}/>
                <Tab.Screen name="Contacts" component={Contacts} options={{ headerShown: false }}/>
                <Tab.Screen name="Search" component={Search} options={{ headerShown: false }}/>
                <Tab.Screen name="Settings" component={UserSettings} options={{ headerShown: false }}/>
              </Tab.Navigator>
            )}
          </Stack.Screen>
          <Stack.Screen name="BlockedContacts" component={BlockedContacts} options={{ headerShown: false }}/>
          <Stack.Screen name="ChatRoom" component={ChatRoom} options={{ headerShown: false }}/>
          <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }}/>
          
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default App;
