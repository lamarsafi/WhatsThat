import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";

// TODO LIST =>
// TODO: Add a "leave chat" button for the user to be able to leave.

export default class ChatSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chatId: this.props.route.params.chatId,
      chatInfo: null,
      userId: null,
      contacts: [],
    };
  }

  async componentDidMount() {
    await this.fetchData();
  }


  fetchData = async () => {
    try {
      const userId = await AsyncStorage.getItem("whatsthat_user_id");
      this.setState({ userId });

      const token = await AsyncStorage.getItem("whatsthat_session_token");
      const response = await fetch(
        `http://localhost:3333/api/1.0.0/chat/${this.state.chatId}`,
        {
          headers: {
            "X-Authorization": token,
          },
        }
      );
      const data = await response.json();
      this.setState({ chatInfo: data });

      const contactsResponse = await fetch(
        "http://localhost:3333/api/1.0.0/contacts",
        {
          headers: {
            "X-Authorization": token,
          },
        }
      );
      const contactsData = await contactsResponse.json();
      const filteredContacts = contactsData.filter((contact) => {
        return !data.members.some(
          (member) => member.user_id === contact.user_id
        );
      });
      this.setState({ contacts: filteredContacts });
    } catch (error) {
      console.error(error);
    }
  };


  handleRemoveMember = async (memberId) => {
    try {
      const token = await AsyncStorage.getItem("whatsthat_session_token");
      const chatId = this.state.chatId;
      const response = await fetch(`http://localhost:3333/api/1.0.0/chat/${chatId}/user/${memberId}`, {
        method: 'DELETE',
        headers: {
          'X-Authorization': token,
        },
      });
      console.log(response)
      if (response.status === 200) {
        
        this.fetchData()
      } else {
        console.log('Failed to remove member from chat');
      }
    } catch (error) {
      console.error(error);
    }
  };
  

  handleAddToChat = async (userId) => {
    try {
      const token = await AsyncStorage.getItem("whatsthat_session_token");
      const chatId = this.state.chatId;
      const response = await fetch(`http://localhost:3333/api/1.0.0/chat/${chatId}/user/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': token,
        },
      });
      console.log(response)
      if (response.status === 200) {
        this.fetchData()

      } else {
        console.log('Failed to add member to chat');
      }
    } catch (error) {
      console.error(error);
    }
  };
  

  render() {
    const { chatInfo, userId, contacts } = this.state;
    return (
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.userSettings}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => this.props.navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={25} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Chat Settings</Text>
          </View>
          {chatInfo && (
            <View style={styles.chatInfoContainer}>
              <Text style={styles.chatName}>{chatInfo.name}</Text>
              {userId === chatInfo.creator.user_id && (
                <TouchableOpacity style={styles.changeChatNameButton}>
                  <Text style={styles.buttonText}>Change Chat Name</Text>
                </TouchableOpacity>
              )}
              <Text style={styles.memberListTitle}>Members:</Text>
              {chatInfo.members.map(
                (member) =>
                  member.user_id != userId && (
                    <View key={member.user_id} style={styles.memberContainer}>
                      <Text style={styles.memberName}>
                        {member.first_name} {member.last_name}
                      </Text>
                      {userId == chatInfo.creator.user_id && (
                        <TouchableOpacity
                          style={styles.removeButton}
                          onPress={() =>
                            this.handleRemoveMember(member.user_id)
                          }
                        >
                          <Text style={styles.buttonText}>Remove</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  )
              )}

              {userId == chatInfo.creator.user_id && (
                <View style={styles.addToChatContainer}>
                  <Text style={styles.addToChatTitle}>Add Members:</Text>
                  {contacts.map((contact) => (
                    <View key={contact.user_id} style={styles.memberContainer}>
                      <Text style={styles.memberName}>
                        {contact.first_name} {contact.last_name}
                      </Text>
                      <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => this.handleAddToChat(contact.user_id)}
                      >
                        <Text style={styles.buttonText}>Add</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#ffffff",
  },
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  userSettings: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3498db",
    height: 50,
    width: "100%",
    position: "absolute",
    top: 0,
    left: 0,

    backgroundColor: "#3498db",
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
  },
  chatInfoContainer: {
    backgroundColor: "#f0f0f0",
    padding: 20,
    borderRadius: 10,
    marginTop: 60,
  },
  chatName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  changeChatNameButton: {
    backgroundColor: "#008dff",
    padding: 10,
    borderRadius: 5,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  memberListTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
  },
  memberContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  memberName: {
    fontSize: 16,
  },
  removeButton: {
    backgroundColor: "#ff3b30",
    padding: 10,
    borderRadius: 5,
  },
  addToChatContainer: {
    marginTop: 20,
  },
  addToChatTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: "#008dff",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    textAlign: "center",
  },
});
