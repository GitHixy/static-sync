import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import NewsScreen from '../screens/NewsScreen';
import MaintenanceScreen from '../screens/MaintenanceScreen';
import ServerStatusScreen from '../screens/ServerStatusScreen';
import SearchPlayerScreen from '../screens/SearchPlayerScreen';
import ManageStaticScreen from '../screens/ManageStaticScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} 
        options={{
          headerStyle: {
            backgroundColor: '#000', 
          },
          headerTintColor: '#fff', 
          headerTitleStyle: {
            fontWeight: 'bold', 
          },
        }} />
        <Stack.Screen name="Register" component={RegisterScreen} 
        options={{
          headerStyle: {
            backgroundColor: '#000', 
          },
          headerTintColor: '#fff', 
          headerTitleStyle: {
            fontWeight: 'bold', 
          },
        }}/>
        <Stack.Screen name="Home" component={HomeScreen} 
        options={{
          headerStyle: {
            backgroundColor: '#000', 
          },
          headerTintColor: '#fff', 
          headerTitleStyle: {
            fontWeight: 'bold', 
          },
        }}/>
        <Stack.Screen name="News" component={NewsScreen} 
        options={{
          headerStyle: {
            backgroundColor: '#000', 
          },
          headerTintColor: '#fff', 
          headerTitleStyle: {
            fontWeight: 'bold', 
          },
        }}/>
        <Stack.Screen name="Maintenance" component={MaintenanceScreen} 
        options={{
          headerStyle: {
            backgroundColor: '#000', 
          },
          headerTintColor: '#fff', 
          headerTitleStyle: {
            fontWeight: 'bold', 
          },
        }}/>
        <Stack.Screen name="Server Status" component={ServerStatusScreen} 
        options={{
          headerStyle: {
            backgroundColor: '#000', 
          },
          headerTintColor: '#fff', 
          headerTitleStyle: {
            fontWeight: 'bold', 
          },
        }} />
        <Stack.Screen name="Search Player" component={SearchPlayerScreen} 
        options={{
          headerStyle: {
            backgroundColor: '#000', 
          },
          headerTintColor: '#fff', 
          headerTitleStyle: {
            fontWeight: 'bold', 
          },
        }} />
        <Stack.Screen name="Manage Statics" component={ManageStaticScreen} 
        options={{
          headerStyle: {
            backgroundColor: '#000', 
          },
          headerTintColor: '#fff', 
          headerTitleStyle: {
            fontWeight: 'bold', 
          },
        }} />



      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
