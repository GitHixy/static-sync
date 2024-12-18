import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const HomeScreen = ({ navigation }) => {
  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('refreshToken');
    await AsyncStorage.removeItem('discordId');
    await AsyncStorage.removeItem('userId');
    await AsyncStorage.removeItem('username');
    navigation.replace('Login');
  };

  return (
    <ImageBackground 
      source={require('../../assets/HomeBG.webp')} 
      style={styles.background}
      
    >
      <View style={styles.overlay}>
        <Text style={styles.welcomeText}>Static Sync</Text>
        
        <View style={styles.menuContainer}>
  <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('News')}>
    <FontAwesome name="newspaper-o" size={30} color="#fff" />
    <Text style={styles.menuText}>News</Text>
  </TouchableOpacity>

  <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Dalamud News')}>
    <FontAwesome name="newspaper-o" size={30} color="#fff" />
    <Text style={styles.menuText}>Dalamud News</Text>
  </TouchableOpacity>

  <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Maintenance')}>
    <FontAwesome name="wrench" size={30} color="#fff" />
    <Text style={styles.menuText}>Maintenance</Text>
  </TouchableOpacity>

  <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Server Status')}>
    <FontAwesome name="server" size={30} color="#fff" />
    <Text style={styles.menuText}>Server Status</Text>
  </TouchableOpacity>

  <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Search Player')}>
    <FontAwesome name="search" size={30} color="#fff" />
    <Text style={styles.menuText}>Player Search</Text>
  </TouchableOpacity>

  <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Manage Statics')}>
    <FontAwesome name="users" size={30} color="#fff" />
    <Text style={styles.menuText}>Manage Statics</Text>
  </TouchableOpacity>

  <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Plugins')}>
    <FontAwesome name="puzzle-piece" size={30} color="#fff" />
    <Text style={styles.menuText}>Plugins</Text>
  </TouchableOpacity>


</View>


        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',

  },
  overlay: {
    flex: 1,
 
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 40,
    textAlign: 'center',
  },
  menuContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: Platform.OS === 'web' ? '10%' : 0,
  },
  menuItem: {
    backgroundColor: '#13152A',
    borderRadius: 10,
    width: '45%',
    maxWidth: 180, 
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    opacity: 0.9,
  },
  menuText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    textAlign: 'center',
  },
  logoutButton: {
    marginTop: 30,
    backgroundColor: '#ff4d4d',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '80%',
    maxWidth: 300,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;


