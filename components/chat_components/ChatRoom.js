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
  TouchableHighlight,
  Alert
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Modal from "react-native-modal";

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
      isModalVisible: false,
      selectedMessage: null,
      editMode: false, // New state to track if the user is in edit mode
      editedMessage: "", // New state to store the edited message
    };
  }

  componentDidMount() {
    this.getUserIdAndToken();
    this.focusListener = this.props.navigation.addListener("focus", () => {  // add a listener to update the chat details and messages when the screen comes into focus
      this.getChatDetails();
      this.interval = setInterval(() => this.getChatDetails(), 4500); // set an interval to update the chat details and messages every second
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
    
  
    // Function to handle long press on a message
    const handleLongPress = (message) => {
      if (userOwnsMessage) {
        this.setState({ isModalVisible: true, selectedMessage: message });
      }
    };
  
    return (
      <TouchableHighlight
        underlayColor="transparent"
        onLongPress={() => handleLongPress(item)} // Handle long press event
      >
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
      </TouchableHighlight>
    );
  };

  editMessage = () => {
    const { selectedMessage } = this.state;
    this.setState({ editMode: true, editedMessage: selectedMessage.message });
  };
  
  
  confirmEdit = () => {
    const { selectedMessage, editedMessage, token, chatId } = this.state;
    console.log(selectedMessage)
    console.log(editedMessage)

    fetch(`http://localhost:3333/api/1.0.0/chat/${chatId}/message/${selectedMessage.message_id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token
      },
      body: JSON.stringify({
        message: editedMessage
      }),
      
    })
      .then(response => {
        console.log(response);
        if (response.ok) {
          // Handle successful response
          console.log('PATCH request successful');
        } else {
          // Handle error response
          console.error('PATCH request failed');
        }
      })
      .catch(error => {
        // Handle network or other errors
        console.error('Error occurred during PATCH request:', error);
      });
    
  
    this.setState({ editMode: false, editedMessage: "" });
    this.closeModal();
  };

  
  cancelEdit = () => {
    this.setState({ editMode: false, editedMessage: "" });
    this.closeModal();
  };
  
  deleteMessage = () => {
    const { selectedMessage, chatId, token } = this.state;
    fetch(`http://localhost:3333/api/1.0.0/chat/${chatId}/message/${selectedMessage.message_id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token
      },

    })
      .then(response => {
        console.log(response);
        if (response.ok) {
          console.log('Editted succesfully');
        } else {
          console.error('Not edited');
        }
      })
      .catch(error => {
        console.error('Error occurred:', error);
      });

      this.closeModal();
  };
  
  // Add a method to close the modal
  closeModal = () => {
    this.setState({ isModalVisible: false, selectedMessage: null });
  };
  

  render() {
    const { isModalVisible, selectedMessage, editMode, editedMessage } = this.state;
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
          <View style={{ height: 650, marginTop: 60 }}>
            <ScrollView style={{ flex: 1 }}>
              <FlatList
                data={this.state.messages}
                renderItem={this.renderMessageItem}
                keyExtractor={(item, index) => index.toString()}
                inverted
              />
            </ScrollView>
          </View>
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
        <Modal
        isVisible={isModalVisible}
        onBackdropPress={this.closeModal}
      >
        <View style={styles.modalContent}>
          {editMode ? (
            <View>
              <TextInput
                style={styles.editInput}
                onChangeText={(text) => this.setState({ editedMessage: text })}
                value={editedMessage}
              />
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={this.confirmEdit}>
                  <Text style={styles.modalOption}>Confirm</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.cancelEdit}>
                  <Text style={styles.modalOption}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View>
              <TouchableOpacity onPress={this.editMessage}>
                <Text style={styles.modalOption}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.deleteMessage}>
                <Text style={styles.modalOption}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },
  modalOption: {
    fontSize: 16,
    marginBottom: 10,
  },
  editInput: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
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
    height: 5, // or any other specific value
    paddingHorizontal: 10,
    marginTop: 50,
    overflow: "scroll" // or "auto"
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
    position: "fixed",
    width: "100%",
    zIndex: 999, 
    bottom: 0
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
