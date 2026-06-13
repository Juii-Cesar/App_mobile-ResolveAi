import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../services/supabase';

const BLUE_COLOR = '#076BDE';

export default function TelaAtividades({ navigation }) {
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);

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
    try {
      const { error } = await supabase
        .from('avaliacoes')
        .update({ fixado: !estadoAtual })
        .eq('id', idAvaliacao);

      if (error) throw error;

      setAvaliacoes(prev => prev.map(av => 
        av.id === idAvaliacao ? { ...av, fixado: !estadoAtual } : av
      ));

    } catch (error) {
      Alert.alert("Erro", "Não foi possível fixar o comentário.");
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
            color="#000" 
          />
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.btnVoltarRedondo} onPress={() => navigation.goBack()}>
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
                      <Ionicons name="person-outline" size={35} color="#000" />
                    </View>
                    <View style={styles.textosInfo}>
                      <Text style={styles.nomeCliente}>{item.cliente?.nome || 'Cliente'}</Text>
                      <Text style={styles.nomeServico}>{item.servico?.descricao || 'Serviço Padrão'}</Text>
                    </View>
                  </View>

                  <View style={styles.infoDireita}>
                    <Text style={styles.dataServico}>{formatarData(item.criadoem)}</Text>
                    {renderizarEstrelas(item.nota || 0)}
                  </View>
                </View>

                <View style={styles.boxComentario}>
                  <Text style={styles.textoComentario}>
                    {item.comentario || 'Nenhum comentário deixado.'}
                  </Text>

                  <TouchableOpacity 
                    style={styles.iconePin} 
                    onPress={() => toggleFixar(item.id, item.fixado)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons 
                      name={item.fixado ? "pin" : "pin-outline"} 
                      size={22} 
                      color={item.fixado ? BLUE_COLOR : "#7A8A9E"} 
                    />
                  </TouchableOpacity>
                </View>

              </View>
            ))
          ) : (
            <Text style={styles.mensagemVazia}>Nenhuma atividade ou avaliação encontrada.</Text>
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
  cardAvaliacao: { backgroundColor: '#F7F8F9', borderRadius: 25, borderWidth: 1.5, borderColor: '#000', padding: 15 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  infoEsquerda: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  avatarCliente: { width: 60, height: 60, borderRadius: 30, borderWidth: 1.5, borderColor: '#000', justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' },
  textosInfo: { marginLeft: 10, justifyContent: 'center' },
  nomeCliente: { fontFamily: 'Homenaje_400Regular', fontSize: 24, color: '#000', lineHeight: 26 },
  nomeServico: { fontFamily: 'Homenaje_400Regular', fontSize: 20, color: '#000', textDecorationLine: 'underline' },
  infoDireita: { alignItems: 'flex-end' },
  dataServico: { fontFamily: 'Homenaje_400Regular', fontSize: 16, color: '#000', marginBottom: 2 },
  starsContainer: { flexDirection: 'row', gap: 2 },
  boxComentario: { backgroundColor: '#D1D7DC', borderRadius: 15, padding: 12, minHeight: 60, position: 'relative' },
  textoComentario: { fontFamily: 'Homenaje_400Regular', fontSize: 18, color: '#666', paddingRight: 35 },
  iconePin: { position: 'absolute', top: 8, right: 8, transform: [{ rotate: '45deg' }] },
  mensagemVazia: { fontFamily: 'Homenaje_400Regular', fontSize: 22, color: '#7A8A9E', textAlign: 'center', marginTop: 50 }
});