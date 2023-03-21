import React, { useState } from 'react';
import { StyleSheet, View, ImageBackground } from 'react-native';
import { Login } from './components/Login';
import { Register } from './components/Register';

export default function App() {
  const [screen, setScreen] = useState('login');

  const handleFormSwitch = (screenName) => {
    setScreen(screenName);
  };

  return (
    <ImageBackground
    source={require('./images/bg4.jpg')}
    style={styles.container}
  >
      <View>
        
        {screen === 'login' && <Login onFormSwitch={handleFormSwitch} />}
        {screen === 'register' && <Register onFormSwitch={handleFormSwitch} />}
      </View>
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
