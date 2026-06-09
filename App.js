import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useFonts, Homenaje_400Regular } from '@expo-google-fonts/homenaje';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { UserTypeProvider } from "./src/context/UserTypeContext";
import { AuthStack } from './src/navigation/AuthStack';
import { RegistrationProvider } from './src/context/RegistrationContext';

export default function App() {
  return (
    <RegistrationProvider> 
      <SafeAreaProvider>
        <UserTypeProvider>
          <NavigationContainer>
            <AuthStack /> 
          </NavigationContainer>
        </UserTypeProvider>
      </SafeAreaProvider>
    </RegistrationProvider>
  );
}