import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Linking, ImageBackground, ActivityIndicator, Alert, Image, StyleSheet, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { loginUser } from '../services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const apiUrl = Constants.expoConfig.extra.EXPO_API_URL ;


const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        navigation.replace('Home');
      }
    };
    checkToken();
  }, []);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const userData = await loginUser(email, password);
      await AsyncStorage.setItem('token', userData.accessToken);
      await AsyncStorage.setItem('refreshToken', userData.refreshToken);
      navigation.replace('Home');
    } catch (error) {
      Alert.alert('Login failed', 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDiscordLogin = () => {
    const discordLoginUrl = `${apiUrl}/api/discord`; 
    window.location.href = discordLoginUrl; 
  };
  

  return (
    <ImageBackground 
      source={require('../../assets/LogBG.webp')} 
      style={styles.background}
      resizeMode="cover"
    >
      {isLoading ? (
        <View style={styles.spinnerContainer}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      ) : (
        <KeyboardAvoidingView 
          style={styles.overlay} 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        >
          <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
            <Image source={require('../../assets/StaticSync BaseLogo Transparent White.png')} style={styles.logo} />
            <Text style={styles.title}>Welcome, Adventurer!</Text>
            
            <TouchableOpacity onPress={() => navigation.replace('Register')} style={styles.registerButton}>
              <Text style={styles.registerText}>Don't have an account? Register!</Text>
            </TouchableOpacity>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput 
                style={styles.input} 
                value={email} 
                onChangeText={setEmail} 
                autoCapitalize="none" 
                keyboardType="email-address"
              />
              
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput 
                  style={styles.inputAlt} 
                  value={password} 
                  onChangeText={setPassword} 
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.showPasswordButton}
                >
                  <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
              <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDiscordLogin} style={styles.discordButton}>
            <Ionicons name="logo-discord" size={24} color="#fff" style={styles.discordIcon} />
              
              <Text style={styles.discordText}> Login with Discord</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  logo: {
    width: 400,
    height: 400,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
  },
  registerButton: {
    marginBottom: 40,
  },
  registerText: {
    fontSize: 16,
    color: '#F7FF3C',
    textDecorationLine: 'underline',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 8,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    color: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
  },
  inputAlt: {
    flex: 1,
    height: 35,
    paddingHorizontal: 10,
    color: '#fff',
  },
  showPasswordButton: {
    paddingHorizontal: 10,
  },
  loginButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  loginText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  discordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7289da',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: '100%',
    justifyContent: 'center',
    marginTop: 5,
  },

  discordText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;