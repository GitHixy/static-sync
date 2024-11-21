import React, { useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet, Alert } from "react-native";
import * as Linking from "expo-linking";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SuccessScreen = ({ navigation }) => {
  useEffect(() => {
    const handleDeepLink = async () => {
      const url = await Linking.getInitialURL();
  
      console.log('Received deep link:', url);
  
      if (url) {
        const { queryParams } = Linking.parse(url);
        console.log('Parsed queryParams:', queryParams);
        const { auth, refreshToken, id, username, discordId } = queryParams;
  
        if (auth && refreshToken && id && username && discordId) {
          try {
            await AsyncStorage.setItem("token", auth);
            await AsyncStorage.setItem("refreshToken", refreshToken);
            await AsyncStorage.setItem("userId", id);
            await AsyncStorage.setItem("username", username);
            await AsyncStorage.setItem("discordId", discordId);
  
            navigation.replace("Home");
          } catch (error) {
            Alert.alert("Error", "Failed to process login");
            navigation.replace("Login");
          }
        } else {
          Alert.alert("Error", "Invalid login data");
          navigation.replace("Login");
        }
      } else {
        Alert.alert("Error", "No deep link received");
        navigation.replace("Login");
      }
    };
  
    handleDeepLink();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size={50} color="#007bff" />
      <Text style={styles.text}>Processing Login...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    color: "#333",
  },
});

export default SuccessScreen;



