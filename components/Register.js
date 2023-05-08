import React, { useState, Component } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import validator from "email-validator";

export default class SecondRegister extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: null,
      lastName: null,
      email: null,
      password: null,
      errors: {},
    };
  }

  handleChange = (key, value) => {
    this.setState({
      [key]: value,
      errors: { ...this.state.errors, [key]: null },
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const errors = this.validate();
    if (Object.keys(errors).length === 0) {
      let registerInformation = {
        first_name: this.state.firstName,
        last_name: this.state.lastName,
        email: this.state.email,
        password: this.state.password,
      };
  
      console.log(registerInformation);
      console.log(JSON.stringify(registerInformation));
  
      fetch("http://localhost:3333/api/1.0.0/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerInformation),
      })
        .then((response) => {
          console.log(response);
          this.setState({ responseStatus: response.status });
          if (response.ok) {
            return response.json();
          } else if (response.status === 400) {
            throw new Error("Bad Request");
          }
        })
        .then((rJson) => {
          console.log(rJson);
        })
        .catch((error) => {
          if (error.message === "Bad Request") {
            const emailError = {
              ...errors,
              email: "Email already exists.",
            };
            this.setState({ errors: emailError });
          } else {
            console.log(error.message);
          }
        });
    } else {
      this.setState({ errors });
    }
  };
  

  validate = () => {
    const PasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const errors = {};
    if (!this.state.firstName) {
      errors.firstName = "First Name is required.";
    }
    if (!this.state.lastName) {
      errors.lastName = "Last Name is required.";
    }
    if (!this.state.email) {
      errors.email = "Email is required.";
    } else if (!validator.validate(this.state.email)) {
      errors.email = "Invalid email address.";
    }
    if (!this.state.password) {
      errors.password = "Password is required.";
    } else if (!PasswordRegex.test(this.state.password)) {
      errors.password =
        "Password must be strong (greater than 8 characters including one upper, one number, and one special character).";
    }
    return errors;
  };

  render() {
    const { errors } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.box}>
          <Text style={styles.title}>Register</Text>
          <TextInput
            style={[styles.input, errors.firstName && styles.error]}
            value={this.state.firstName}
            onChangeText={(value) => this.handleChange("firstName", value)}
            placeholder="First Name"
          />
          {errors.firstName && (
            <Text style={styles.errorText}>{errors.firstName}</Text>
          )}
          <TextInput
            style={[styles.input, errors.lastName && styles.error]}
            value={this.state.lastName}
            onChangeText={(value) => this.handleChange("lastName", value)}
            placeholder="Last Name"
          />
          {errors.lastName && (
            <Text style={styles.errorText}>{errors.lastName}</Text>
          )}
          <TextInput
            style={[styles.input, errors.email && styles.error]}
            value={this.state.email}
            onChangeText={(value) => this.handleChange("email", value)}
            placeholder="youremail@gmail.com"
            keyboardType="email-address"
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          <TextInput
            style={[styles.input, errors.password && styles.error]}
            value={this.state.password}
            onChangeText={(value) => this.handleChange("password", value)}
            placeholder="Password"
            secureTextEntry={true}
          />
          {errors.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}
          <TouchableOpacity style={styles.button} onPress={this.handleSubmit}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => this.props.navigation.navigate("Login")}
          >
            <Text style={styles.secondaryButtonText}>
              Already Registered? Log In here!
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      
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
      alignItems: 'stretch',
      width: '80%',
      marginBottom: 20,
      opacity: '80%',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#1F1F1F',
      marginBottom: 20,
    },
    input: {
      borderWidth: 2,
      borderRadius: 5,
      borderColor: 'transparent',
      borderBottomColor: 'white',
      padding: 10,
      marginBottom: 20,
      color: 'black',
    },
    error: {
      borderColor: 'red',
    },
    errorText: {
      color: 'red',
      marginBottom: 10,
    },
    button: {
      backgroundColor: '#0066FF',
      borderRadius: 5,
      padding: 10,
      alignItems: 'stretch',
      marginBottom: 10,
      width: '100%',
    },
    buttonText: {
      color: '#FFFFFF',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    secondaryButton: {
      alignItems: 'center',
    },
    secondaryButtonText: {
      color: '#0066FF',
      textDecorationLine: 'underline',
    },
  });
  
  