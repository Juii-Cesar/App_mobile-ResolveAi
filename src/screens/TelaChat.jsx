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
  Modal
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
  const { iniciarServico, finalizarServico } = useServico();
  const [mensagens, setMensagens] = useState([]);
  const [texto, setTexto] = useState('');
  const [chatId, setChatId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [servicoFinalizado, setServicoFinalizado] = useState(null); 
  
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
    let channelChat;
    let channelServico;

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

      channelChat = supabase.channel(`chat_${idDaSala}`)
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

      channelServico = supabase.channel(`status_servico_${sId}`)
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'servicos', filter: `id=eq.${sId}` }, 
          payload => {
            console.log('STATUS DO SERVIÇO MUDOU:', payload.new.status);
            if (payload.new.status === 'finalizado') {
              const valorFormatado = payload.new.valor ? Number(payload.new.valor).toFixed(2).replace('.', ',') : '0,00';
              setServicoFinalizado({ valor: valorFormatado });
            }
          }
        ).subscribe();
    }

    iniciarChat();

    return () => { 
      if (channelChat) supabase.removeChannel(channelChat); 
      if (channelServico) supabase.removeChannel(channelServico);
    };
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

      <Modal visible={!!servicoFinalizado} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Ionicons name="checkmark-circle" size={80} color="#388E3C" />
            <Text style={styles.modalTitle}>Serviço Finalizado!</Text>
            <Text style={styles.modalText}>O profissional encerrou o atendimento.</Text>
            
            <Text style={styles.modalValor}>R$ {servicoFinalizado?.valor}</Text>
            
            <TouchableOpacity 
              style={styles.btnPagar} 
              onPress={() => {
                finalizarServico();
                Alert.alert('Pagamento', 'Função em desenvolvimento.', [
                  { text: 'OK', onPress: () => navigation.popToTop() }
                ]);
              }}
            >
              <Text style={styles.btnPagarTexto}>Ir para Pagamento</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 25 },
  modalCard: { backgroundColor: '#FFF', borderRadius: 25, padding: 30, width: '100%', alignItems: 'center', elevation: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.3, shadowRadius: 10 },
  modalTitle: { fontFamily: 'Homenaje_400Regular', fontSize: 36, color: '#111', marginTop: 15 },
  modalText: { fontFamily: 'Homenaje_400Regular', fontSize: 20, color: '#555', textAlign: 'center', marginTop: 5 },
  modalValor: { fontFamily: 'Homenaje_400Regular', fontSize: 46, color: '#388E3C', marginVertical: 25 },
  btnPagar: { backgroundColor: BLUE, width: '100%', paddingVertical: 16, borderRadius: 15, alignItems: 'center', borderWidth: 1.5, borderColor: '#333' },
  btnPagarTexto: { fontFamily: 'Homenaje_400Regular', fontSize: 24, color: '#FFF' },
  header: { height: 60, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, backgroundColor: '#D9D9D9', borderBottomWidth: 1, borderBottomColor: '#9BA7B1', gap: 12 },
  btnVoltar: { width: 38, height: 38, borderRadius: 19, backgroundColor: BLUE, justifyContent: 'center', alignItems: 'center' },
  headerNomeArea: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 5 },
  headerNome: { fontFamily: 'Homenaje_400Regular', fontSize: 20, color: '#111' },

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