import { enableScreens } from 'react-native-screens';
enableScreens(); 
import { SafeAreaProvider } from "react-native-safe-area-context";

import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return ( 
   
    <SafeAreaProvider> 
   <AppNavigator />
   </SafeAreaProvider>
 )
}
