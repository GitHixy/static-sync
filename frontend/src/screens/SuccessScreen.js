import React, { useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet, Alert } from "react-native";
import { useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SuccessScreen = ({ navigation }) => {
  const route = useRoute(); // Extract the route at the top level
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
        Alert.alert("Login Failed", "Unable to process login. Please try again.");
        navigation.replace("Login");
      }
    };

    processLogin();
  }, [auth, username, discordId, id, navigation]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#007bff" />
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

