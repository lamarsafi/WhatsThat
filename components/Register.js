import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';

export const Register = (props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const handleSubmit = () => {
        console.log(email);

        let registerInformation = {
            "first_name": firstName,
            "last_name": lastName,
            "email": email,
            "password": password
        };

        return fetch("http://localhost:3333/api/1.0.0/user", {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registerInformation)
        })
        .then((response) => {
            if(response.status === 201) {
                return response.json();
            } else if(response.status === 400) {
                throw "Email already exists / password isn't strong enough";
            } else{
                throw "Something went wrong";
            }
        })
        .then((rJson) => {
            console.log(rJson);
        })
        .catch((error) => {
            console.log(error);
        });
    };

    return(
        <View style={styles.container}>
            <View style={styles.box}>
                <Text style={styles.title}>Register</Text>
                <TextInput
                    style={styles.input}
                    value={firstName}
                    onChangeText={(value) => setFirstName(value)}
                    placeholder='First Name'
                />
                <TextInput
                    style={styles.input}
                    value={lastName}
                    onChangeText={(value) => setLastName(value)}
                    placeholder='Last Name'
                />
                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={(value) => setEmail(value)}
                    placeholder='youremail@gmail.com'
                    keyboardType='email-address'
                />
                <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={(value) => setPassword(value)}
                    placeholder='*******'
                    secureTextEntry={true}
                />
                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.secondaryButton} onPress={() => props.onFormSwitch('login')}>
                    <Text style={styles.secondaryButtonText}>Already Registered? Log In here!</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        opacity: 0.8
    },
    box: {
        backgroundColor: 'rgba(35, 47, 56, 0.15)', // 50% opacity
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
        textAlign: 'center',
        opacity: 0.8,
        alignItems: 'stretch'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 20
    },
    input: {
        borderWidth: 2,
        borderRadius: 5,
        borderColor: 'transparent',
        borderBottomColor: 'white',
        padding: 10,
        marginBottom: 20,
        color: 'white',
        },
        button: {
            backgroundColor: '#0066FF',
            borderRadius: 5,
            padding: 10,
            alignItems: 'stretch',
            marginBottom: 10,
        },
        buttonText: {
            color: '#FFFFFF',
            fontWeight: 'bold',
        },
        secondaryButton: {
            alignItems: 'center',
        },
        secondaryButtonText: {
            color: '#0066FF',
            textDecorationLine: 'underline',
        },
        });