import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {Component,} from 'react'
import {Text, View, FlatList, TouchableOpacity, TextInput, StyleSheet} from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import the hook

export default class BlockedContacts extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            blockedContacts: [],
            filteredContacts: [],
            searchText: '',
            error: ''
        };
    }

    componentDidMount() {
        this.fetchBlockedContacts();
    }

    fetchBlockedContacts = async () => {
        try {
            const userID = await AsyncStorage.getItem('whatsthat_user_id');
            const sessionToken = await AsyncStorage.getItem('whatsthat_session_token');
            const response = await fetch(`http://localhost:3333/api/1.0.0/blocked`, {
                method: 'GET',
                headers: {
                    'X-Authorization': sessionToken
                }
            });
            const blockedContacts = await response.json();
            this.setState({blockedContacts, filteredContacts: blockedContacts});
        } catch (error) {
            this.setState({error: 'Error fetching blocked contacts'});
        }
    }

    handleUnblock = async (id) => {
        console.log(id)
        try {
            const userID = await AsyncStorage.getItem('whatsthat_user_id');
            const sessionToken = await AsyncStorage.getItem('whatsthat_session_token');
            const response = await fetch(`http://localhost:3333/api/1.0.0/user/${id}/block`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Authorization': sessionToken
                },
                
            });
            console.log(response.status)

            
            if (response.status === 200) {
                const {blockedContacts} = this.state;
                const updatedBlockedContacts = blockedContacts.filter(contact => contact.user_id !== id);
                this.setState({blockedContacts: updatedBlockedContacts, filteredContacts: updatedBlockedContacts});
            } else {
                this.setState({error: 'Error unblocking contact'});
            }
        } catch (error) {
            this.setState({error: `Error unblocking contact: ${error}`});
        }
    }
    

    handleSearch = (text) => {
        const {blockedContacts} = this.state;
        const filteredContacts = blockedContacts.filter(contact => {
            const {first_name, last_name, email} = contact;
            return first_name.includes(text) || last_name.includes(text) || email.includes(text);
        });
        this.setState({filteredContacts, searchText: text});
    }

    renderItem = ({item}) => {
        const {user_id, first_name, last_name, email} = item;
        return (
            <View style={styles.itemContainer}>
                <View style={styles.itemTextContainer}>
                    <Text style={styles.itemName}>{`${first_name} ${last_name}`}</Text>
                    <Text style={styles.itemEmail}>{email}</Text>
                </View>
                <TouchableOpacity style={styles.unblockButton} onPress={() => this.handleUnblock(user_id)}>
                    <Text style={styles.unblockButtonText}>Unblock</Text>
                </TouchableOpacity>
            </View>
        );
    }
    
    render(){
        const {filteredContacts, searchText, error} = this.state;
        return(
            <View style={styles.container}>
                <TextInput 
                    style={styles.searchInput} 
                    onChangeText={this.handleSearch}
                    value={searchText}
                    placeholder="Search blocked contacts"
                />
                {error ? (
                    <Text style={styles.errorText}>{error}</Text>
                    ) : (
                        <FlatList 
                            data={filteredContacts}
                            renderItem={this.renderItem}
                            keyExtractor={item => item.user_id.toString()}
                        />
                    )}
                </View>
            );
        }
    }
    
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            paddingHorizontal: 10,
            paddingTop: 20
        },
        searchInput: {
            height: 40,
            borderColor: 'gray',
            borderWidth: 1,
            borderRadius: 10,
            paddingHorizontal: 10,
            marginBottom: 10
        },
        itemContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 10,
            paddingHorizontal: 5,
            borderBottomWidth: 1,
            borderBottomColor: '#ccc'
        },
        itemTextContainer: {
            flex: 1
        },
        itemName: {
            fontSize: 16,
            fontWeight: 'bold',
            marginBottom: 5
        },
        itemEmail: {
            fontSize: 14,
            color: '#777'
        },
        unblockButton: {
            backgroundColor: 'red',
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 5
        },
        unblockButtonText: {
            color: 'white',
            fontWeight: 'bold',
            fontSize: 14
        },
        errorText: {
            color: 'red',
            textAlign: 'center',
            marginTop: 20
        }
    });
    

    
        
