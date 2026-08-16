import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../api/api';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // Check fields
    if (!email.trim() || !password) {
      Alert.alert('Error', 'Email and password are required');
      return;
    }

    try {
      setLoading(true);

      // Login API
      const response = await API.post('/users/login', {
        email: email.trim(),
        password,
      });

      // Get token
      const token = response.data.token;

      // Get user
      const user = response.data.user;

      // Save token
      await AsyncStorage.setItem('token', token);

      // Save user
      await AsyncStorage.setItem('user', JSON.stringify(user));

      console.log('Logged in user:', user);
      console.log('Token:', token);

      Alert.alert('Success', response.data.message, [
        {
          text: 'OK',
          onPress: () => {
            navigation.navigate('Home');
          },
        },
      ]);
    } catch (error) {
      console.log('Login Error:', error.response?.data || error.message);

      Alert.alert(
        'Login Failed',
        error.response?.data?.message || 'Something went wrong',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      {/* Email */}
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      {/* Password */}
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />

      {/* Login Button */}
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>

      {/* Signup */}
      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.signupText}>Don't have an account? Signup</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },

  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },

  button: {
    height: 50,
    backgroundColor: '#007bff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  signupText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#007bff',
    fontSize: 16,
  },
});

export default Login;
