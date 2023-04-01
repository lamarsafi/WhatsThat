import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {Component} from 'react'
import {Text, Touchable} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native'; // Import the hook


export default class Settings extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            error: ''
        };
        this.sendToLogin = this.sendToLogin.bind(this);
        this.logOut = this.logOut.bind(this);
    }

    sendToLogin() {
        console.log("Sending..")
        this.props.navigation.navigate("LoginScreen")
    }


        
        
      
         handlePress = () => {
        const navigation = useNavigation();
          navigation.navigate('DetailsScreen');
        }
   

    async logOut() {
        console.log("Attempting to log out...")

        try {
            const response = await fetch("http://localhost:3333/api/1.0.0/logout", {
                method: "POST",
                headers: {
                    "X-Authorization": await AsyncStorage.getItem("whatsthat_session_token")
                }
            });

            if(response.status === 200){
                console.log("logged out")
                await AsyncStorage.removeItem("whatsthat_session_token")
                await AsyncStorage.removeItem("whatsthat_user_id")
                this.sendToLogin();
                
            } else if(response.status === 401){
                console.log("Unauthorised")
                await AsyncStorage.removeItem("whatsthat_session_token")
                await AsyncStorage.removeItem("whatsthat_user_id")
                this.sendToLogin();
            } else{
                throw "Something went wrong"
            }
        } catch (error) {
            console.log(error)
            this.setState({ error });
        }
    }

    render(){
        return(
            <>
            <Text>This is your settings screen</Text>
            <TouchableOpacity onPress={this.logOut}>
                <Text> Log out </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.handlePress}>
                <Text> View blocked contacts </Text>
            </TouchableOpacity>
            </>
        )
    }
}
