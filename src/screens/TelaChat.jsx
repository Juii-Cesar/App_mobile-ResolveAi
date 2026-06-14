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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useServico } from '../context/ServicoContext';
import { supabase } from '../services/supabase';

const BLUE = '#076BDE';

const SUGESTOES = ['Olá', 'Está vindo ?'];

export default function TelaChat({ navigation, route }) {
  const profissionalNome = route?.params?.profissionalNome ?? 'Profissional';
  const profissionalId   = route?.params?.profissionalId   ?? 'default';
  const categoria        = route?.params?.categoria        ?? '';
  const descricao        = route?.params?.descricao        ?? '';

  const { iniciarServico, cancelarServico } = useServico();

  const [mensagens, setMensagens] = useState([]);
  const [texto, setTexto] = useState('');
  const [chatId, setChatId] = useState(null);
  const [userId, setUserId] = useState(null);
  const flatRef = useRef(null);

  useEffect(() => {
    iniciarServico({
      profissionalNome,
      profissionalId,
      categoria,
      descricao,
      routeParams: route?.params ?? {},
    });
  }, []);

  useEffect(() => {
    let channel;
    async function iniciarChat() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      const { data: servicoAtivo } = await supabase
        .from('servicos')
        .select('id, idcliente, idprofissional')
        .eq('idcliente', user.id)
        .eq('status', 'servicoAceito')
        .order('criadoem', { ascending: false })
        .limit(1)
        .single();

      const sId = servicoAtivo?.id;
      if (!sId) return;

      let { data: salaChat } = await supabase.from('chats').select('id').eq('servico_id', sId).maybeSingle();

      if (!salaChat) {
        const { data: novaSala, error } = await supabase.from('chats').insert({
          servico_id: sId,
          cliente_id: servicoAtivo.idcliente,
          profissional_id: servicoAtivo.idprofissional
        }).select('id').maybeSingle();
        
        if (error) {
          const { data: tentaDeNovo } = await supabase.from('chats').select('id').eq('servico_id', sId).single();
          salaChat = tentaDeNovo;
        } else {
          salaChat = novaSala;
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

    iniciarChat();

    return () => { if (channel) supabase.removeChannel(channel); };
  }, []);

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

  function handleEncerrar() {
    Alert.alert(
      'Encerrar serviço',
      'Deseja realmente cancelar o serviço em andamento?',
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

        <TouchableOpacity
          style={styles.headerNomeArea}
          onPress={() =>
            navigation.navigate('TelaPerfilProfissional', {
              profissionalId,
              profissionalNome,
            })
          }
        >
          <Text style={styles.headerNome}>{profissionalNome}</Text>
          <Ionicons name="information-circle-outline" size={16} color="#555" />
        </TouchableOpacity>

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
          {SUGESTOES.map((s, i) => (
            <TouchableOpacity key={i} style={styles.sugestao} onPress={() => enviar(s)}>
              <Text style={styles.sugestaoTexto}>{s}</Text>
            </TouchableOpacity>
          ))}
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
  container: { flex: 1, backgroundColor: '#D9D9D9' },
  header: { height: 60, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, backgroundColor: '#D9D9D9', borderBottomWidth: 1, borderBottomColor: '#9BA7B1', gap: 12 },
  btnVoltar: { width: 38, height: 38, borderRadius: 19, backgroundColor: BLUE, justifyContent: 'center', alignItems: 'center' },
  headerNomeArea: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 5 },
  headerNome: { fontFamily: 'Homenaje_400Regular', fontSize: 20, color: '#111' },
  btnEncerrar: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, borderWidth: 1.5, borderColor: '#D32F2F' },
  btnEncerrarTexto: { fontFamily: 'Homenaje_400Regular', fontSize: 14, color: '#D32F2F' },
  listaPadding: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  bolha: { maxWidth: '70%', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 16, marginVertical: 4 },
  bolhaMinha: { alignSelf: 'flex-end', backgroundColor: BLUE, borderBottomRightRadius: 4 },
  bolhaDele: { alignSelf: 'flex-start', backgroundColor: '#EEE', borderBottomLeftRadius: 4 },
  bolhaTexto: { fontSize: 15, color: '#222', fontFamily: 'Homenaje_400Regular' },
  bolhaTextoMinha: { color: '#FFF' },
  sugestoesRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingVertical: 8 },
  sugestao: { backgroundColor: '#EEE', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1, borderColor: '#CCC' },
  sugestaoTexto: { fontSize: 14, color: '#444', fontFamily: 'Homenaje_400Regular' },
  inputRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 24, paddingTop: 8, gap: 10, backgroundColor: '#D9D9D9' },
  input: { flex: 1, height: 46, backgroundColor: '#EEE', borderRadius: 23, paddingHorizontal: 16, fontSize: 15, color: '#333', borderWidth: 1, borderColor: '#CCC', fontFamily: 'Homenaje_400Regular' },
  btnEnviar: { width: 46, height: 46, borderRadius: 23, backgroundColor: BLUE, justifyContent: 'center', alignItems: 'center' },
  btnEnviarDisabled: { backgroundColor: '#9BA7B1' },
});