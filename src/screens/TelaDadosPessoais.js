import React from 'react';
import { StyleSheet, View, Text, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; 
import LogoIcon from '../assets/icons/LogoIcon'; 
import { Button } from '../components/Button';


import { useUserType } from '../context/UserTypeContext';

const BLUE_COLOR = '#076BDE';

export default function TelaDadosPessoais({ navigation }) {

  const { accountType } = useUserType();

  const handleAvancar = () => {
    console.log('Dados salvos! Tipo de conta:', accountType);

    if (accountType === 'profissional') {
      navigation.navigate('TelaEspecialidades');
    }};

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <View style={styles.header}>
        <SafeAreaView edges={['top']} />
        <View style={styles.logoContainer}>
          <LogoIcon width={70} height={70} fill="#FFFFFF" />
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Conte-nos mais{"\n"}sobre você</Text>

        <View style={styles.inputGroup}>
          <TextInput style={styles.input} placeholder="Nome" placeholderTextColor="#000" />
          <TextInput style={styles.input} placeholder="Sobrenome" placeholderTextColor="#000" />
          <TextInput style={styles.input} placeholder="Data de nascimento" placeholderTextColor="#000" keyboardType="numeric" />
          <TextInput style={styles.input} placeholder="CPF" placeholderTextColor="#000" keyboardType="numeric" />
        </View>

        <Button 
          title="Continuar" 
          onPress={handleAvancar} 
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#DBDBDB' 
  },
  header: {
    backgroundColor: BLUE_COLOR,
    height: 220, 
    alignItems: 'center',
  },
  logoContainer: {
    marginTop: 40 
  },
  content: { 
    flex: 1, 
    backgroundColor: '#DBDBDB',
    marginTop: -80, 
    borderTopLeftRadius: 100, 
    paddingHorizontal: 30, 
    alignItems: 'center',
    paddingTop: 40, 
  },
  title: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 45, 
    color: BLUE_COLOR,
    textAlign: 'center',
    marginBottom: 30,
  },
  inputGroup: {
    width: '100%',
    alignItems: 'center',
    gap: 15,
    marginBottom: 40,
  },
  input: {
    backgroundColor: '#FFF',
    width: 260,
    height: 45,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: '#000',
    paddingHorizontal: 20,
    fontFamily: 'Homenaje_400Regular',
    fontSize: 24,
  }
});