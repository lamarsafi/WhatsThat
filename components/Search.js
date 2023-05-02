import React, { Component } from "react";
import {
    View,
    Text,
    TextInput,
    FlatList,
    Image,
    TouchableOpacity,
    Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";



export default class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            query: "",
            searchIn: "all",
            users: [],
            contacts: [],
            loading: false,
            token: "",
            userId: null,
            profilePictures: {},
            blockedUsers: [],
        };
    }

    async componentDidMount() { // setting up the states -> token, userId, contacts & blocked users
        try {
            const token = await AsyncStorage.getItem("whatsthat_session_token");
            const userId = await AsyncStorage.getItem("whatsthat_user_id");
            
            
            this.setState({ token, userId });
            this.setContactsState();
            this.fetchBlockedUsers();
        } catch (error) {
            console.log(error);
        }
    }

    async componentDidUpdate() { // mainly used for updating the photos, fetching blocked users and updating the contacts state
      const { users, profilePictures } = this.state;
      const { token } = this.state;
      const newProfilePictures = { ...profilePictures };
      this.setContactsState();
      this.fetchBlockedUsers();
  
      // fetch profile picture for each user that doesn't have it already
      for (const user of users) {
        if (!newProfilePictures[user.user_id]) {
          try {
            const response = await fetch(
              `http://localhost:3333/api/1.0.0/user/${user.user_id}/photo`,
              {
                headers: {
                  "X-Authorization": token,
                },
              }
            );
      
            if (!response.ok) {
              throw new Error("Failed to fetch profile picture");
            }
      
            const data = await response.blob();
            const profilePictureUrl = URL.createObjectURL(data);
  
            newProfilePictures[user.user_id] = profilePictureUrl;
          } catch (error) {
            console.log(error);
          }
        }
      }
  
      // update state with new profile pictures
      if (Object.keys(newProfilePictures).length > Object.keys(profilePictures).length) {
        this.setState({ profilePictures: newProfilePictures });
      }
    }

    async fetchBlockedUsers() { // fetches the blocked users so they aren't displayed -> unblock via settings
      
      
      try {
        const response = await fetch("http://localhost:3333/api/1.0.0/blocked", {
          headers: {
            'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
          },
        });
        const blockedUsers = await response.json();
        this.setState({ blockedUsers });
      } catch (error) {
        console.error(error);
      }
    }
    

    setContactsState = async () => { // sets the contacts state - ready to display them all

    
      const response = await fetch(
        "http://localhost:3333/api/1.0.0/contacts",
        {
          headers: {
            "X-Authorization": await AsyncStorage.getItem("whatsthat_session_token"), // use this method of obtaining token - token doesn't load quick enough
          },
        }
      );
    
      if (!response.ok) {
        throw new Error("Failed to fetch contacts");
      }
    
      const data = await response.json();
      this.setState({ contacts: data });
      
    };
    

    handleSearch = async () => { // function to handle search inputs
        const { query, searchIn, token } = this.state;
        console.log(searchIn);
        if (!query) {
            Alert.alert("Please enter a search query.");
            return;
        }

        console.log(token, );

        const url = `http://localhost:3333/api/1.0.0/search?q=${query}&search_in=${searchIn}&limit=20&offset=0`;
        const headers = {
            "X-Authorization": `${token}`,
        };

        try {
            this.setState({ loading: true });
            const response = await fetch(url, { headers });
            console.log(response);
            const data = await response.json();
            console.log(data);
            this.setState({ users: data });
        } catch (error) {
            console.log(error);
        } finally {
            this.setState({ loading: false });
        }
    };

    handleSearchInChange = (searchIn) => { // handles the change when search is pressed, updates the users depending on search params
      this.setState({ searchIn });
      if (searchIn === "contacts") {
        this.setState({ users: [] });
      } else if (searchIn === "all") {
        this.setState({ users: [] });
      }
  };

  
    updateContacts = (updatedContacts) => { // updates the contacts
    this.setState({ contacts: updatedContacts });
    };
  

    handleAddContact = async (user_id) => { // function to add contact through id
      const { token, contacts } = this.state;
      const response = await fetch(
        `http://localhost:3333/api/1.0.0/user/${user_id}/contact`,
        {
          method: "POST",
          headers: {
            "X-Authorization": token,
          },
          
        }
      );
    
      if (!response.status == 200) {
        throw new Error("Failed to add contact");
      }
    
      const newContact = { user_id };
      this.setState({
        contacts: [...contacts, newContact],
      });
    
      
      this.setContactsState();
    };
    

    

    handleRemoveContact = async (user_id) => { // remove contacts function
      const { token, contacts, searchIn, users } = this.state;
      const contact = contacts.find((c) => c.user_id === user_id);
    
      if (!contact) {
        return;
      }
    
      const response = await fetch(
        `http://localhost:3333/api/1.0.0/user/${user_id}/contact`,
        {
          method: "DELETE",
          headers: {
            "X-Authorization": token,
          },
        }
      );
    
      if (!response.status == 200) {
        throw new Error("Failed to remove contact");
      }
    
      const updatedContacts = contacts.filter((c) => c.user_id !== user_id);
      this.setState({
        contacts: updatedContacts,
      });
    
      if (searchIn === "contacts") {
        const updatedUsers = users.filter((u) => u.user_id !== user_id);
        this.setState({
          users: updatedUsers,
        });
      }
    };

    blockContact = async (user_id) => { // block contacts function
      const { token, contacts, searchIn, users } = this.state;

    
      const response = await fetch(
        `http://localhost:3333/api/1.0.0/user/${user_id}/block`,
        {
          method: "POST",
          headers: {
            "X-Authorization": token,
          },
        }
      );
    
      if (!response.status == 200) {
        throw new Error("Failed to remove contact");
      }
    
      const updatedContacts = contacts.filter((c) => c.user_id !== user_id);
      this.setState({
        contacts: updatedContacts,
      });
    
      if (searchIn === "contacts") {
        const updatedUsers = users.filter((u) => u.user_id !== user_id);
        this.setState({
          users: updatedUsers,
        });
      }

      
    };
    


    renderItem = ({ item : contact }) => {
      const { searchIn, contacts, userId, profilePictures, blockedUsers } = this.state; // declare states
      const isContact = contacts.find((c) => c.user_id === contact.user_id) || contact.user_id === userId; // bool value -> used for checking if a user is a contact
      const isBlocked = blockedUsers.some((u) => u.user_id === contact.user_id); // bool value -> used for checking if a user is blocked
    
      const canAddContact = searchIn !== "contacts" && contact.user_id !== userId; // bool value -> used for checking if the searchIn state is "contacts" 
      const profileImage = profilePictures[contact.user_id] ? { uri: profilePictures[contact.user_id] } : require("../images/default.jpeg"); // fetches the profile picture of the user
    
      if (contact.user_id == userId || isBlocked) { // removes the list IF the user is the same as the users
        return null;
      }
    
      return ( 
        <View style={{ flexDirection: "row", alignItems: "center", padding: 10 }}>
          <Image
            source={profileImage}
            style={{ width: 50, height: 50, borderRadius: 25 }}
          />
          <View style={{ marginLeft: 10 }}>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              {contact.given_name} {contact.family_name}
            </Text>
            <Text style={{ fontSize: 14, color: "gray" }}>{contact.email}</Text>
          </View>
          <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }}>
            {searchIn === "contacts" && ( 
              // if searchIn value is in contacts -> display the following
              <TouchableOpacity style={{ marginRight: 10 }} onPress={() => this.blockContact(contact.user_id)}>
                <Image source={require("../images/block.png")} style={{ 
                  width: 26,
                  height: 26,
                  paddingVertical: 4,
                  paddingHorizontal: 8,
                  borderRadius: 5,
                  fontSize: '10px'
                   }} />
              </TouchableOpacity>
            )}
            {isContact ? ( // if user is contact > display following (remove button)
              <TouchableOpacity onPress={() => this.handleRemoveContact(contact.user_id)}>
                <Text style={{
                  color: "white",
                  fontWeight: "bold",
                  backgroundColor: "red",
                  paddingVertical: 4,
                  paddingHorizontal: 8,
                  borderRadius: 5,
                  fontSize: '10px'
                }}>Remove</Text>
              </TouchableOpacity>
            ) : canAddContact ? ( // returns the following if the user can be added
              <TouchableOpacity onPress={() => this.handleAddContact(contact.user_id)}>
                <Text style={{ color: "#4b9cdb", fontWeight: "bold", fontSize: '10px' }}>Add</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      );
    };
    
      
    
    
    render() {
      const { query, searchIn, users, loading } = this.state;
      const shouldClearResults = this.state.prevSearchIn !== searchIn;
      return (
        <View style={{ flex: 1, padding: 10, backgroundColor: 'fff' }}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10,  backgroundColor: 'fff' }}>
            <TextInput
              style={{
                flex: 1,
                height: 40,
                borderWidth: 1,
                marginRight: 10,
                paddingHorizontal: 10,
                borderRadius: 5,
              }}
              value={query}
              onChangeText={(value) => this.setState({ query: value })}
              placeholder="Search"
            />
            <TouchableOpacity onPress={this.handleSearch}>
              <Text style={{ color: "#4b9cdb", fontWeight: "bold" }}>Search</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <Text style={{ marginRight: 10, fontSize: 16, fontWeight: "bold" }}>Search in:</Text>
            <TouchableOpacity
              onPress={() => this.handleSearchInChange("all")}
            >
              <Text
                style={{
                  color: searchIn === "all" ? "#4b9cdb" : "black",
                  fontSize: 16,
                  fontWeight: "bold",
                  textDecorationLine: searchIn === "all" ? "underline" : "none",
                }} 
              >
                All
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.handleSearchInChange("contacts")}
            >
              <Text
                style={{
                  color: searchIn === "contacts" ? "#4b9cdb" : "black",
                  fontSize: 16,
                  fontWeight: "bold",
                  textDecorationLine: searchIn === "contacts" ? "underline" : "none",
                  marginLeft: 10,
                }}
              >
                Contacts
              </Text>
            </TouchableOpacity>
          </View>
          {loading ? (
            <Text>Loading...</Text>
          ) : (
            <FlatList
              data={users}
              keyExtractor={(item) => item.user_id.toString()}
              renderItem={this.renderItem}
              ListEmptyComponent={<Text style={{ fontSize: 16, fontWeight: "bold" }}>No results.</Text>}
              extraData={shouldClearResults}
            />
          )}
        </View>
      );
    }
    
}
