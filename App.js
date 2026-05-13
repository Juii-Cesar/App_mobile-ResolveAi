import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts, Homenaje_400Regular } from '@expo-google-fonts/homenaje';

import TelaAbertura from './src/screens/TelaAbertura';
import TelaInicial from './src/screens/TelaInicial';
import TelaToken from './src/screens/TelaToken';

const Stack = createNativeStackNavigator();

export default function App() {
  let [fontsLoaded] = useFonts({
    Homenaje_400Regular,
  });

  if (!fontsLoaded) {
    return null; 
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Abertura" component={TelaAbertura} />
        <Stack.Screen name="Inicial" component={TelaInicial} />
        <Stack.Screen name="Token" component={TelaToken} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}