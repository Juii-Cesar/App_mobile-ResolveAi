import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Keyboard,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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

  const handleMascaraMoeda = (textoDigitado) => {
    let numeroLimpo = textoDigitado.replace(/\D/g, '');
    
    if (numeroLimpo === '') {
      setValor('');
      return;
    }

    let valorNumerico = (Number(numeroLimpo) / 100).toFixed(2);
    valorNumerico = valorNumerico.replace('.', ',');
    valorNumerico = valorNumerico.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    
    setValor(`R$ ${valorNumerico}`);
  };

  function handleAvancar() {
    if (etapa === 'anotacao') {
      setEtapa('valor');
    } else {
      navigation.navigate('TelaServicoFinalizado', { valor: valor || 'R$ 0,00' });
    }
  }

  const podeContinuar = etapa === 'anotacao' ? true : valor.trim().length > 0 && valor !== 'R$ 0,00';
  const bottomOffset = keyboardHeight > 0 ? keyboardHeight + 20 : insets.bottom + 20;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity
          onPress={() => etapa === 'valor' ? setEtapa('anotacao') : navigation.goBack()}
          style={styles.btnVoltar}
        >
          <Ionicons name="arrow-back" size={26} color="#FFF" />
        </TouchableOpacity>

        {etapa === 'anotacao' && (
          <TouchableOpacity style={styles.btnFinalizarHeader} onPress={handleAvancar}>
            <Text style={styles.btnFinalizarTexto}>Finalizar serviço</Text>
          </TouchableOpacity>
        )}
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
              <Ionicons name="send" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <TextInput
              style={styles.inputValor}
              placeholder="R$ 0,00"
              placeholderTextColor="#AAA"
              value={valor}
              onChangeText={handleMascaraMoeda}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D9D9D9',
  },
  header: {
    backgroundColor: '#D9D9D9',
    borderBottomWidth: 1,
    borderBottomColor: '#9BA7B1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16, 
    paddingBottom: 15,
  },
  btnVoltar: {
    width: 46, 
    height: 46,
    borderRadius: 23,
    backgroundColor: BLUE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnFinalizarHeader: {
    backgroundColor: BLUE,
    borderRadius: 16, 
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderWidth: 1.5,
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
    paddingHorizontal: 20,
    marginTop: -80,
  },
  titulo: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 46, 
    color: '#7A8A9E',
    textAlign: 'center',
    lineHeight: 50,
  },
  inputContainer: {
    position: 'absolute',
    left: 20,
    right: 20,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  inputGrande: {
    flex: 1,
    minHeight: 65,
    maxHeight: 140,
    backgroundColor: '#FFF',
    borderWidth: 1.5,
    borderColor: '#A0A8B0',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingTop: 15,
    fontFamily: 'Homenaje_400Regular',
    fontSize: 22, 
    color: '#333',
  },
  btnAvancar: {
    width: 54, 
    height: 54,
    borderRadius: 27,
    backgroundColor: BLUE,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#333', 
  },
  inputValor: {
    height: 65,
    backgroundColor: '#FFF',
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: '#A0A8B0',
    paddingHorizontal: 18,
    fontFamily: 'Homenaje_400Regular',
    fontSize: 28, 
    color: '#333',
    marginBottom: 15,
  },
  btnFinalizar2: {
    backgroundColor: BLUE,
    borderRadius: 15,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#333', 
  },
  btnFinalizar2Texto: {
    color: '#FFF',
    fontFamily: 'Homenaje_400Regular',
    fontSize: 26, 
  },
  btnDesabilitado: {
    backgroundColor: '#9BA7B1',
    borderColor: '#555',
  },
});