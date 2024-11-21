import React, { useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet, Alert } from "react-native";
import * as Linking from "expo-linking";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SuccessScreen = ({ navigation }) => {
  useEffect(() => {
    const handleDeepLink = async () => {
      try {
        // Log to check if the deep link is being captured
        const initialUrl = await Linking.getInitialURL();
        console.log("Initial URL:", initialUrl);

        Linking.addEventListener("url", ({ url }) => {
          console.log("Received URL through event:", url);
        });

        const url = initialUrl;

        if (url) {
          const { queryParams } = Linking.parse(url);
          console.log("Parsed queryParams:", queryParams);

          const { auth, refreshToken, id, username, discordId } = queryParams;

          if (auth && refreshToken && id && username && discordId) {
            // Save tokens and user details
            await AsyncStorage.setItem("token", auth);
            await AsyncStorage.setItem("refreshToken", refreshToken);
            await AsyncStorage.setItem("userId", id);
            await AsyncStorage.setItem("username", username);
            await AsyncStorage.setItem("discordId", discordId);

            navigation.replace("Home");
          } else {
            console.error("Invalid login data");
            Alert.alert("Error", "Invalid login data");
            navigation.replace("Login");
          }
        } else {
          console.error("No deep link received");
          Alert.alert("Error", "No deep link received");
          navigation.replace("Login");
        }
      } catch (error) {
        console.error("Error handling deep link:", error);
        Alert.alert("Error", "Failed to process login");
        navigation.replace("Login");
      }
    };

    handleDeepLink();

    return () => {
      Linking.removeAllListeners("url");
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
    fontSize: 16,
    color: "#333",
  },
});

export default SuccessScreen;



