import React, { useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet, Alert, Platform } from "react-native";
import { useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Linking from "expo-linking";

const SuccessScreen = ({ navigation }) => {
  const route = useRoute();
  const { auth, username, discordId, id, refreshToken } = route.params || {};

  useEffect(() => {
    const processLogin = async () => {
      try {
        if (auth && id && username && discordId && refreshToken) {
          // Save data to AsyncStorage
          await AsyncStorage.setItem("token", auth);
          await AsyncStorage.setItem("refreshToken", refreshToken);
          await AsyncStorage.setItem("userId", id);
          await AsyncStorage.setItem("username", username);
          await AsyncStorage.setItem("discordId", discordId);

          // Navigate to Home
          navigation.replace("Home");
        } else {
          throw new Error("Missing parameters in route.");
        }
      } catch (error) {
        console.error("Login processing failed:", error);

        // Check platform and redirect to the app's deep link if necessary
        if (Platform.OS === "ios" || Platform.OS === "android") {
          const appDeepLink = Linking.createURL("/auth-failed");
          console.log("Redirecting to deep link:", appDeepLink);
          Linking.openURL(appDeepLink); // Opens the app's deep link
        } else {
          Alert.alert("Login Failed", "Unable to process login. Please try again.");
        }

        // Optionally, navigate back to Login screen
        navigation.replace("Login");
      }
    };

    processLogin();
  }, [auth, username, discordId, id, navigation]);

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


