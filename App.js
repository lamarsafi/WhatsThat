import React, {useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import './css/AppStyle.css';
import { Login } from './components/Login';
import { Register } from '/components/Register';



export default function App() {
  const [currentForm, setCurrentForm] = useState('login');

  const toggleForm = (formName) => {
    setCurrentForm(formName);
  }
  return (
  <div className='App'>
    {
      currentForm === 'login' ? <Login onFormSwitch={toggleForm} /> : <Register onFormSwitch={toggleForm} />
    }
  </div>
   
      
      
   
  );
}


