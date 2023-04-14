import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { Component } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";

export default class Chats extends Component {
  constructor(props) {
    super(props);

    this.state = {
      chats: [],
    };
  }

  async componentDidMount() {
    const token = await AsyncStorage.getItem("whatsthat_session_token");
    const response = await fetch("http://localhost:3333/api/1.0.0/chat", {
      headers: {
        "X-Authorization": token,
      },
    });
    const chats = await response.json();
    this.setState({ chats: chats });
  }

  async getChats() {
    try {
      const token = await AsyncStorage.getItem("whatsthat_session_token");
      const response = await fetch("http://localhost:3333/api/1.0.0/chat", {
        headers: {
          'X-Authorization': token
        }
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const chats = await response.json();
      this.setState({ chats: chats });
    } catch (error) {
      console.error('Error:', error);
    }
  }
  

  componentDidUpdate() {
    this.getChats();
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Your Chats</Text>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("CreateChat")}
          >
            <Image
              source={require("../images/plus.png")}
              style={styles.plusIcon}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.chatList}>
          {this.state.chats.map((chat) => (
            <TouchableOpacity
              style={styles.chatItem}
              key={chat.chat_id}
              onPress={() =>
                this.props.navigation.navigate("ChatRoom", { chatId: chat.chat_id })
              }
            >
              <Text style={styles.chatName}>{chat.name}</Text>
              <Text style={styles.chatLastMessage}>
                {chat.last_message && chat.last_message.author &&
                  chat.last_message.author.first_name &&
                  chat.last_message.author.first_name}{" "}
                {chat.last_message && chat.last_message.author &&
                  chat.last_message.author.last_name &&
                  chat.last_message.author.last_name}:{" "}
                {chat.last_message && chat.last_message.message}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  plusIcon: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  chatList: {
    flex: 1,
  },
  chatItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  chatName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  chatLastMessage: {
    fontSize: 16,
  },
});
