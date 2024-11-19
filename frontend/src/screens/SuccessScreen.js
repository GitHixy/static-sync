import React, { useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet, Alert } from "react-native";
import { useRoute } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";

const SuccessScreen = ({ navigation }) => {
  useEffect(() => {
    const extractToken = async () => {
      const route = useRoute();
      const { auth, username, discordId, id } = route.params || {};
      useEffect(() => {
        console.log('Auth Token:', auth);
        console.log('User ID:', id);
        console.log('Username:', username);
        console.log('Discord ID:', discordId);
      }, []);

      if (auth) {
        await AsyncStorage.setItem("token", auth);
        await AsyncStorage.setItem("userId", id);
        await AsyncStorage.setItem("username", username);
        await AsyncStorage.setItem("discordId", discordId);
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

