import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function SearchBar(props) {
  return (
    <View >
      <TextInput style={styles.searchBar}
        placeholder="Search contacts..."
        onChangeText={props.onSearch}
        
      />
    </View>
  );
}

export default class Contacts extends Component {
  state = {
    contacts: [],
    sessionToken: '',
    contactPhotos: {},
    searchQuery: '',
  };

  componentDidMount() {
    this.getSessionToken();
    this.getContacts();
  }

  async getSessionToken() {
    try {
      const sessionToken = await AsyncStorage.getItem('whatsthat_session_token');
      if (sessionToken !== null) {
        this.state.sessionToken = sessionToken;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getContacts() {
    try {
      const response = await fetch('http://localhost:3333/api/1.0.0/contacts', {
        headers: {
          'X-Authorization': await AsyncStorage.getItem('whatsthat_session_token'),
        },
      });
      const contacts = await response.json();
      console.log('contacts:', contacts);
      this.setState({ contacts });
      contacts.forEach((contact) => {
        this.getContactPhoto(contact.user_id);
      });
    } catch (error) {
      console.log(error);
    }
  }

  async getContactPhoto(contactId) {
    const token = await AsyncStorage.getItem('whatsthat_session_token');
    const url = `http://localhost:3333/api/1.0.0/user/${contactId}/photo`;
    const response = await fetch(url, {
      headers: {
        'X-Authorization': token,
      },
    });

    if (response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType === 'image/jpeg' || contentType === 'image/png') {
        const blob = await response.blob();
        const uri = URL.createObjectURL(blob);
        this.setState((prevState) => ({
          contactPhotos: {
            ...prevState.contactPhotos,
            [contactId]: uri,
          },
        }));
      }
    }
  }

  blockContact(contactId) {
    // TODO: Implement blocking contact logic
  }

  removeContact(contactId) {
    // TODO: Implement removing contact logic
  }

  handleSearch = (text) => {
    this.setState({ searchQuery: text });
  };

  renderContact(contact) {
    const { user_id, first_name, last_name, email } = contact;
    const profilePicture = this.state.contactPhotos[user_id] || null;

    // Filter contacts based on search query
    if (
      !`${first_name} ${last_name}`.toLowerCase().includes(this.state.searchQuery.toLowerCase()) &&
      !email.toLowerCase().includes(this.state.searchQuery.toLowerCase())
    ) {
      return null;
    }

    return (
      <View style={styles.contactcard} key={user_id}>
        <Image
          source={{ uri: profilePicture }}
          style={{ width: 50, height: 50, borderRadius: 25 }}
        />
        <View style={{ marginLeft: 10 }}>
          <Text>{`${first_name} ${last_name}`}</Text>
          <Text>{email}</Text>
        </View>
        <TouchableOpacity
          onPress={() => this.blockContact(user_id)}
          style={{ marginLeft: 'auto', backgroundColor: 'red', padding: 5, borderRadius: 5 }}
        >
          <Text style={{ color: 'white' }}>Block</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.removeContact(user_id)}
          style={{ marginLeft: 10, backgroundColor: 'gray', padding: 5, borderRadius: 5 }}
        >
          <Text style={{ color: 'white' }}>Remove</Text>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    return (
      <View>
        <SearchBar onSearch={this.handleSearch} />
        {this.state.contacts.map((contact) => this.renderContact(contact))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  contactcard: {
    flex: 1,
    flexDirection: 'row', 
    marginTop: '10px',
    borderRadius: '6px',
    width: '95%',
    opacity: '95%',
    alignItems: 'center',
    alignSelf:'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    
  },
  searchBar: {
    height: 40,
    width: '95%',
    alignSelf: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
    marginTop: 10
  }
})
