import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useFonts, Homenaje_400Regular } from '@expo-google-fonts/homenaje';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { UserTypeProvider } from "./src/context/UserTypeContext";
import { AuthStack } from './src/navigation/AuthStack';

export default function App() {
  let [fontsLoaded] = useFonts({ Homenaje_400Regular });
  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <UserTypeProvider>
        <NavigationContainer>
          <AuthStack />
        </NavigationContainer>
      </UserTypeProvider>
    </SafeAreaProvider>
  );
}