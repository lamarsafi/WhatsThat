import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {Component} from 'react'
import {Text, Touchable} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';


export default class Settings extends Component {
    constructor(props){
        super(props)

        this.state = {
            error: ''
        }
    }

    async logOut() {
        console.log("Attempting to log out...")

        return fetch("http://localhost:3333/api/1.0.0/logout", {
            method: "POST",
            headers: {
                "X-Authorization": await AsyncStorage.getItem("whatsthat_session_token")
            }
        })
        .then(async (response)  =>  {
            if(response.status === 200){
                await AsyncStorage.removeItem("whatsthat_session_token")
                await AsyncStorage.removeItem("whatsthat_user_id")
                this.props.navigation.navigate("Login")
                
            } else if(response.status === 401){
                console.log("Unauthorised")
                await AsyncStorage.removeItem("whatsthat_session_token")
                await AsyncStorage.removeItem("whatsthat_user_id")
            } else{
                throw "Something went wrong"
            }
        })
        .catch((error) => {
            console.log(error)
            this.state.error = error
        })
            
        }
        

    


    render(){
        return(
            <>
            <Text>This is your settings screen</Text>
            <TouchableOpacity onPress={this.logOut}>
                <Text> Log out </Text>
            </TouchableOpacity>
            </>
        )
    }
}