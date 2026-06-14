import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useFonts, Homenaje_400Regular } from '@expo-google-fonts/homenaje';
import { UserTypeProvider } from "./src/context/UserTypeContext";
import { RootNavigator } from './src/navigation/RootNavigator';
import { RegistrationProvider } from './src/context/RegistrationContext';
import { ServicoProvider } from './src/context/ServicoContext';
import { AuthProvider } from './src/context/AuthContext';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function App() {
  const [fontsLoaded] = useFonts({
    Homenaje_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <UserTypeProvider>
        <RegistrationProvider>
          <ServicoProvider>
            <SafeAreaProvider>
              <NavigationContainer>
                <RootNavigator />
              </NavigationContainer>
            </SafeAreaProvider>
          </ServicoProvider>
        </RegistrationProvider>
      </UserTypeProvider>
    </AuthProvider>
  );
}