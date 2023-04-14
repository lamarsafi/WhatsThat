import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";

// TODO: better styling, chatroom settings implementation

export default class ChatRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chatId: this.props.route.params.chatId,
      chatName: "",
      messages: [],
      text: "",
      userId: null,
      token: null,
    };
  }

  componentDidMount() {
    this.getUserIdAndToken();
    this.focusListener = this.props.navigation.addListener("focus", () => {  // add a listener to update the chat details and messages when the screen comes into focus
      this.getChatDetails();
      this.interval = setInterval(() => this.getChatDetails(), 1000); // set an interval to update the chat details and messages every second
    }); 
    this.blurListener = this.props.navigation.addListener("blur", () => {
      clearInterval(this.interval);
    });
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    this.focusListener();
    this.blurListener();
  }

  async getUserIdAndToken() { // this function sets the states for both userId & token using AsyncStorage
    try {
      const userId = await AsyncStorage.getItem("whatsthat_user_id");
      const token = await AsyncStorage.getItem("whatsthat_session_token");
      if (userId !== null && token !== null) {
        this.setState({ userId: userId, token: token });
      }
    } catch (e) {
      console.log("Failed to fetch the user id and token from storage.");
    }
  }

  async getChatDetails() { 
    try {
      const response = await fetch(
        `http://localhost:3333/api/1.0.0/chat/${this.state.chatId}`,
        {
          headers: {
            "X-Authorization": await AsyncStorage.getItem(
              "whatsthat_session_token"
            ),
          },
        }
      );
      const responseJson = await response.json();
      this.setState({   // Update the state with the chat name and messages
        chatName: responseJson.name,
        messages: responseJson.messages,
      });
    } catch (e) {
      console.log("Failed to fetch chat details from the server.");
    }
  }

  async sendMessage() {
    if (this.state.text === "") {
      return;
    }
    try {
      await fetch(
        `http://localhost:3333/api/1.0.0/chat/${this.state.chatId}/message`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Authorization": await AsyncStorage.getItem(
              "whatsthat_session_token"
            ),
          },
          body: JSON.stringify({
            message: this.state.text,
          }),
        }
      );

      this.setState({ text: "" });
    } catch (e) {
      console.log("Failed to send message to the server.");
    }
  }

  renderMessageItem = ({ item }) => {
    const { userId } = this.state;
    const userOwnsMessage = item.author.user_id == userId;
    console.log("my id", userId);
    console.log(userOwnsMessage);
    console.log(item.author.user_id);
    return (
      <View
        style={[
          styles.messageContainer,
          userOwnsMessage
            ? styles.ownMessageContainer
            : styles.otherMessageContainer,
        ]}
      >
        <View
          style={[
            styles.messageContent,
            userOwnsMessage
              ? styles.ownMessageContent
              : styles.otherMessageContent,
          ]}
        >
          <Text style={styles.messageText}>{item.message}</Text>
          {!userOwnsMessage && (
            <Text style={styles.messageAuthorText}>
              From: {item.author.first_name} {item.author.last_name}
            </Text>
          )}
        </View>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.fixedContainer}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => this.props.navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={30} color="white" />
            </TouchableOpacity>
            <Text style={styles.chatName}>{this.state.chatName}</Text>
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={() =>
                this.props.navigation.navigate("ChatSettings", {
                  chatId: this.state.chatId,
                })
              }
            >
              <Ionicons name="settings-outline" size={30} color="white" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.messageListContainer}>
            <FlatList
              data={this.state.messages}
              renderItem={this.renderMessageItem}
              keyExtractor={(item, index) => index.toString()}
              inverted
            />
          </ScrollView>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            onChangeText={(text) => this.setState({ text })}
            value={this.state.text}
            placeholder="Type a message"
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={() => this.sendMessage()}
          >
            <Ionicons name="send" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  fixedContainer: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2196F3",
    padding: 10,
    position: "fixed",
    width: "100%",
    zIndex: 999, 
  },
  backButton: {
    marginRight: 10,
  },
  chatName: {
    flex: 1,
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
  },
  settingsButton: {
    marginLeft: 10,
  },
  messageListContainer: {
    flex: 1,
    paddingHorizontal: 10,
    marginTop: 80, 
  },
  messageContainer: {
    marginVertical: 5,
    flexDirection: "row",
  },
  ownMessageContainer: {
    justifyContent: "flex-end",
  },
  otherMessageContainer: {
    justifyContent: "flex-start",
  },
  messageContent: {
    backgroundColor: "#F5F5F5",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  ownMessageContent: {
    backgroundColor: "#DCF8C5",
  },
  otherMessageContent: {
    backgroundColor: "#bbbfbf",
  },
  messageText: {
    fontSize: 12,
    color: "black",
    fontWeight: "600",
  },

  messageAuthorText: {
    fontSize: 8,
    color: "black",
    fontWeight: "200",
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#DDDDDD",
  },
  textInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#2196F3",
    borderRadius: 20,
    padding: 10,
  },
});
