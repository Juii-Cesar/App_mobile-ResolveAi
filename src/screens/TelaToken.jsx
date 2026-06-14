import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import SetaVoltar from '../assets/icons/SetaVoltar';
import Logo from '../assets/icons/LogoIcon';
import { supabase } from '../services/supabase';

const BG_GRAY = '#DBDBDB'; 
const BLUE_COLOR = '#076BDE';
const KEYPAD_BG = '#F1F4F6';

export default function TelaToken({ navigation, route }) {
  const insets = useSafeAreaInsets();
  
  const [codigo, setCodigo] = useState('');
  const [carregando, setCarregando] = useState(false);

  const emailUsuario = route.params?.emailUsuario || '';

  const handlePressNumero = (num) => {
    if (codigo.length < 6) {
      setCodigo(codigo + num);
    }
  };

  const handleApagar = () => {
    if (codigo.length > 0) {
      setCodigo(codigo.slice(0, -1));
    }
  };

  const handleValidarToken = async () => {
    if (codigo.length < 6) {
      Alert.alert('Código incompleto', 'Por favor, insira os 6 dígitos do token enviado.');
      return;
    }

    if (!emailUsuario) {
      Alert.alert('Erro', 'E-mail do usuário não encontrado. Volte e tente novamente.');
      return;
    }

    setCarregando(true);

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: emailUsuario,
        token: codigo,
        type: 'email',
      });

      if (error) throw error;

      console.log('Usuário autenticado com sucesso!', data.user);

      navigation.navigate('TelaTipoConta');

    } catch (error) {
      Alert.alert('Token Inválido', error.message || 'O código digitado está incorreto ou expirou.');
      setCodigo('');
    } finally {
      setCarregando(false);
    }
  };

  const renderizarQuadrados = () => {
    let quadrados = [];
    for (let i = 0; i < 6; i++) {
      quadrados.push(
        <View key={i} style={styles.quadrado}>
          <Text style={styles.textoQuadrado}>
            {codigo[i] ? codigo[i] : '—'} 
          </Text>
        </View>
      );
    }
    return quadrados;
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) + 10 }]}>
        <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.goBack()}>
          <SetaVoltar width={45} height={45} />
        </TouchableOpacity>
        <View style={styles.iconContainer}>
          <Logo width={45} height={45} />
        </View>
      </View>

      <View style={styles.middleContent}>
        <View style={styles.codigoContainer}>
          {renderizarQuadrados()}
        </View>

        <TouchableOpacity 
          style={styles.circleButtonAvancar}
          onPress={handleValidarToken}
          disabled={carregando}
        >
          {carregando ? (
            <ActivityIndicator color={BLUE_COLOR} size="small" />
          ) : (
            <Feather name="arrow-right" size={30} color={BLUE_COLOR} />
          )}
        </TouchableOpacity>
      </View>

      <View style={[styles.keypadContainer, { paddingBottom: Math.max(insets.bottom, 20) + 20 }]}>
        <View style={styles.dragHandle} />
        
        <View style={styles.keypadRow}>
          {[1, 2, 3].map((num) => (
            <TouchableOpacity key={num} style={styles.keyButton} onPress={() => handlePressNumero(num.toString())}>
              <Text style={styles.keyText}>{num}</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.keypadRow}>
          {[4, 5, 6].map((num) => (
            <TouchableOpacity key={num} style={styles.keyButton} onPress={() => handlePressNumero(num.toString())}>
              <Text style={styles.keyText}>{num}</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.keypadRow}>
          {[7, 8, 9].map((num) => (
            <TouchableOpacity key={num} style={styles.keyButton} onPress={() => handlePressNumero(num.toString())}>
              <Text style={styles.keyText}>{num}</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.keypadRow}>
          <View style={styles.keyButtonVazio} /> 
          <TouchableOpacity style={styles.keyButton} onPress={() => handlePressNumero('0')}>
            <Text style={styles.keyText}>0</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.keyButtonAcao} onPress={handleApagar}>
            <Feather name="delete" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: BG_GRAY 
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  iconContainer: { 
    width: 45, 
    height: 45, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  middleContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 50, // Mantém um espaço bonito entre os quadrados e a seta azul
  },
  codigoContainer: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    gap: 8, 
    paddingHorizontal: 10 
  },
  quadrado: { 
    width: 48, 
    height: 55, 
    borderWidth: 1.5, 
    borderColor: '#000', 
    borderRadius: 10, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'transparent' 
  },
  textoQuadrado: { 
    fontSize: 26, 
    fontFamily: 'Homenaje_400Regular' 
  },
  circleButtonAvancar: { 
    width: 60, 
    height: 60, 
    borderRadius: 30, 
    borderWidth: 1.5, 
    borderColor: BLUE_COLOR, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  keypadContainer: { 
    backgroundColor: KEYPAD_BG, 
    borderTopLeftRadius: 30, 
    borderTopRightRadius: 30, 
    paddingTop: 20, 
    paddingHorizontal: 20,
    alignItems: 'center' 
  },
  dragHandle: { 
    width: 40, 
    height: 5, 
    backgroundColor: '#000', 
    borderRadius: 3, 
    marginBottom: 30 
  },
  keypadRow: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    width: '100%', 
    marginBottom: 15, 
    gap: 15 
  },
  keyButton: { 
    flex: 1, 
    height: 50, 
    backgroundColor: '#D9DFE3', 
    borderRadius: 5, 
    justifyContent: 'center', 
    alignItems: 'center', 
    maxWidth: 100 
  },
  keyButtonVazio: { 
    flex: 1, 
    maxWidth: 100 
  },
  keyButtonAcao: { 
    flex: 1, 
    height: 50, 
    justifyContent: 'center', 
    alignItems: 'center', 
    maxWidth: 100 
  },
  keyText: { 
    fontFamily: 'Homenaje_400Regular', 
    fontSize: 24, 
    color: '#000' 
  },
});