import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {Component} from 'react';
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default class BlockedContacts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      blockedContacts: [],
      filteredContacts: [],
      searchText: '',
      error: '',
    };
  }

  componentDidMount() {
    this.fetchBlockedContacts();
  }

  fetchBlockedContacts = async () => {
    try {
      const userID = await AsyncStorage.getItem('whatsthat_user_id');
      const sessionToken = await AsyncStorage.getItem('whatsthat_session_token');
      const response = await fetch(
        `http://localhost:3333/api/1.0.0/blocked`,
        {
          method: 'GET',
          headers: {
            'X-Authorization': sessionToken,
          },
        },
      );
      const blockedContacts = await response.json();
      this.setState({
        blockedContacts,
        filteredContacts: blockedContacts,
        error: '',
      });
    } catch (error) {
      this.setState({error: 'Error fetching blocked contacts'});
    }
  };

  handleUnblock = async (id) => {
    console.log(id);
    try {
      const userID = await AsyncStorage.getItem('whatsthat_user_id')
      const sessionToken = await AsyncStorage.getItem('whatsthat_session_token');
      const response = await fetch(
        `http://localhost:3333/api/1.0.0/user/${id}/block`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'X-Authorization': sessionToken,
          },
        },
      );
      console.log(response.status);

      if (response.status === 200) {
        const {blockedContacts} = this.state;
        const updatedBlockedContacts = blockedContacts.filter(
          (contact) => contact.user_id !== id,
        );
        this.setState({
          blockedContacts: updatedBlockedContacts,
          filteredContacts: updatedBlockedContacts,
          error: '',
        });
      } else {
        this.setState({error: 'Error unblocking contact'});
      }
    } catch (error) {
      this.setState({error: `Error unblocking contact: ${error}`});
    }
  };

  handleSearch = (text) => {
    const {blockedContacts} = this.state;
    const filteredContacts = blockedContacts.filter((contact) => {
      const {first_name, last_name, email} = contact;
      return (
        first_name.includes(text) ||
        last_name.includes(text) ||
        email.includes(text)
      );
    });
    this.setState({filteredContacts, searchText: text});
  };

  renderItem = ({item}) => {
    const {user_id, first_name, last_name, email} = item;
    return (
      <View style={styles.itemContainer}>
        <View style={styles.itemTextContainer}>
          <Text style={styles.itemName}>{`${first_name} ${last_name}`}</Text>
          <Text style={styles.itemEmail}>{email}</Text>
        </View>
        <TouchableOpacity
          style={styles.unblockButton}
          onPress={() => this.handleUnblock(user_id)}>
          <Text style={styles.unblockButtonText}>Unblock</Text>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    const {filteredContacts, searchText, error} = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => this.props.navigation.goBack()}>
            <Ionicons name="arrow-back" size={25} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Blocked Contacts</Text>
        </View>
        {error !== '' && <Text style={styles.errorMessage}>{error}</Text>}
        <View style={styles.searchContainer}>
          <Ionicons style={styles.headerIcon} name="search" size={20} color="#888" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search blocked contacts"
            onChangeText={this.handleSearch}
            value={searchText}
          />
        </View>
        <FlatList
          data={filteredContacts}
          renderItem={this.renderItem}
          keyExtractor={(item) => item.user_id.toString()}
          ListEmptyComponent={<Text style={styles.emptyList}>No blocked contacts found</Text>}
        />
      </View>
    );
  }
}

      
      const styles = StyleSheet.create({
      container: {
      flex: 1,
      backgroundColor: '#fff',
      },

      header: {
        backgroundColor: '#4b9cdb',
        paddingHorizontal: 10,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: '#ccc',
        borderBottomWidth: StyleSheet.hairlineWidth,
      },
      headerTitle: {
        flex: 1,
        textAlign: 'center',
        color:'white',
        fontWeight: 'bold',
        fontSize: 18,
      },
      headerIcon: {
        color: '#4b9cdb',
        fontSize: 28,
        marginRight: 10,
      },      
      searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      margin: 10,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      paddingHorizontal: 10,
      },
      searchIcon: {
      marginRight: 5,
      },
      searchInput: {
      flex: 1,
      },
      listContainer: {
      paddingHorizontal: 10,
      },
      itemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
      },
      itemTextContainer: {
      flex: 1,
      marginRight: 10,
      },
      itemName: {
      fontSize: 16,
      fontWeight: 'bold',
      },
      itemEmail: {
      fontSize: 14,
      color: '#999',
      },
      unblockButton: {
      backgroundColor: '#f00',
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 5,
      },
      unblockButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      },
      error: {
      color: 'red',
      textAlign: 'center',
      margin: 10,
      },
      });