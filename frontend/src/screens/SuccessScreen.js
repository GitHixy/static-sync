import React, { useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SuccessScreen = ({ navigation }) => {
  useEffect(() => {
    const extractToken = async () => {
      const queryParams = new URLSearchParams(window.location.search);
      const token = queryParams.get("auth");
      const userId = queryParams.get("id");
      const username = queryParams.get("username");

      if (token) {
        await AsyncStorage.setItem("token", token);
        await AsyncStorage.setItem("userId", userId);
        await AsyncStorage.setItem("username", username);
        navigation.replace("Home");
      } else {
        Alert.alert("Login Failed", "Token not found in URL");
        navigation.replace("Login");
      }
    };

    extractToken();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size={50} color="#0000ff" />
      <Text style={styles.text}>Processing Login...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    color: "#333",
  },
});

export default SuccessScreen;

