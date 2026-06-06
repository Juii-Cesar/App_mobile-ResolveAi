import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  Animated,
  Dimensions,
} from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useFonts, Homenaje_400Regular } from '@expo-google-fonts/homenaje';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import TelaEnderecos from './src/screens/TelaEnderecos';


import { UserTypeProvider } from "./src/context/UserTypeContext";

import TelaAbertura    from './src/screens/TelaAbertura';
import TelaInicial     from './src/screens/TelaInicial';
import TelaToken       from './src/screens/TelaToken';
import TelaTipoConta   from './src/screens/TelaTipoConta';
import TelaDadosPessoais from './src/screens/TelaDadosPessoais';
import TelaEspecialidades from './src/screens/TelaEspecialidades';
import TelaVerificacao from './src/screens/TelaVerificacao';
import TelaFotoPerfil from './src/screens/TelaFotoPerfil';
import TelaDocumento from './src/screens/TelaDocumento';
import TelaResidencia from './src/screens/TelaResidencia';
import TelaTermos from './src/screens/TelaTermos';
import TelaPrincipalProfissional from './src/screens/TelaPrincipalProfissional';
import TelaMenuProfissional from './src/screens/TelaMenuProfissional';
import TelaAtividadesDetalhada from './src/screens/TelaAtividades'; 
import { TelaQuaseLa } from './src/screens/TelaQuaseLa'; 

import TelaInicio   from './src/screens/TelaInicio';
import TelaServicos from './src/screens/TelaServicos';
import TelaConta    from './src/screens/TelaConta';

const SCREEN_WIDTH = Dimensions.get('window').width;
const TAB_COUNT = 3;
const TAB_WIDTH = SCREEN_WIDTH / TAB_COUNT;

function CustomTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();
  const translateX = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.spring(translateX, {
      toValue: state.index * TAB_WIDTH,
      useNativeDriver: true,
      tension: 60,
      friction: 10,
    }).start();
  }, [state.index]);

  const tabs = [
    { name: 'Início',   icon: 'home-outline',          iconActive: 'home' },
    { name: 'Serviços', icon: 'document-text-outline',  iconActive: 'document-text' },
    { name: 'Conta',    icon: 'person-outline',         iconActive: 'person' },
  ];

  return (
    <View style={[styles.tabBar, { paddingBottom: insets.bottom, height: 56 + insets.bottom }]}>
      <Animated.View
        style={[
          styles.tabIndicator,
          { width: TAB_WIDTH, transform: [{ translateX }] },
        ]}
      />

      {state.routes.map((route, index) => {
        const tab = tabs[index];
        if (!tab) return null;
        const isFocused = state.index === index;

        return (
          <TouchableOpacity
            key={route.key}
            style={styles.tabButton}
            onPress={() => navigation.navigate(route.name)}
            activeOpacity={0.8}
          >
            <Ionicons
              name={isFocused ? tab.iconActive : tab.icon}
              size={22}
              color={isFocused ? '#1565C0' : '#555'}
            />
            <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
              {tab.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const Tab = createBottomTabNavigator();

function TabsNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Início"   component={TelaInicio} />
      <Tab.Screen name="Serviços" component={TelaServicos} />
      <Tab.Screen name="Conta"    component={TelaConta} />
      <Tab.Screen name="TelaEnderecos" component={TelaEnderecos} />
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
        <Stack.Screen name="TelaQuaseLa"       component={TelaQuaseLa} />
        <Stack.Screen name="TelaEspecialidades" component={TelaEspecialidades} />
        <Stack.Screen name="TelaVerificacao"    component={TelaVerificacao} />
        <Stack.Screen name="TelaFotoPerfil"     component={TelaFotoPerfil} />
        <Stack.Screen name="TelaDocumento"      component={TelaDocumento} />
        <Stack.Screen name="TelaResidencia"     component={TelaResidencia} />
        <Stack.Screen name="TelaTermos"         component={TelaTermos} />
        <Stack.Screen name="TelaPrincipalProfissional" component={TelaPrincipalProfissional} />
        <Stack.Screen name="TelaMenuProfissional"      component={TelaMenuProfissional} />
        <Stack.Screen name="TelaAtividades"            component={TelaAtividadesDetalhada} />
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
  tabBar:{
    flexDirection:'row',
    backgroundColor:'#D9D9D9',
    borderTopWidth:1,
    borderTopColor:'#AAA',
    height:86,
    paddingBottom:12,
    justifyContent:'center',
    position:'relative'
  },
  tabButton:{
    flex:1,
    alignItems:'center',
    justifyContent:'center',
    paddingTop:12
  },
  tabLabel: {
    fontSize: 11,
    color: '#444',
    marginTop:2,
    fontFamily:'Homenaje_400Regular'
  },
  tabLabelActive: {
    color: '#1565C0',
  },
  tabIndicator: {
    position: 'absolute',
    top:0,
    height:3,
    backgroundColor:'#1565C0',
    borderRadius:10,
  },
  botaoFlutuante:{
    position:'absolute',
    right:16,
    flexDirection:'row',
    alignItems:'center',
    backgroundColor:'#1565C0',
    paddingHorizontal:16,
    paddingVertical:10,
    borderRadius:30,
    elevation:6,
    shadowColor:"#000",
    shadowOpacity:0.25,
    shadowRadius:6,
    shadowOffset:{ width:0, height:3 },
    zIndex:999
  },
  botaoFlutuanteTexto:{
    color:"#FFF",
    fontWeight:"700",
    fontSize:13,
    fontFamily:'Homenaje_400Regular'
  }
});