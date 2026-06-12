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
  Keyboard,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const BLUE = '#076BDE';

const SUGESTOES = ['Olá', 'Está vindo ?'];

const MSGS_INICIAIS = [
  { id: '1', texto: 'Olá! Preciso de ajuda.', minha: false },
  { id: '2', texto: 'Pode vir agora?', minha: false },
];

export default function TelaChatProfissional({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const clienteNome = route?.params?.profissionalNome ?? 'Nome Profissional';

  const [mensagens, setMensagens] = useState(MSGS_INICIAIS);
  const [texto, setTexto] = useState('');
  const [anotacao, setAnotacao] = useState('');
  const [modoAnotacao, setModoAnotacao] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const flatRef = useRef(null);

  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', e => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const hide = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });
    return () => { show.remove(); hide.remove(); };
  }, []);

  useEffect(() => {
    setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 100);
  }, [mensagens]);

  function enviar(msg) {
    const novaMensagem = msg ?? texto.trim();
    if (!novaMensagem) return;
    setMensagens(prev => [...prev, { id: Date.now().toString(), texto: novaMensagem, minha: true }]);
    setTexto('');
  }

  function handleFinalizar() {
    navigation.navigate('TelaAnotacaoOrcamento', { anotacao });
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

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.btnVoltar}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>

        <Text style={styles.headerNome}>{clienteNome}</Text>

        {/* Botão Finalizar serviço no header */}
        <TouchableOpacity style={styles.btnFinalizar} onPress={handleFinalizar}>
          <Text style={styles.btnFinalizarTexto}>Finalizar serviço</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1, marginBottom: keyboardHeight }}>
        {/* Lista de mensagens */}
        <FlatList
          ref={flatRef}
          data={mensagens}
          keyExtractor={item => item.id}
          renderItem={renderMensagem}
          contentContainerStyle={styles.listaPadding}
          showsVerticalScrollIndicator={false}
        />

        {/* Sugestões rápidas */}
        <View style={styles.sugestoesRow}>
          {SUGESTOES.map((s, i) => (
            <TouchableOpacity key={i} style={styles.sugestao} onPress={() => enviar(s)}>
              <Text style={styles.sugestaoTexto}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Input row com botão de anotação */}
        <View style={[styles.inputRow, { paddingBottom: insets.bottom + 8 }]}>
          <TextInput
            style={styles.input}
            placeholder={modoAnotacao ? 'Anotações...' : 'Mensagem...'}
            placeholderTextColor="#AAA"
            value={modoAnotacao ? anotacao : texto}
            onChangeText={modoAnotacao ? setAnotacao : setTexto}
            onSubmitEditing={modoAnotacao ? undefined : () => enviar()}
            returnKeyType={modoAnotacao ? 'done' : 'send'}
            multiline={modoAnotacao}
          />

          {/* Botão alternar anotação / mensagem */}
          <TouchableOpacity
            style={[styles.btnIcone, modoAnotacao && styles.btnIconeAtivo]}
            onPress={() => setModoAnotacao(!modoAnotacao)}
          >
            <Ionicons
              name={modoAnotacao ? 'chatbubble-outline' : 'document-text-outline'}
              size={20}
              color={modoAnotacao ? '#FFF' : BLUE}
            />
          </TouchableOpacity>

          {/* Botão enviar (só no modo chat) */}
          {!modoAnotacao && (
            <TouchableOpacity
              style={[styles.btnEnviar, !texto.trim() && styles.btnEnviarDisabled]}
              onPress={() => enviar()}
              disabled={!texto.trim()}
            >
              <Ionicons name="send" size={18} color="#FFF" />
            </TouchableOpacity>
          )}
        </View>
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

  headerNome: {
    flex: 1,
    fontFamily: 'Homenaje_400Regular',
    fontSize: 20,
    color: '#111',
  },

  btnFinalizar: {
    backgroundColor: BLUE,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },

  btnFinalizarTexto: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 13,
    color: '#FFF',
  },

  listaPadding: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },

  bolha: {
    maxWidth: '70%',
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
    fontSize: 15,
    color: '#222',
    fontFamily: 'Homenaje_400Regular',
  },

  bolhaTextoMinha: {
    color: '#FFF',
  },

  sugestoesRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },

  sugestao: {
    backgroundColor: '#EEE',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#CCC',
  },

  sugestaoTexto: {
    fontSize: 14,
    color: '#444',
    fontFamily: 'Homenaje_400Regular',
  },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 4,
    gap: 8,
  },

  input: {
    flex: 1,
    height: 46,
    backgroundColor: '#EEE',
    borderRadius: 23,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#333',
    borderWidth: 1,
    borderColor: '#CCC',
    fontFamily: 'Homenaje_400Regular',
  },

  btnIcone: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#EEE',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BLUE,
  },

  btnIconeAtivo: {
    backgroundColor: BLUE,
    borderColor: BLUE,
  },

  btnEnviar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: BLUE,
    justifyContent: 'center',
    alignItems: 'center',
  },

  btnEnviarDisabled: {
    backgroundColor: '#9BA7B1',
  },
});