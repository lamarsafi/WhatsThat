import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {Component} from 'react'
import {Text, Touchable} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native'; // Import the hook
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './Home';
import { Profile } from './Profile';
import Settings from './Settings';
const Tab = createBottomTabNavigator();

export default class BlockedContacts extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            error: ''
        };

    }


    render(){
        return(
            <>
            <Text>Blocked contacts</Text>


            </>
        )
    }
}
