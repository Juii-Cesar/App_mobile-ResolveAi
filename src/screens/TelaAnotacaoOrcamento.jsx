import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const BLUE = '#076BDE';

export default function TelaAnotacaoOrcamento({ navigation, route }) {
  const anotacaoInicial = route?.params?.anotacao ?? '';

  const [anotacao, setAnotacao] = useState(anotacaoInicial);
  const [valor, setValor] = useState('');
  const [etapa, setEtapa] = useState('anotacao'); // 'anotacao' | 'valor'

  function handleAvancar() {
    if (etapa === 'anotacao') {
      setEtapa('valor');
    } else {
      navigation.navigate('TelaServicoFinalizado', { valor: valor || 'A combinar' });
    }
  }

  const podeContinuar = etapa === 'anotacao' ? true : valor.trim().length > 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => etapa === 'valor' ? setEtapa('anotacao') : navigation.goBack()}
          style={styles.btnVoltar}
        >
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnFinalizar} onPress={handleAvancar}>
          <Text style={styles.btnFinalizarTexto}>Finalizar serviço</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >

          {etapa === 'anotacao' ? (
            <>
              {/* Tela de anotação */}
              <Text style={styles.titulo}>Adicione{'\n'}uma anotação{'\n'}de orçamento</Text>

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
            </>
          ) : (
            <>
              {/* Tela de valor */}
              <Text style={styles.titulo}>Insira o valor{'\n'}do serviço</Text>

              <TextInput
                style={styles.inputValor}
                placeholder="Valor..."
                placeholderTextColor="#AAA"
                value={valor}
                onChangeText={setValor}
                keyboardType="numeric"
              />

              <TouchableOpacity
                style={[styles.btnFinalizar2, !podeContinuar && styles.btnDesabilitado]}
                onPress={handleAvancar}
                disabled={!podeContinuar}
              >
                <Text style={styles.btnFinalizar2Texto}>Finalizar</Text>
              </TouchableOpacity>
            </>
          )}

        </ScrollView>
      </KeyboardAvoidingView>
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

  btnFinalizar: {
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

  scroll: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingBottom: 10,
  },

  titulo: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 46,
    color: '#9BA7B1',
    textAlign: 'center',
    lineHeight: 52,
    marginTop: 80,
  },

  inputGrande: {
    height: 50,
    backgroundColor: '#D9D9D9',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 12,
    paddingHorizontal: 12,
    fontFamily: 'Homenaje_400Regular',
    fontSize: 18,
    color: '#333',
    marginRight: 50,
    marginBottom: 10,
  },

  btnAvancar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: BLUE,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
    position: 'absolute',
    bottom: 15,
    right: 10,
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
    marginTop: 30,
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