import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useServico } from '../context/ServicoContext';

const BLUE = '#076BDE';
const SUGESTOES = ['Olá, já estou a caminho!', 'Pode confirmar o endereço?', 'Chego em 10 min'];

export default function TelaChatProfissional({ navigation, route }) {

  const dadosServico = route?.params?.dadosServico;
  const nomeCliente = dadosServico?.nomeCliente ?? 'Cliente';
  const servicoSolicitado = dadosServico?.servico ?? 'Serviço Geral';
  
  const { iniciarServico, cancelarServico } = useServico();
  const profissaoLimpa = servicoSolicitado.replace('Precisa de: ', '');
  
  const [mensagens, setMensagens] = useState([
    { id: '1', texto: `Olá! Vi que você aceitou meu pedido para ${profissaoLimpa}.`, minha: false },
    { id: '2', texto: 'Qual o valor médio da sua visita?', minha: false },
  ]);
  
  const [texto, setTexto] = useState('');
  const flatRef = useRef(null);

  useEffect(() => {
    iniciarServico({
      clienteNome: nomeCliente,
      servico: servicoSolicitado,
      routeParams: route?.params ?? {},
    });
  }, []);

  useEffect(() => {
    setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 100);
  }, [mensagens]);

  function enviar(msg) {
    const novaMensagem = msg ?? texto.trim();
    if (!novaMensagem) return;

    const nova = { id: Date.now().toString(), texto: novaMensagem, minha: true };
    setMensagens(prev => [...prev, nova]);
    setTexto('');

    setTimeout(() => {
      setMensagens(prev => [
        ...prev,
        { id: (Date.now() + 1).toString(), texto: 'Perfeito, aguardo você.', minha: false },
      ]);
    }, 1500);
  }

  function handleEncerrar() {
    Alert.alert(
      'Encerrar serviço',
      'Deseja realmente cancelar o serviço em andamento com este cliente?',
      [
        { text: 'Não', style: 'cancel' },
        {
          text: 'Sim, cancelar',
          style: 'destructive',
          onPress: () => {
            cancelarServico();
            navigation.popToTop();
          },
        },
      ],
    );
  }

  function renderMensagem({ item }) {
    return (
      <View style={[styles.bolha, item.minha ? styles.bolhaMinha : styles.bolhaDele]}>
        <Text style={[styles.bolhaTexto, item.minha && styles.bolhaTextoMinha]}>
          {item.texto}
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.btnVoltar}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>

        <View style={styles.headerInfo}>
          <Text style={styles.headerNome} numberOfLines={1}>{nomeCliente}</Text>
          <Text style={styles.headerServico} numberOfLines={1}>{servicoSolicitado}</Text>
        </View>

        <TouchableOpacity onPress={handleEncerrar} style={styles.btnEncerrar}>
          <Ionicons name="close-circle-outline" size={20} color="#D32F2F" />
          <Text style={styles.btnEncerrarTexto}>Encerrar</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={60}
      >
        <FlatList
          ref={flatRef}
          data={mensagens}
          keyExtractor={item => item.id}
          renderItem={renderMensagem}
          contentContainerStyle={styles.listaPadding}
          showsVerticalScrollIndicator={false}
        />

        <View style={styles.sugestoesRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {SUGESTOES.map((s, i) => (
              <TouchableOpacity key={i} style={styles.sugestao} onPress={() => enviar(s)}>
                <Text style={styles.sugestaoTexto}>{s}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Mensagem..."
            placeholderTextColor="#AAA"
            value={texto}
            onChangeText={setTexto}
            onSubmitEditing={() => enviar()}
            returnKeyType="send"
          />
          <TouchableOpacity
            style={[styles.btnEnviar, !texto.trim() && styles.btnEnviarDisabled]}
            onPress={() => enviar()}
            disabled={!texto.trim()}
          >
            <Ionicons name="send" size={18} color="#FFF" />
          </TouchableOpacity>
        </View>
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
    height: 65,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#D9D9D9',
    borderBottomWidth: 1,
    borderBottomColor: '#9BA7B1',
    gap: 12,
  },
  btnVoltar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: BLUE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  headerNome: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 24,
    color: '#111',
    lineHeight: 26,
  },
  headerServico: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 16,
    color: '#555',
    marginTop: -2,
  },
  btnEncerrar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#D32F2F',
  },
  btnEncerrarTexto: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 16,
    color: '#D32F2F',
  },
  listaPadding: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  bolha: {
    maxWidth: '75%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    marginVertical: 4,
  },
  bolhaMinha: {
    alignSelf: 'flex-end',
    backgroundColor: BLUE,
    borderBottomRightRadius: 4,
  },
  bolhaDele: {
    alignSelf: 'flex-start',
    backgroundColor: '#EEE',
    borderBottomLeftRadius: 4,
  },
  bolhaTexto: {
    fontSize: 16,
    color: '#222',
    fontFamily: 'Homenaje_400Regular',
  },
  bolhaTextoMinha: {
    color: '#FFF',
  },
  sugestoesRow: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sugestao: {
    backgroundColor: '#EEE',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#CCC',
  },
  sugestaoTexto: {
    fontSize: 15,
    color: '#444',
    fontFamily: 'Homenaje_400Regular',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 8,
    gap: 10,
    backgroundColor: '#D9D9D9',
  },
  input: {
    flex: 1,
    height: 50,
    backgroundColor: '#EEE',
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#CCC',
    fontFamily: 'Homenaje_400Regular',
  },
  btnEnviar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: BLUE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnEnviarDisabled: {
    backgroundColor: '#9BA7B1',
  },
});