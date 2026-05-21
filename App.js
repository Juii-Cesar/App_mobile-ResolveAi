import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useFonts, Homenaje_400Regular } from '@expo-google-fonts/homenaje';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

import { UserTypeProvider } from "./src/context/UserTypeContext";

import TelaAbertura from './src/screens/TelaAbertura';
import TelaInicial from './src/screens/TelaInicial';
import TelaToken from './src/screens/TelaToken';
import TelaTipoConta from './src/screens/TelaTipoConta';
import TelaDadosPessoais from './src/screens/TelaDadosPessoais';

import TelaInicio from './src/screens/TelaInicio';
import TelaServicos from './src/screens/TelaServicos';
import TelaConta from './src/screens/TelaConta';

const Tab = createBottomTabNavigator();

function TabsNavigator() {
  
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#CBCBCB',
          borderTopWidth: 1,
          borderTopColor: '#aaa',
          
          height: 56 + insets.bottom,
          paddingBottom: insets.bottom + 4,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        tabBarActiveTintColor: '#1565C0',
        tabBarInactiveTintColor: '#444',
        tabBarIcon: ({ color }) => {
          const icons = {
            'Início':   'home-outline',
            'Serviços': 'document-text-outline',
            'Conta':    'person-outline',
          };
          return <Ionicons name={icons[route.name]} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Início"   component={TelaInicio} />
      <Tab.Screen name="Serviços" component={TelaServicos} />
      <Tab.Screen name="Conta"    component={TelaConta} />
    </Tab.Navigator>
  );
}

function BotaoTesteFlutante() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <TouchableOpacity
      style={[styles.botaoFlutuante, { bottom: 56 + insets.bottom + 12 }]}
      onPress={() => navigation.navigate('Tabs')}
      activeOpacity={0.8}
    >
      <Ionicons name="home-outline" size={15} color="#fff" style={{ marginRight: 6 }} />
      <Text style={styles.botaoFlutuanteTexto}>Testar App</Text>
    </TouchableOpacity>
  );
}

const Stack = createNativeStackNavigator();

function RootNavigator() {
  return (
    <>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Abertura"          component={TelaAbertura} />
        <Stack.Screen name="Inicial"           component={TelaInicial} />
        <Stack.Screen name="Token"             component={TelaToken} />
        <Stack.Screen name="TelaTipoConta"     component={TelaTipoConta} />
        <Stack.Screen name="TelaDadosPessoais" component={TelaDadosPessoais} />
        <Stack.Screen name="Tabs"              component={TabsNavigator} />
      </Stack.Navigator>

      <BotaoTesteFlutante />
    </>
  );
}


export default function App() {
  let [fontsLoaded] = useFonts({ Homenaje_400Regular });
  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <UserTypeProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </UserTypeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  botaoFlutuante: {
    position: 'absolute',
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1565C0',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    zIndex: 999,
  },
  botaoFlutuanteTexto: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
});