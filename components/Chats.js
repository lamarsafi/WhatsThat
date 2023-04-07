import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { Component } from "react"
import { Text } from "react-native-web";


export default class Chats extends Component {
    constructor(props){
        super(props)

        this.state = {
            id: null,
            token: null,
        }
    }


      render(){
        return (
            <Text>Hello</Text>
        )
      }
}