import { enableScreens } from "react-native-screens";
enableScreens();
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "react-native";
import * as Linking from "expo-linking";
import React, { useEffect } from "react";
import AppNavigator, { navigationRef } from "./src/navigation/AppNavigator";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  useEffect(() => {
    const handleDeepLink = async (event) => {
      console.log("Received deep link:", event?.url);

      const url = event?.url;
      if (!url) {
        console.error("No URL received");
        return;
      }

      const parsedUrl = Linking.parse(url);
      console.log("Parsed URL:", parsedUrl);

      const { auth, refreshToken, id, username, discordId } = parsedUrl.queryParams || {};

      if (auth && refreshToken && id && username && discordId) {
        console.log("Valid deep link data, saving to AsyncStorage...");
        try {
          await AsyncStorage.setItem("token", auth);
          await AsyncStorage.setItem("refreshToken", refreshToken);
          await AsyncStorage.setItem("userId", id);
          await AsyncStorage.setItem("username", username);
          await AsyncStorage.setItem("discordId", discordId);
          console.log("Data saved successfully. Navigating to Home...");
          navigationRef.current?.navigate("Home"); 
        } catch (error) {
          console.error("Error saving data to AsyncStorage:", error);
        }
      } else {
        console.error("Invalid deep link data");
      }
    };

    const getInitialDeepLink = async () => {
      const initialUrl = await Linking.getInitialURL();
      console.log("Initial URL:", initialUrl);

      if (initialUrl) {
        handleDeepLink({ url: initialUrl });
      }
    };

   
    const subscription = Linking.addEventListener("url", handleDeepLink);

   
    getInitialDeepLink();

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <AppNavigator />
    </SafeAreaProvider>
  );
}
