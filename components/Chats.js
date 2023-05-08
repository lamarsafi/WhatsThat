import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { Component } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, TextInput } from "react-native";
import Modal from "react-native-modal";
import { Dimensions } from "react-native";


const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default class Chats extends Component {
  constructor(props) {
    super(props);

    this.state = {
      chats: [],
      isModalVisible: false,
      chatName: "",
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
    // Clear the previous interval if it exists
    if (this.chatsInterval) {
      clearInterval(this.chatsInterval);
    }
  
    // Set a new interval to call getChats every 5 seconds
    this.chatsInterval = setInterval(() => {
      this.getChats();
    }, 5000); 
  }

  toggleModal = () => {
    this.setState((prevState) => ({
      isModalVisible: !prevState.isModalVisible,
    }));
  };

  confirmCreateChat = async () => {
    const { chatName } = this.state;
    const token = await AsyncStorage.getItem('whatsthat_session_token')
    console.log(token)
    

    fetch('http://localhost:3333/api/1.0.0/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Authorization': token
          },
          body: JSON.stringify({
            "name": chatName,
          }),
        })

    this.toggleModal();
  };
  

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Your Chats</Text>
          <TouchableOpacity
            onPress={this.toggleModal}
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
              <Text>
                {/* Display the first name of the author of the last message */}
                <Text>
                <Text style={styles.authorName}>{chat.last_message && chat.last_message.author &&
                  chat.last_message.author.first_name &&
                  chat.last_message.author.first_name}{" "}
                  </Text>
                  
                
                {/* Display the last name of the author of the last message */}
                {chat.last_message && chat.last_message.author &&
                  chat.last_message.author.last_name && (
                    <Text style={styles.authorName}>
                      {chat.last_message.author.last_name}:{" "}
                    </Text>
                  )}

                {/* Display the content of the last message */}
                <Text>
                  {chat.last_message && chat.last_message.message &&
                    (chat.last_message.message.length > 15
                      ? chat.last_message.message.slice(0, 15) + "..."
                      : chat.last_message.message)}{" "}
                </Text>

                {/* Display the timestamp of the last message */}
                <Text style={styles.boldText}>
                  {chat.last_message &&
                    chat.last_message.timestamp &&
                    new Date(chat.last_message.timestamp * 1000).toLocaleTimeString()}
                </Text>

                </Text>
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Modal visible={this.state.isModalVisible} animationType="none">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TextInput
                style={styles.textInput}
                onChangeText={(text) => this.setState({ chatName: text })}
                value={this.state.chatName}
                placeholder="Enter chat name"
              />
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.confirmButton} onPress={this.confirmCreateChat}>
                  <Text style={styles.buttonText}>Confirm</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={this.toggleModal}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          </Modal>

      </View>


      
    );
  }
}



const styles = StyleSheet.create({
  modalContainer: {
    position: "absolute",
    left:-20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    width: windowWidth,
    height: windowHeight,
  },
  
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    height: 125,
  },
  textInput: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  confirmButton: {
    backgroundColor: 'green',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  cancelButton: {
    backgroundColor: 'red',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
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
  chatLastMessage: {
    // Your existing styles for the chat last message
  },
  boldText: {
    fontWeight: 'bold',
    
  },
  authorName: {
    fontWeight: 'bold',
    fontStyle: 'italic'
  },
});


