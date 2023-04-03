import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { Component } from "react"


export default class Chats extends Component {
    constructor(props){
        super(props)

        this.state = {
            id: null,
            token: null,
        }
    }

    componentDidMount(){
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
            this.checkLoggedIn();
        })
      }
  
      componentWillUnmount(){
          this.unsubscribe();
      }
  
      checkLoggedIn = async () => {
          const userToken = await AsyncStorage.getItem('whatsthat_session_token');
          const userId = await AsyncStorage.getItem('whatsthat_user_id')
          console.log(value)
          if(userToken != null) {
              this.state.id = userId
              this.state.token = userToken

          }
      }

      render(){
        return (
            
        )
      }
}