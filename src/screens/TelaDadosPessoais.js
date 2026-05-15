import React from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; 
import LogoIcon from '../assets/icons/LogoIcon'; 

const BLUE_COLOR = '#076BDE';

export default function TelaDadosPessoais({ navigation }) {
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

        <TouchableOpacity 
          style={styles.button}
          onPress={() => console.log('Finalizando cadastro...')}
        >
          <Text style={styles.buttonText}>Continuar</Text>
        </TouchableOpacity>
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
    marginTop: 40, 
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
    lineHeight: 45,
  },
  inputGroup: { 
    width: '100%', 
    gap: 15, 
    marginBottom: 40 
  },
  input: {
    backgroundColor: '#EAEAEA',
    height: 55,
    borderRadius: 10,
    paddingHorizontal: 20,
    fontSize: 18,
    fontFamily: 'Homenaje_400Regular',
    color: '#000',
  },
  button: {
    backgroundColor: BLUE_COLOR,
    width: 225,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#000',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 555,
    fontFamily: 'Homenaje_400Regular',
  },
});