import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts, Homenaje_400Regular } from '@expo-google-fonts/homenaje';

import { UserTypeProvider } from "./src/context/UserTypeContext"; 

import TelaAbertura from './src/screens/TelaAbertura';
import TelaInicial from './src/screens/TelaInicial';
import TelaToken from './src/screens/TelaToken';
import TelaTipoConta from './src/screens/TelaTipoConta';
import TelaDadosPessoais from './src/screens/TelaDadosPessoais';
import TelaEspecialidades from './src/screens/TelaEspecialidades';

const Stack = createNativeStackNavigator();

export default function App() {
  let [fontsLoaded] = useFonts({ Homenaje_400Regular });

  if (!fontsLoaded) return null; 

  return (
    <UserTypeProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Abertura" component={TelaAbertura} />
          <Stack.Screen name="Inicial" component={TelaInicial} />
          <Stack.Screen name="Token" component={TelaToken} />
          <Stack.Screen name="TelaTipoConta" component={TelaTipoConta} />
          <Stack.Screen name="TelaDadosPessoais" component={TelaDadosPessoais} />
          <Stack.Screen name="TelaEspecialidades" component={TelaEspecialidades} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserTypeProvider>
  );
}