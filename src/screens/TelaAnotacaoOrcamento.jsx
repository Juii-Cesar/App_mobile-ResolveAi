import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Keyboard,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const BLUE = '#076BDE';

export default function TelaAnotacaoOrcamento({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const anotacaoInicial = route?.params?.anotacao ?? '';

  const [anotacao, setAnotacao] = useState(anotacaoInicial);
  const [valor, setValor] = useState('');
  const [etapa, setEtapa] = useState('anotacao');
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', e => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const hide = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });
    return () => { show.remove(); hide.remove(); };
  }, []);

  function handleAvancar() {
    if (etapa === 'anotacao') {
      setEtapa('valor');
    } else {
      navigation.navigate('TelaServicoFinalizado', { valor: valor || 'A combinar' });
    }
  }

  const podeContinuar = etapa === 'anotacao' ? true : valor.trim().length > 0;
  const bottomOffset = keyboardHeight > 0 ? keyboardHeight + 40 : insets.bottom + 16;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => etapa === 'valor' ? setEtapa('anotacao') : navigation.goBack()}
          style={styles.btnVoltar}
        >
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnFinalizarHeader} onPress={handleAvancar}>
          <Text style={styles.btnFinalizarTexto}>Finalizar serviço</Text>
        </TouchableOpacity>
      </View>


      <View style={styles.tituloContainer}>
        <Text style={styles.titulo}>
          {etapa === 'anotacao'
            ? 'Adicione\numa anotação\nde orçamento'
            : 'Insira o valor\ndo serviço'}
        </Text>
      </View>

      <View style={[styles.inputContainer, { bottom: bottomOffset }]}>
        {etapa === 'anotacao' ? (
          <View style={styles.inputRow}>
            <TextInput
              style={styles.inputGrande}
              placeholder="Anotações..."
              placeholderTextColor="#AAA"
              value={anotacao}
              onChangeText={setAnotacao}
              multiline
              textAlignVertical="top"
            />
            <TouchableOpacity style={styles.btnAvancar} onPress={handleAvancar}>
              <Ionicons name="send" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <TextInput
              style={styles.inputValor}
              placeholder="Valor..."
              placeholderTextColor="#AAA"
              value={valor}
              onChangeText={setValor}
              keyboardType="numeric"
              autoFocus
            />
            <TouchableOpacity
              style={[styles.btnFinalizar2, !podeContinuar && styles.btnDesabilitado]}
              onPress={handleAvancar}
              disabled={!podeContinuar}
            >
              <Text style={styles.btnFinalizar2Texto}>Finalizar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D9D9D9',
  },

  header: {
    height: 60,
    backgroundColor: '#D9D9D9',
    borderBottomWidth: 1,
    borderBottomColor: '#9BA7B1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },

  btnVoltar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: BLUE,
    justifyContent: 'center',
    alignItems: 'center',
  },

  btnFinalizarHeader: {
    backgroundColor: BLUE,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#333',
  },

  btnFinalizarTexto: {
    color: '#FFF',
    fontFamily: 'Homenaje_400Regular',
    fontSize: 18,
  },

  tituloContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  titulo: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 46,
    color: '#9BA7B1',
    textAlign: 'center',
    lineHeight: 52,
  },

  inputContainer: {
    position: 'absolute',
    left: 12,
    right: 12,
  },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  inputGrande: {
    flex: 1,
    minHeight: 60,
    maxHeight: 120,
    backgroundColor: '#D9D9D9',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 12,
    paddingHorizontal: 12,
    fontFamily: 'Homenaje_400Regular',
    fontSize: 18,
    color: '#333',
  },

  btnAvancar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: BLUE,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },

  inputValor: {
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CCC',
    paddingHorizontal: 12,
    fontFamily: 'Homenaje_400Regular',
    fontSize: 18,
    color: '#333',
    marginBottom: 10,
  },

  btnFinalizar2: {
    backgroundColor: BLUE,
    borderRadius: 12,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },

  btnFinalizar2Texto: {
    color: '#FFF',
    fontFamily: 'Homenaje_400Regular',
    fontSize: 20,
  },

  btnDesabilitado: {
    backgroundColor: '#9BA7B1',
  },
});