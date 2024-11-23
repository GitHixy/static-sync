import React, { useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Linking from "expo-linking";

const SuccessPage = ({ navigation }) => {
  useEffect(() => {
    const processAuthentication = async () => {
      try {
        let url;

        
        if (typeof window !== "undefined" && window.location) {
          // Ambiente web
          url = window.location.href;
        } else {
          
          const initialUrl = await Linking.getInitialURL();
          url = initialUrl;
        }

        console.log("Received URL:", url);

        if (!url) {
          throw new Error("No URL received");
        }

        const urlParams = new URLSearchParams(new URL(url).search); 
        const auth = urlParams.get("auth");
        const refreshToken = urlParams.get("refreshToken");
        const id = urlParams.get("id");
        const username = urlParams.get("username");
        const discordId = urlParams.get("discordId");

        console.log("Parsed URL parameters:", {
          auth,
          refreshToken,
          id,
          username,
          discordId,
        });

        // Controlla che tutti i parametri siano presenti
        if (auth && refreshToken && id && username && discordId) {
          console.log("Saving authentication data...");

          // Salva i dati in AsyncStorage
          await AsyncStorage.setItem("token", auth);
          await AsyncStorage.setItem("refreshToken", refreshToken);
          await AsyncStorage.setItem("userId", id);
          await AsyncStorage.setItem("username", username);
          await AsyncStorage.setItem("discordId", discordId);

          console.log("Authentication data saved successfully!");

          // Reindirizza alla homepage
          navigation.replace("Home");
        } else {
          console.error("Invalid URL parameters");
          
          navigation.replace("Login");
        }
      } catch (error) {
        console.error("Error during authentication process:", error);
        
        navigation.replace("Login");
      }
    };

    processAuthentication();
  }, [navigation]);

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

export default SuccessPage;












