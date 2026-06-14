import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Platform,
  Keyboard,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../services/supabase';

const BLUE = '#076BDE';

const SUGESTOES = ['Olá', 'Está vindo ?'];

export default function TelaChatProfissional({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const clienteNome = route?.params?.profissionalNome ?? 'Cliente'; 
  const servicoId = route?.params?.dadosServico?.id;

  const [mensagens, setMensagens] = useState([]);
  const [texto, setTexto] = useState('');
  const [userId, setUserId] = useState(null);
  const [chatId, setChatId] = useState(null);
  
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
    let channel;
    async function carregarChat() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !servicoId) return;
      setUserId(user.id);

      let { data: salaChat } = await supabase.from('chats').select('id').eq('servico_id', servicoId).maybeSingle();

      if (!salaChat) {
        const { data: servDados } = await supabase.from('servicos').select('idcliente, idprofissional').eq('id', servicoId).single();
        if (servDados) {
          const { data: novaSala, error } = await supabase.from('chats').insert({
            servico_id: servicoId,
            cliente_id: servDados.idcliente,
            profissional_id: servDados.idprofissional
          }).select('id').maybeSingle();
          
          if (error) {
            const { data: tentaDeNovo } = await supabase.from('chats').select('id').eq('servico_id', servicoId).single();
            salaChat = tentaDeNovo;
          } else {
            salaChat = novaSala;
          }
        }
      }

      const idDaSala = salaChat?.id;
      if (!idDaSala) return;
      
      setChatId(idDaSala);

      const { data: antigas } = await supabase
        .from('chat_mensagens')
        .select('*')
        .eq('chat_id', idDaSala)
        .order('created_at', { ascending: true });

      if (antigas) {
        setMensagens(antigas.map(m => ({
          id: m.id.toString(),
          texto: m.mensagem,
          minha: m.remetente_id === user.id
        })));
      }

      channel = supabase.channel(`chat_${idDaSala}`)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_mensagens', filter: `chat_id=eq.${idDaSala}` }, 
          payload => {
            const novaMsg = payload.new;
            if (novaMsg.remetente_id !== user.id) {
              setMensagens(prev => [...prev, {
                id: novaMsg.id.toString(),
                texto: novaMsg.mensagem,
                minha: false
              }]);
            }
          }
        ).subscribe();
    }

    carregarChat();

    return () => { if (channel) supabase.removeChannel(channel); };
  }, [servicoId]);

  useEffect(() => {
    setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 100);
  }, [mensagens]);

  async function enviar(msg) {
    const novaMensagem = msg ?? texto.trim();
    if (!novaMensagem || !userId || !chatId) return;

    const tempId = Date.now().toString();
    setMensagens(prev => [...prev, { id: tempId, texto: novaMensagem, minha: true }]);
    setTexto('');

    await supabase.from('chat_mensagens').insert({
      chat_id: chatId,
      remetente_id: userId,
      mensagem: novaMensagem
    });
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
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.btnVoltar}>
          <Ionicons name="arrow-back" size={26} color="#FFF" />
        </TouchableOpacity>

        <Text style={styles.headerNome}>{clienteNome}</Text>

        <TouchableOpacity style={styles.btnFinalizar} onPress={handleFinalizar}>
          <Text style={styles.btnFinalizarTexto}>Finalizar serviço</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1, marginBottom: keyboardHeight }}>
        <FlatList
          ref={flatRef}
          data={mensagens}
          keyExtractor={item => item.id}
          renderItem={renderMensagem}
          contentContainerStyle={styles.listaPadding}
          showsVerticalScrollIndicator={false}
        />

        <View style={styles.sugestoesRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
            {SUGESTOES.map((s, i) => (
              <TouchableOpacity key={i} style={styles.sugestao} onPress={() => enviar(s)}>
                <Text style={styles.sugestaoTexto}>{s}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={[styles.inputRow, { paddingBottom: insets.bottom + 10 }]}>
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

          <TouchableOpacity
            style={[styles.btnIcone, modoAnotacao && styles.btnIconeAtivo]}
            onPress={() => setModoAnotacao(!modoAnotacao)}
          >
            <Ionicons
              name={modoAnotacao ? 'chatbubble-outline' : 'document-text-outline'}
              size={26}
              color={modoAnotacao ? '#FFF' : '#333'}
            />
          </TouchableOpacity>

          {!modoAnotacao && (
            <TouchableOpacity
              style={[styles.btnEnviar, !texto.trim() && styles.btnEnviarDisabled]}
              onPress={() => enviar()}
              disabled={!texto.trim()}
            >
              <Ionicons name="send" size={24} color="#FFF" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#D9D9D9' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 15, backgroundColor: '#D9D9D9', borderBottomWidth: 1, borderBottomColor: '#9BA7B1', gap: 15 },
  btnVoltar: { width: 46, height: 46, borderRadius: 23, backgroundColor: BLUE, justifyContent: 'center', alignItems: 'center' },
  headerNome: { flex: 1, fontFamily: 'Homenaje_400Regular', fontSize: 26, color: '#111' },
  btnFinalizar: { backgroundColor: BLUE, borderRadius: 16, paddingHorizontal: 18, paddingVertical: 10, borderWidth: 1.5, borderColor: '#333' },
  btnFinalizarTexto: { fontFamily: 'Homenaje_400Regular', fontSize: 18, color: '#FFF' },
  listaPadding: { paddingHorizontal: 16, paddingVertical: 15, gap: 12 },
  bolha: { maxWidth: '75%', paddingHorizontal: 18, paddingVertical: 14, borderRadius: 18, marginVertical: 5 },
  bolhaMinha: { alignSelf: 'flex-end', backgroundColor: BLUE, borderBottomRightRadius: 4, borderWidth: 1.5, borderColor: '#333' },
  bolhaDele: { alignSelf: 'flex-start', backgroundColor: '#FFF', borderBottomLeftRadius: 4, borderWidth: 1.5, borderColor: '#A0A8B0' },
  bolhaTexto: { fontSize: 20, color: '#222', fontFamily: 'Homenaje_400Regular' },
  bolhaTextoMinha: { color: '#FFF' },
  sugestoesRow: { paddingHorizontal: 16, paddingVertical: 12 },
  sugestao: { backgroundColor: '#FFF', borderRadius: 20, paddingHorizontal: 20, paddingVertical: 12, borderWidth: 1.5, borderColor: '#A0A8B0' },
  sugestaoTexto: { fontSize: 18, color: '#444', fontFamily: 'Homenaje_400Regular' },
  inputRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 8, gap: 12 },
  input: { flex: 1, height: 54, backgroundColor: '#FFF', borderRadius: 27, paddingHorizontal: 20, fontSize: 20, color: '#333', borderWidth: 1.5, borderColor: '#A0A8B0', fontFamily: 'Homenaje_400Regular' },
  btnIcone: { width: 54, height: 54, borderRadius: 27, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: '#333' },
  btnIconeAtivo: { backgroundColor: BLUE },
  btnEnviar: { width: 54, height: 54, borderRadius: 27, backgroundColor: BLUE, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: '#333' },
  btnEnviarDisabled: { backgroundColor: '#9BA7B1', borderColor: '#555' },
});