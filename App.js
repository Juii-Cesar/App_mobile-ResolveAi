import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useFonts, Homenaje_400Regular } from '@expo-google-fonts/homenaje';
import { UserTypeProvider } from "./src/context/UserTypeContext";
import { AuthStack } from './src/navigation/AuthStack';
import { RegistrationProvider } from './src/context/RegistrationContext';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function App() {
  const [fontsLoaded] = useFonts({
    Homenaje_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <UserTypeProvider>
      <RegistrationProvider> 
        <SafeAreaProvider>
          <NavigationContainer>
            <AuthStack /> 
          </NavigationContainer>
        </SafeAreaProvider>
      </RegistrationProvider>
    </UserTypeProvider>
  );
}