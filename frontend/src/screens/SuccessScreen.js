import React, { useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet, Alert } from "react-native";
import * as Linking from "expo-linking";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SuccessScreen = ({ navigation }) => {
  const handleDeepLink = async (url) => {
    console.log("Handling URL:", url);

    if (!url) {
      console.warn("No URL received in handleDeepLink");
      Alert.alert("Error", "No URL received");
      navigation.replace("Login");
      return;
    }

    const parsedUrl = Linking.parse(url);
    console.log("Parsed URL:", parsedUrl);

    const { queryParams } = parsedUrl || {};
    if (!queryParams) {
      console.warn("No query parameters in the URL");
      Alert.alert("Error", "Invalid URL structure");
      navigation.replace("Login");
      return;
    }

    const { auth, refreshToken, id, username, discordId } = queryParams;

    if (auth && refreshToken && id && username && discordId) {
      console.log("Valid query parameters received:", queryParams);
      try {
        await AsyncStorage.setItem("token", auth);
        await AsyncStorage.setItem("refreshToken", refreshToken);
        await AsyncStorage.setItem("userId", id);
        await AsyncStorage.setItem("username", username);
        await AsyncStorage.setItem("discordId", discordId);
        navigation.replace("Home");
      } catch (error) {
        console.error("Error saving to AsyncStorage:", error);
        Alert.alert("Error", "Failed to save login data");
        navigation.replace("Login");
      }
    } else {
      console.warn("Missing required query parameters in the URL");
      Alert.alert("Error", "Invalid login data");
      navigation.replace("Login");
    }
  };

  useEffect(() => {
    // Get the initial URL
    const getInitialURL = async () => {
      const initialUrl = await Linking.getInitialURL();
      console.log("Initial URL:", initialUrl);
      handleDeepLink(initialUrl);
    };

    // Subscribe to new links
    const subscription = Linking.addEventListener("url", ({ url }) => {
      console.log("Received deep link:", url);
      handleDeepLink(url);
    });

    // Handle initial URL
    getInitialURL();

    // Clean up the subscription
    return () => {
      subscription.remove(); // Correct usage with Expo Linking
    };
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
    marginTop: 20,
    fontSize: 18,
    color: "#333",
  },
});

export default SuccessScreen;






