import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../services/supabase';

const BLUE_COLOR = '#076BDE';
const CARD_BG = '#EAEAEA';

export default function TelaAtividades({ navigation }) {
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [modalLimite, setModalLimite] = useState(false);

  useEffect(() => {
    carregarAtividades();
  }, []);

  async function carregarAtividades() {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error("Usuário não autenticado");

      const { data, error } = await supabase
        .from('avaliacoes')
        .select(`
          id,
          nota,
          comentario,
          criadoem,
          fixado,
          cliente:usuarios!idcliente (nome),
          servico:servicos!idservico (descricao)
        `)
        .eq('idprofissional', user.id)
        .order('criadoem', { ascending: false });

      if (error) throw error;
      
      setAvaliacoes(data || []);

    } catch (error) {
      console.error("Erro ao carregar avaliações:", error.message);
    } finally {
      setCarregando(false);
    }
  }

  async function toggleFixar(idAvaliacao, estadoAtual) {
    if (!estadoAtual) {
      const fixadosAtuais = avaliacoes.filter(av => av.fixado).length;
      if (fixadosAtuais >= 2) {
        setModalLimite(true);
        return; 
      }
    }

    try {
      const { data, error } = await supabase
        .from('avaliacoes')
        .update({ fixado: !estadoAtual })
        .eq('id', idAvaliacao)
        .select();

      if (error) throw error;
      
      if (!data || data.length === 0) {
        throw new Error("Atualização bloqueada. Peça ao Júlio para rodar o comando SQL de UPDATE nas avaliações!");
      }

      setAvaliacoes(prev => prev.map(av => 
        av.id === idAvaliacao ? { ...av, fixado: !estadoAtual } : av
      ));

    } catch (error) {
      Alert.alert("Erro de Permissão", error.message || "Não foi possível fixar.");
      console.error(error);
    }
  }

  const formatarData = (dataIso) => {
    if (!dataIso) return '--/--/----';
    const data = new Date(dataIso);
    return data.toLocaleDateString('pt-BR');
  };

  const renderizarEstrelas = (nota) => {
    return (
      <View style={styles.starsContainer}>
        {[...Array(5)].map((_, index) => (
          <Ionicons 
            key={index} 
            name={index < nota ? "star" : "star-outline"} 
            size={22} 
            color={index < nota ? "#F5A623" : "#A0A8B0"} 
          />
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Modal animationType="fade" transparent={true} visible={modalLimite} onRequestClose={() => setModalLimite(false)}>
        <View style={styles.modalFundoOverlay}>
          <View style={styles.modalCard}>
            <Ionicons name="alert-circle" size={80} color="#F5A623" style={{ marginBottom: 10 }} />
            <Text style={styles.modalTitle}>Limite Atingido!</Text>
            <Text style={styles.modalText}>Você já possui 2 avaliações fixadas no seu perfil.</Text>
            <Text style={styles.modalSubText}>Desmarque um comentário atual para poder fixar este novo.</Text>
            
            <TouchableOpacity style={styles.modalBtnEntendi} onPress={() => setModalLimite(false)} activeOpacity={0.8}>
              <Text style={styles.modalBtnEntendiText}>Entendi</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.btnVoltarRedondo} onPress={() => navigation.goBack()} activeOpacity={0.8}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Atividades</Text>
      </View>

      {carregando ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={BLUE_COLOR} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {avaliacoes.length > 0 ? (
            avaliacoes.map((item) => (
              <View key={item.id} style={styles.cardAvaliacao}>
                
                <View style={styles.cardHeader}>
                  <View style={styles.infoEsquerda}>
                    <View style={styles.avatarCliente}>
                      <Ionicons name="person-outline" size={32} color="#555" />
                    </View>
                    <View style={styles.textosInfo}>
                      <Text style={styles.nomeCliente} numberOfLines={1}>{item.cliente?.nome || 'Cliente'}</Text>
                      <Text style={styles.nomeServico} numberOfLines={1}>{item.servico?.descricao || 'Serviço Padrão'}</Text>
                    </View>
                  </View>

                  <View style={styles.infoDireita}>
                    <Text style={styles.dataServico}>{formatarData(item.criadoem)}</Text>
                    {renderizarEstrelas(item.nota || 0)}
                  </View>
                </View>

                <View style={styles.boxComentario}>
                  <Text style={styles.textoComentario}>
                    {item.comentario || 'Nenhum comentário deixado pelo cliente.'}
                  </Text>

                  <TouchableOpacity 
                    style={styles.iconePin} 
                    onPress={() => toggleFixar(item.id, item.fixado)}
                    hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }} 
                    activeOpacity={0.6}
                  >
                    <Ionicons 
                      name={item.fixado ? "pin" : "pin-outline"} 
                      size={26} 
                      color={item.fixado ? BLUE_COLOR : "#7A8A9E"} 
                    />
                  </TouchableOpacity>
                </View>

              </View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="chatbubbles-outline" size={60} color="#A0A8B0" />
              <Text style={styles.mensagemVazia}>Você ainda não possui avaliações.</Text>
            </View>
          )}

        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  headerRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 25, paddingTop: 15, gap: 15 },
  btnVoltarRedondo: { backgroundColor: BLUE_COLOR, width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontFamily: 'Homenaje_400Regular', fontSize: 36, color: '#000' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingHorizontal: 25, paddingTop: 20, gap: 20, paddingBottom: 40 },
  cardAvaliacao: { backgroundColor: CARD_BG, borderRadius: 20, borderWidth: 1.5, borderColor: '#D3D3D3', padding: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  infoEsquerda: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 10 },
  avatarCliente: { width: 50, height: 50, borderRadius: 25, borderWidth: 1.5, borderColor: '#000', justifyContent: 'center', alignItems: 'center', backgroundColor: '#D1D7DC' },
  textosInfo: { marginLeft: 12, justifyContent: 'center', flex: 1 },
  nomeCliente: { fontFamily: 'Homenaje_400Regular', fontSize: 24, color: '#000', lineHeight: 26 },
  nomeServico: { fontFamily: 'Homenaje_400Regular', fontSize: 18, color: '#555' },
  infoDireita: { alignItems: 'flex-end' },
  dataServico: { fontFamily: 'Homenaje_400Regular', fontSize: 16, color: '#7A8A9E', marginBottom: 2 },
  starsContainer: { flexDirection: 'row', gap: 2 },
  boxComentario: { backgroundColor: '#D1D7DC', borderRadius: 15, padding: 14, minHeight: 65, position: 'relative' },
  textoComentario: { fontFamily: 'Homenaje_400Regular', fontSize: 18, color: '#444', paddingRight: 40 },
  iconePin: { position: 'absolute', top: 10, right: 10, transform: [{ rotate: '45deg' }] },
  emptyContainer: { marginTop: 80, alignItems: "center", gap: 10 },
  mensagemVazia: { fontFamily: 'Homenaje_400Regular', fontSize: 20, color: '#7A8A9E', textAlign: 'center' },
  modalFundoOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.6)', justifyContent: 'center', alignItems: 'center' },
  modalCard: { backgroundColor: '#EAEAEA', width: '85%', borderRadius: 30, padding: 30, alignItems: 'center', elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5 },
  modalTitle: { fontFamily: 'Homenaje_400Regular', fontSize: 36, color: '#F5A623', textAlign: 'center', marginBottom: 5 },
  modalText: { fontFamily: 'Homenaje_400Regular', fontSize: 22, color: '#000', textAlign: 'center', marginBottom: 15, lineHeight: 24 },
  modalSubText: { fontFamily: 'Homenaje_400Regular', fontSize: 18, color: '#666', textAlign: 'center', marginBottom: 25 },
  modalBtnEntendi: { backgroundColor: '#F5A623', width: '100%', height: 55, borderRadius: 28, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: '#000' },
  modalBtnEntendiText: { fontFamily: 'Homenaje_400Regular', fontSize: 26, color: '#FFF' },
});