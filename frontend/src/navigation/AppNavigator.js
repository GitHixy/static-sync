import React from "react";
import { NavigationContainer } from "@react-navigation/native";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import NewsScreen from "../screens/NewsScreen";
import MaintenanceScreen from "../screens/MaintenanceScreen";
import ServerStatusScreen from "../screens/ServerStatusScreen";
import SearchPlayerScreen from "../screens/SearchPlayerScreen";
import ManageStaticScreen from "../screens/ManageStaticScreen";
import StaticDetailsScreen from "../screens/StaticDetailsScreen";
import PluginsScreen from "../screens/PluginsScreen";
import SuccessScreen from "../screens/SuccessScreen";
import DalamudNewsScreen from "../screens/DalamudNewsScreen";

export const navigationRef = React.createRef();

const Stack = createNativeStackNavigator();

const linking = {
  prefixes: [
    "https://static-sync-7mzv.onrender.com",
   "myapp://static-sync-7mzv.onrender.com",
    "exp://127.0.0.1:19000",
  ],
  config: {
   screens: {
      Success: "success",
      Login: "login",
      Register: "register",
      Home: "home",
      News: "news",
      Maintenance: "maintenance",
      "Server Status": "server-status",
      "Search Player": "search-player",
      "Manage Statics": "manage-statics",
      "Static Details": "static-details",
      Plugins: "plugins",
    },
  },
};

const AppNavigator = () => {
  return (
    <NavigationContainer ref={navigationRef} linking={linking}>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            headerStyle: {
              backgroundColor: "#000",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{
            headerStyle: {
              backgroundColor: "#000",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerStyle: {
              backgroundColor: "#000",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
        <Stack.Screen
          name="News"
          component={NewsScreen}
          options={{
            headerStyle: {
              backgroundColor: "#000",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
                <Stack.Screen
          name="Dalamud News"
          component={DalamudNewsScreen}
          options={{
            headerStyle: {
              backgroundColor: "#000",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
        <Stack.Screen
          name="Maintenance"
          component={MaintenanceScreen}
          options={{
            headerStyle: {
              backgroundColor: "#000",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
        <Stack.Screen
          name="Server Status"
          component={ServerStatusScreen}
          options={{
            headerStyle: {
              backgroundColor: "#000",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
        <Stack.Screen
          name="Search Player"
          component={SearchPlayerScreen}
          options={{
            headerStyle: {
              backgroundColor: "#000",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
        <Stack.Screen
          name="Manage Statics"
          component={ManageStaticScreen}
          options={{
            headerStyle: {
              backgroundColor: "#000",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
        <Stack.Screen
          name="Static Details"
          component={StaticDetailsScreen}
          options={{
            headerStyle: {
              backgroundColor: "#000",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
        <Stack.Screen
          name="Plugins"
          component={PluginsScreen}
          options={{
            headerStyle: {
              backgroundColor: "#000",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
        <Stack.Screen
          name="Success"
          component={SuccessScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};


export default AppNavigator;
