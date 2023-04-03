import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {Component} from "react";
import { Text, View, StyleSheet, TouchableOpacity, Image } from "react-native-web";
import DeleteIcon from '../images/delete.png'
import { CurrentRenderContext } from "@react-navigation/native";
import DefaultPicture from '../images/default.jpeg'

export default class Contacts extends Component {
    constructor(props){
        super(props)

        this.state = {
            error: '',
            token: '',
            contacts: '',
            error: '',
        }
    }

    componentDidMount(){
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
            this.checkLoggedIn();
        })
    }

    componentWillUnmount(){
        this.unsubscribe();
    }

    checkLoggedIn = async () => {
        const value = await AsyncStorage.getItem('whatsthat_session_token');
        console.log(value);
        if (value == null) {
          this.props.navigation.navigate('LoginScreen');
        } else {
          this.setState({ token: value }); // use setState() to update state
          fetch('http://localhost:3333/api/1.0.0/contacts', {
            method: 'GET',
            headers: {
              'X-Authorization': value,
            },
          })
            .then((response) => response.json())
            .then((data) => {
              this.setState({ contacts: data });
            })
            .catch((error) => {
              console.error(error);
              this.setState({ error: 'Failed to fetch contacts' });
            });
        }
      };
      
      handleDeleteContact = async (contact) => {
        
        const updatedContacts = this.state.contacts.filter(c => c.user_id !== contact.user_id);
        try {
          const token = await AsyncStorage.getItem("whatsthat_session_token");
          await fetch(`http://localhost:3333/api/1.0.0/user/${contact.user_id}/contact`, {
            method: 'DELETE',
            headers: {
              'X-Authorization': token,
            },
          });
          this.setState({ contacts: updatedContacts });
        } catch (error) {
          console.log(error);
        }
      }
      

      handleAddContactPress = () => {
        this.props.navigation.navigate('AddContactScreen');
      }


      
      render() {
        
        if (this.state.error) {
          return <Text>{error}</Text>;
        }
        if (!this.state.contacts) {
          return <Text>Loading contacts...</Text>;
        }
      
        const contactElements = this.state.contacts.map((contact) => {
          let imageUrl = DefaultPicture;
          fetch(`http://localhost:3333/api/1.0.0/user/${contact.user_id}/photo`, {
            headers: {
              'X-Authorization': this.state.token,
            },
          })
            .then((response) => {
              if (response.ok) {
                return response.blob();
              }
              throw new Error('Failed to load profile picture');
            })
            .then((blob) => {
              imageUrl = URL.createObjectURL(blob);
            })
            .catch((error) => {
              console.error(error);
            });
      
          return (
            <View key={contact.user_id} style={styles.contactBox}>
              <Image
                id="test"
                style={styles.profilePicture}
                source={{ uri: imageUrl }}
              />
              <TouchableOpacity
                source="../images/delete.png"
                style={styles.deleteIcon}
              />
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>
                  {contact.first_name} {contact.last_name}
                </Text>
                <Text style={styles.contactEmail}>{contact.email}</Text>
              </View>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => this.handleDeleteContact(contact)}
              >
                <Image source={DeleteIcon} style={styles.deleteIcon} />
              </TouchableOpacity>
            </View>
          );
        });
      
        return (
          <View style={styles.container}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={this.handleAddContactPress}
            >
              <Text style={styles.addButtonText}>Add Contact</Text>
            </TouchableOpacity>
            {contactElements}
          </View>
        );
      }
      
    }
      
    

    const styles = StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: '#fff',
          padding: 20,
        },
        addButton: {
          alignSelf: 'stretch',
          justifyContent: 'center',
          marginBottom: 10,
          padding: 10,
          backgroundColor: '#00f',
          borderRadius: 5,
        },
        addButtonText: {
          color: '#fff',
          fontWeight: 'bold',
          fontSize: 16,
        },
        contactBox: {
          flexDirection: 'row',
          alignItems: 'center',
          padding: 10,
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 10,
          marginBottom: 10,
        },
        contactInfo: {
          flex: 1,
        },
        contactName: {
          fontSize: 18,
          fontWeight: 'bold',
        },
        contactEmail: {
          fontSize: 14,
          color: '#666',
        },
        deleteButton: {
          width: 50,
          height: 50,
          borderRadius: 25,
          backgroundColor: '#white',
          justifyContent: 'center',
          alignItems: 'center',
        },
        profilePicture: {
          width: 50,
          height: 50,
          borderRadius: 25,
          backgroundColor: 'black',
          justifyContent: 'center',
          alignItems: 'center',
        },
        deleteIcon: {
          width: 20,
          height: 20,
        },
        });
              
              