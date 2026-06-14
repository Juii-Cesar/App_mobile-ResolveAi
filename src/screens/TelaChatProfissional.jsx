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
  Modal,
  ActivityIndicator
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../services/supabase';
import { useServico } from '../context/ServicoContext';

const BLUE = '#076BDE';
const SUGESTOES = ['Olá, estou a caminho!', 'Cheguei no local.', 'Precisa de material?'];

export default function TelaChatProfissional({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const clienteNome = route?.params?.profissionalNome ?? 'Cliente'; 
  const servicoId = route?.params?.dadosServico?.id;
  const taxaApp = route?.params?.dadosServico?.taxa || 10;
  const { cancelarServico } = useServico();
  const [mensagens, setMensagens] = useState([]);
  const [texto, setTexto] = useState('');
  const [userId, setUserId] = useState(null);
  const [chatId, setChatId] = useState(null);
  const [anotacao, setAnotacao] = useState('');
  const [modoAnotacao, setModoAnotacao] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const flatRef = useRef(null);
  const [modalAlerta, setModalAlerta] = useState(null);
  const [modalFinalizar, setModalFinalizar] = useState(false);
  const [valorMaoDeObra, setValorMaoDeObra] = useState('');
  const [salvandoCobranca, setSalvandoCobranca] = useState(false);
  const valorNumerico = parseFloat(valorMaoDeObra.replace(',', '.')) || 0;
  const valorTotalFinal = valorNumerico + taxaApp;

  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', e => setKeyboardHeight(e.endCoordinates.height));
    const hide = Keyboard.addListener('keyboardDidHide', () => setKeyboardHeight(0));
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

    const { error } = await supabase.from('chat_mensagens').insert({
      chat_id: chatId,
      remetente_id: userId,
      mensagem: novaMensagem,
      visualizada: false
    });

    if (error) {
      setModalAlerta({ titulo: 'Erro no envio', mensagem: 'Sua mensagem não foi enviada. Verifique a conexão.', tipo: 'erro' });
    }
  }

  function handleAbrirFinalizacao() {
    setModalFinalizar(true);
  }

  async function handleConfirmarCobranca() {
    if (valorNumerico <= 0) {
      setModalAlerta({ titulo: 'Valor Inválido', mensagem: 'Por favor, insira um valor válido para a sua mão de obra.', tipo: 'aviso' });
      return;
    }

    setSalvandoCobranca(true);

    try {
      const { error } = await supabase.from('servicos')
        .update({ 
          status: 'concluido', 
          valor: valorTotalFinal 
        })
        .eq('id', servicoId);

      if (error) throw error;

      setModalFinalizar(false);

      cancelarServico();

      setModalAlerta({
        titulo: 'Serviço Finalizado!',
        mensagem: `A cobrança de R$ ${valorTotalFinal.toFixed(2).replace('.', ',')} foi gerada com sucesso e o serviço foi concluído.`,
        tipo: 'sucesso',
        onConfirm: () => navigation.navigate('TelaPrincipalProfissional')
      });

    } catch (error) {
      setModalAlerta({ titulo: 'Erro', mensagem: 'Não foi possível finalizar a cobrança. Tente novamente.', tipo: 'erro' });
    } finally {
      setSalvandoCobranca(false);
    }
  }

  function handleFecharAlerta() {
    const acaoConfirmar = modalAlerta?.onConfirm;
    setModalAlerta(null);
    if (acaoConfirmar) {
      acaoConfirmar();
    }
  }

  const getAlertaIcon = () => {
    if (modalAlerta?.tipo === 'sucesso') return { name: 'checkmark-circle', color: '#388E3C' };
    if (modalAlerta?.tipo === 'aviso') return { name: 'warning', color: '#F5A623' };
    return { name: 'alert-circle', color: '#D32F2F' };
  };

  function renderMensagem({ item }) {
    return (
      <View style={[styles.bolha, item.minha ? styles.bolhaMinha : styles.bolhaDele]}>
        <Text style={[styles.bolhaTexto, item.minha && styles.bolhaTextoMinha]}>{item.texto}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      <Modal animationType="fade" transparent={true} visible={!!modalAlerta} onRequestClose={handleFecharAlerta}>
        <View style={styles.modalFundoOverlay}>
          <View style={styles.modalCard}>
            <Ionicons name={getAlertaIcon().name} size={80} color={getAlertaIcon().color} style={{ marginBottom: 10 }} />
            <Text style={[styles.modalTitle, { color: getAlertaIcon().color }]}>{modalAlerta?.titulo}</Text>
            <Text style={styles.modalText}>{modalAlerta?.mensagem}</Text>
            
            <TouchableOpacity style={[styles.modalBtnEntendi, { backgroundColor: getAlertaIcon().color }]} onPress={handleFecharAlerta} activeOpacity={0.8}>
              <Text style={styles.modalBtnEntendiText}>Entendi</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal animationType="slide" transparent={true} visible={modalFinalizar} onRequestClose={() => setModalFinalizar(false)}>
        <View style={styles.modalFundoOverlay}>
          <View style={[styles.modalCard, { width: '90%', padding: 25 }]}>
            <Ionicons name="receipt-outline" size={60} color={BLUE} style={{ marginBottom: 10 }} />
            <Text style={[styles.modalTitle, { color: BLUE, fontSize: 32 }]}>Gerar Cobrança</Text>
            <Text style={styles.modalSubTexto}>Insira o valor da sua mão de obra e veja o total a cobrar do cliente.</Text>
            
            <View style={styles.inputValorContainer}>
              <Text style={styles.moedaTexto}>R$</Text>
              <TextInput 
                style={styles.inputValor} 
                keyboardType="numeric" 
                placeholder="0,00" 
                placeholderTextColor="#A0A8B0" 
                value={valorMaoDeObra} 
                onChangeText={setValorMaoDeObra} 
              />
            </View>

            <View style={styles.resumoContainer}>
              <View style={styles.resumoLinha}>
                <Text style={styles.resumoTexto}>Sua mão de obra:</Text>
                <Text style={styles.resumoValor}>R$ {valorNumerico.toFixed(2).replace('.', ',')}</Text>
              </View>
              <View style={styles.resumoLinha}>
                <Text style={styles.resumoTexto}>Taxa do Aplicativo:</Text>
                <Text style={[styles.resumoValor, { color: '#D32F2F' }]}>+ R$ {taxaApp.toFixed(2).replace('.', ',')}</Text>
              </View>
              <View style={styles.linhaDivisoria} />
              <View style={styles.resumoLinha}>
                <Text style={styles.resumoTextoTotal}>Total a Cobrar:</Text>
                <Text style={styles.resumoValorTotal}>R$ {valorTotalFinal.toFixed(2).replace('.', ',')}</Text>
              </View>
            </View>

            <View style={styles.botoesModalRow}>
              <TouchableOpacity style={styles.btnCancelarModal} onPress={() => setModalFinalizar(false)} activeOpacity={0.8} disabled={salvandoCobranca}>
                <Text style={styles.btnCancelarModalTexto}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.btnConfirmarModal} onPress={handleConfirmarCobranca} activeOpacity={0.8} disabled={salvandoCobranca}>
                {salvandoCobranca ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <Text style={styles.btnConfirmarModalTexto}>Confirmar</Text>
                )}
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>

      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.btnVoltar}>
          <Ionicons name="arrow-back" size={26} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerNome}>{clienteNome}</Text>
        
        <TouchableOpacity style={styles.btnFinalizar} onPress={handleAbrirFinalizacao} activeOpacity={0.8}>
          <Text style={styles.btnFinalizarTexto}>Finalizar serviço</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1, marginBottom: keyboardHeight }}>
        <FlatList ref={flatRef} data={mensagens} keyExtractor={item => item.id} renderItem={renderMensagem} contentContainerStyle={styles.listaPadding} showsVerticalScrollIndicator={false} />
        
        <View style={styles.sugestoesRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
            {SUGESTOES.map((s, i) => (
              <TouchableOpacity key={i} style={styles.sugestao} onPress={() => enviar(s)}><Text style={styles.sugestaoTexto}>{s}</Text></TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={[styles.inputRow, { paddingBottom: insets.bottom + 10 }]}>
          <TextInput style={styles.input} placeholder={modoAnotacao ? 'Anotações internas...' : 'Mensagem...'} placeholderTextColor="#AAA" value={modoAnotacao ? anotacao : texto} onChangeText={modoAnotacao ? setAnotacao : setTexto} onSubmitEditing={modoAnotacao ? undefined : () => enviar()} returnKeyType={modoAnotacao ? 'done' : 'send'} multiline={modoAnotacao} />
          
          <TouchableOpacity style={[styles.btnIcone, modoAnotacao && styles.btnIconeAtivo]} onPress={() => setModoAnotacao(!modoAnotacao)}>
            <Ionicons name={modoAnotacao ? 'chatbubble-outline' : 'document-text-outline'} size={26} color={modoAnotacao ? '#FFF' : '#333'} />
          </TouchableOpacity>
          
          {!modoAnotacao && (
            <TouchableOpacity style={[styles.btnEnviar, !texto.trim() && styles.btnEnviarDisabled]} onPress={() => enviar()} disabled={!texto.trim()}>
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
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 15, backgroundColor: '#D9D9D9', borderBottomWidth: 1.5, borderBottomColor: '#A0A8B0', gap: 15 },
  btnVoltar: { width: 46, height: 46, borderRadius: 23, backgroundColor: BLUE, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: '#333' },
  headerNome: { flex: 1, fontFamily: 'Homenaje_400Regular', fontSize: 28, color: '#111' },
  btnFinalizar: { backgroundColor: '#388E3C', borderRadius: 16, paddingHorizontal: 15, paddingVertical: 10, borderWidth: 1.5, borderColor: '#333', elevation: 3 },
  btnFinalizarTexto: { fontFamily: 'Homenaje_400Regular', fontSize: 20, color: '#FFF' },
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
  modalFundoOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.6)', justifyContent: 'center', alignItems: 'center' },
  modalCard: { backgroundColor: '#EAEAEA', width: '85%', borderRadius: 30, padding: 30, alignItems: 'center', elevation: 10, borderWidth: 1.5, borderColor: '#000' },
  modalTitle: { fontFamily: 'Homenaje_400Regular', fontSize: 36, textAlign: 'center', marginBottom: 5 },
  modalText: { fontFamily: 'Homenaje_400Regular', fontSize: 22, color: '#000', textAlign: 'center', marginBottom: 25, lineHeight: 24 },
  modalSubTexto: { fontFamily: 'Homenaje_400Regular', fontSize: 18, color: '#555', textAlign: 'center', marginBottom: 20 },
  modalBtnEntendi: { width: '100%', height: 55, borderRadius: 28, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: '#000' },
  modalBtnEntendiText: { fontFamily: 'Homenaje_400Regular', fontSize: 26, color: '#FFF' },
  inputValorContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', width: '100%', height: 65, borderRadius: 15, borderWidth: 1.5, borderColor: '#000', paddingHorizontal: 20, marginBottom: 20 },
  moedaTexto: { fontFamily: 'Homenaje_400Regular', fontSize: 30, color: '#555', marginRight: 10 },
  inputValor: { flex: 1, fontFamily: 'Homenaje_400Regular', fontSize: 36, color: '#000' },
  resumoContainer: { width: '100%', backgroundColor: '#D1D7DC', borderRadius: 15, padding: 15, marginBottom: 25, borderWidth: 1, borderColor: '#A0A8B0' },
  resumoLinha: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  resumoTexto: { fontFamily: 'Homenaje_400Regular', fontSize: 20, color: '#444' },
  resumoValor: { fontFamily: 'Homenaje_400Regular', fontSize: 20, color: '#000' },
  linhaDivisoria: { width: '100%', height: 1, backgroundColor: '#A0A8B0', marginVertical: 10 },
  resumoTextoTotal: { fontFamily: 'Homenaje_400Regular', fontSize: 24, color: '#000' },
  resumoValorTotal: { fontFamily: 'Homenaje_400Regular', fontSize: 24, color: '#388E3C' },
  botoesModalRow: { flexDirection: 'row', gap: 15, width: '100%' },
  btnCancelarModal: { flex: 1, height: 55, backgroundColor: '#D9D9D9', borderRadius: 28, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: '#000' },
  btnCancelarModalTexto: { fontFamily: 'Homenaje_400Regular', fontSize: 24, color: '#444' },
  btnConfirmarModal: { flex: 1, height: 55, backgroundColor: '#388E3C', borderRadius: 28, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: '#000' },
  btnConfirmarModalTexto: { fontFamily: 'Homenaje_400Regular', fontSize: 24, color: '#FFF' },
});