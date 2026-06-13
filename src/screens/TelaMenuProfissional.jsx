import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Modal, TextInput, ActivityIndicator, Alert, Image, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { File } from 'expo-file-system';
import { decode } from 'base64-arraybuffer';
import { useFocusEffect } from '@react-navigation/native';
import Slider from '@react-native-community/slider';

import LogoIcon from '../assets/icons/LogoIcon';
import { logout } from "../services/auth";
import { supabase } from '../services/supabase';

const BLUE_COLOR = '#076BDE';
const CARD_BG = '#EAEAEA';

export default function TelaMenuProfissional({ navigation }) {

  const [espAberto, setEspAberto] = useState(false);
  const [configAberto, setConfigAberto] = useState(false);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [modalConfig, setModalConfig] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [avaliacao, setAvaliacao] = useState(5.0);
  const [qtdServicos, setQtdServicos] = useState(0);
  const [especialidades, setEspecialidades] = useState([]);
  const [comentariosFixados, setComentariosFixados] = useState([]);
  const [ganhosTotais, setGanhosTotais] = useState(0);
  const [ganhosSemanais, setGanhosSemanais] = useState(0);
  const [novaProfissao, setNovaProfissao] = useState('');
  const [tempoExperiencia, setTempoExperiencia] = useState('');
  const [certificadoUri, setCertificadoUri] = useState(null); 
  const [salvando, setSalvando] = useState(false);
  const [raio, setRaio] = useState(15);
  const [notificacoesAtivas, setNotificacoesAtivas] = useState(true);

  useFocusEffect(
    useCallback(() => {
      carregarDadosProfissional();
    }, [])
  );

  async function carregarDadosProfissional() {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error("Usuário não autenticado");

      const { data: usuarioData } = await supabase.from('usuarios').select('nome, avaliacaomedia').eq('id', user.id).single();
      if (usuarioData) {
        const primeiroNome = usuarioData.nome.split(' ')[0];
        setNomeUsuario(primeiroNome);
        if (usuarioData.avaliacaomedia) setAvaliacao(usuarioData.avaliacaomedia);
      }

      const { data: docsData } = await supabase.from('documentos_profissional').select('fotoperfilurl').eq('idprofissional', user.id).single();
      if (docsData && docsData.fotoperfilurl) setFotoPerfil(docsData.fotoperfilurl);

      const { count: countServicos } = await supabase.from('servicos').select('*', { count: 'exact', head: true }).eq('idprofissional', user.id);
      if (countServicos !== null) setQtdServicos(countServicos);

      const { data: profissoesData } = await supabase.from('profissoes_profissional').select('profissao').eq('profissional_id', user.id);
      if (profissoesData) setEspecialidades(profissoesData.map(item => item.profissao));

      const { data: fixadosData } = await supabase.from('avaliacoes').select('id, comentario, cliente:usuarios!idcliente(nome)').eq('idprofissional', user.id).eq('fixado', true).limit(2);
      if (fixadosData) setComentariosFixados(fixadosData);

      const { data: financeirosData } = await supabase.from('servicos').select('valor, criadoem').eq('idprofissional', user.id).eq('status', 'concluido'); 
      if (financeirosData) {
        let total = 0; let semanal = 0;
        const hoje = new Date(); const umaSemanaAtras = new Date(); umaSemanaAtras.setDate(hoje.getDate() - 7); 
        financeirosData.forEach(servico => {
          const valorServico = parseFloat(servico.valor) || 0;
          total += valorServico;
          const dataServico = new Date(servico.criadoem);
          if (dataServico >= umaSemanaAtras) semanal += valorServico;
        });
        setGanhosTotais(total); setGanhosSemanais(semanal);
      }
    } catch (error) { console.log("Erro ao carregar dados:", error.message); } 
    finally { setCarregando(false); }
  }

  const formatarMoeda = (valor) => valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  async function handleAnexarCertificado() {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: ['application/pdf', 'image/*'], copyToCacheDirectory: true });
      if (!result.canceled) setCertificadoUri(result.assets[0].uri);
    } catch (error) { Alert.alert('Erro', 'Não foi possível selecionar o documento.'); }
  }

  async function handleSalvarEspecialidade() {
    if (!novaProfissao.trim()) { 
      Alert.alert('Atenção', 'Preencha a profissão.'); 
      return; 
    }
    
    setSalvando(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      let certificadoPath = null;
      
      if (certificadoUri) {
        const localFile = new File(certificadoUri);
        const base64 = await localFile.base64();
        const fileExt = certificadoUri.split('.').pop() || 'pdf';
        const fileName = `${user.id}/certificados/${Date.now()}.${fileExt}`;
        const contentType = fileExt === 'pdf' ? 'application/pdf' : `image/${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage.from('documentos-sigilosos').upload(fileName, decode(base64), { contentType, upsert: true });
        if (uploadError) throw new Error("Erro no upload: " + uploadError.message);
        const { data: urlData } = supabase.storage.from('documentos-sigilosos').getPublicUrl(uploadData.path);
        certificadoPath = urlData.publicUrl; 
      }

      const nomeLimpo = novaProfissao.trim();
      let idDaProfissao = null;

      const { data: profBusca, error: erroBusca } = await supabase
        .from('profissoes')
        .select('id')
        .ilike('nome', nomeLimpo)
        .maybeSingle();

      if (erroBusca) throw erroBusca;

      if (profBusca) {
        idDaProfissao = profBusca.id;
      } else {
        const { data: profCriada, error: erroCriar } = await supabase
          .from('profissoes')
          .insert({ nome: nomeLimpo })
          .select('id')
          .single();
          
        if (erroCriar) throw erroCriar;
        idDaProfissao = profCriada.id;
      }

      const { error: insertError } = await supabase
        .from('profissoes_profissional')
        .insert({ 
          profissional_id: user.id, 
          idprofissao: idDaProfissao, 
          profissao: nomeLimpo,
          tempo_experiencia: tempoExperiencia.trim(), 
          certificado_url: certificadoPath 
        });

      if (insertError) throw insertError;

      setEspecialidades(prev => [...prev, nomeLimpo]);
      fecharModalCancelando();
      Alert.alert('Sucesso', 'Especialidade adicionada!');

    } catch (error) { 
      Alert.alert('Erro', 'Não foi possível salvar a especialidade.'); 
      console.log(error);
    } finally { 
      setSalvando(false); 
    }
  }

  function confirmarRemocao(nomeEspecialidade) {
    Alert.alert("Remover", `Deseja remover "${nomeEspecialidade}"?`, [{ text: "Cancelar", style: "cancel" }, { text: "Remover", style: "destructive", onPress: () => removerEspecialidade(nomeEspecialidade) }]);
  }

  async function removerEspecialidade(nomeEspecialidade) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from('profissoes_profissional').delete().match({ profissional_id: user.id, profissao: nomeEspecialidade });
      if (error) throw error;
      setEspecialidades(prev => prev.filter(esp => esp !== nomeEspecialidade));
    } catch (error) { Alert.alert("Erro", "Falha ao remover."); }
  }

  function fecharModalCancelando() { setNovaProfissao(''); setTempoExperiencia(''); setCertificadoUri(null); setModalVisivel(false); }
  
  const handleLogout = () => { Alert.alert("Sair", "Tem certeza?", [{text: "Cancelar", style: "cancel"}, {text: "Sair", style: "destructive", onPress: async () => await logout()}]); };

  if (carregando) return <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}><ActivityIndicator size="large" color={BLUE_COLOR} /></View>;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.btnVoltarRedondo} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Menu Profissional</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.perfilRow}>
            <View style={styles.avatarCirculo}>
              {fotoPerfil ? <Image source={{ uri: fotoPerfil }} style={styles.avatarImage} /> : <Ionicons name="person-outline" size={45} color="#000" />}
            </View>
            <View style={styles.perfilInfo}>
              <Text style={styles.nomeText}>{nomeUsuario || "Profissional"}</Text>
              <Text style={styles.bioText}>{especialidades.length > 0 ? especialidades[0] : "Prestador de Serviços"}</Text>
              <View style={styles.tagsRow}>
                <View style={styles.tagAzul}><Ionicons name="star" size={15} color="#FFF" style={{ marginRight: 4 }} /><Text style={styles.tagText}>{avaliacao.toFixed(1)}</Text></View>
                <View style={styles.tagAzul}><Text style={styles.tagText}>{qtdServicos} {qtdServicos === 1 ? 'Serviço' : 'Serviços'}</Text></View>
              </View>
            </View>
            <LogoIcon width={25} height={25} fill={BLUE_COLOR} style={styles.miniLogo} />
          </View>
        </View>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('TelaAtividades')} activeOpacity={0.7}>
          <Text style={styles.cardTitle}>Atividades</Text>
          <Text style={styles.cardSubtitle}>Comentários Fixados</Text>
          <View style={styles.comentariosRow}>
            {comentariosFixados.length > 0 ? comentariosFixados.map(item => (
                <View key={item.id} style={styles.boxComentario}><Text style={styles.autorText} numberOfLines={1}>{item.cliente?.nome}</Text><Text style={styles.comentarioCorpo} numberOfLines={2}>{item.comentario}</Text></View>
              )) : <Text style={styles.textoVazioFixados}>Nenhum comentário fixado.</Text>}
          </View>
        </TouchableOpacity>

        <View style={styles.card}>
            <View style={styles.ganhosHeaderRow}><Text style={styles.cardTitle}>Ganhos</Text><Text style={styles.valorPrincipal}>{formatarMoeda(ganhosTotais)}</Text></View>
            <Text style={styles.cardSubtitle}>Saldo semanal</Text>
            <Text style={styles.valorSemanal}>{formatarMoeda(ganhosSemanais)}</Text>
            <TouchableOpacity style={styles.btnSacar} onPress={() => Alert.alert('Sacar', 'Funcionalidade em desenvolvimento!')}><Text style={styles.btnSacarText}>Sacar</Text></TouchableOpacity>
        </View>

        <View style={styles.accordionContainer}>
            <View style={[styles.botaoLista, espAberto && styles.botaoListaExpandido]}>
                <TouchableOpacity style={styles.accordionHeader} onPress={() => setEspAberto(!espAberto)} activeOpacity={0.8}>
                    <Text style={[styles.botaoListaText, espAberto && styles.textAzul]}>Minhas Especialidades</Text>
                    <Ionicons name={espAberto ? "chevron-down" : "chevron-forward"} size={24} color={espAberto ? BLUE_COLOR : "#000"} />
                </TouchableOpacity>
                {espAberto && (
                    <View style={styles.accordionContent}>
                        {especialidades.length > 0 ? especialidades.map((esp, index) => (
                            <View key={index} style={styles.linhaEspecialidade}><Text style={styles.itemEspecialidade}>{esp}</Text><TouchableOpacity onPress={() => confirmarRemocao(esp)} style={{ padding: 5 }}><Ionicons name="trash-outline" size={22} color="#DE0707" /></TouchableOpacity></View>
                        )) : <Text style={[styles.itemEspecialidade, { fontSize: 18, color: '#999' }]}>Nenhuma cadastrada</Text>}
                        <TouchableOpacity style={styles.btnAdicionar} onPress={() => setModalVisivel(true)}><Ionicons name="add-circle-outline" size={24} color={BLUE_COLOR} /></TouchableOpacity>
                    </View>
                )}
            </View>

            <View style={[styles.botaoLista, configAberto && styles.botaoListaExpandido]}>
                <TouchableOpacity style={styles.accordionHeader} onPress={() => setConfigAberto(!configAberto)} activeOpacity={0.8}>
                    <Text style={[styles.botaoListaText, configAberto && styles.textAzul]}>Configurações</Text>
                    <Ionicons name={configAberto ? "chevron-down" : "chevron-forward"} size={24} color={configAberto ? BLUE_COLOR : "#000"} />
                </TouchableOpacity>
                {configAberto && (
                    <View style={styles.accordionContent}>
                        <TouchableOpacity style={styles.opcoesConfigItem} onPress={() => setModalConfig('raio')}><Text style={styles.itemEspecialidade}>Raio de atendimento (KM)</Text></TouchableOpacity>
                        <TouchableOpacity style={[styles.opcoesConfigItem, { borderBottomWidth: 0 }]} onPress={() => setModalConfig('notificacoes')}><Text style={styles.itemEspecialidade}>Notificações e Alertas</Text></TouchableOpacity>
                        <TouchableOpacity style={[styles.opcoesConfigItem, { borderBottomWidth: 0, marginTop: 10 }]} onPress={handleLogout}><Text style={[styles.itemEspecialidade, { color: '#DE0707' }]}>Sair da conta</Text></TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
      </ScrollView>

      <Modal animationType="fade" transparent={true} visible={modalVisivel} onRequestClose={fecharModalCancelando}>
        <TouchableOpacity style={styles.modalFundoOverlay} activeOpacity={1} onPress={fecharModalCancelando}>
          <View style={styles.modalCard} onStartShouldSetResponder={() => true}>
            <Text style={styles.modalTitle}>Adicionando Especialidades</Text>
            
            <TextInput 
              style={styles.modalInput} 
              placeholder="Profissão" 
              placeholderTextColor="#7A8A9E" 
              value={novaProfissao} 
              onChangeText={setNovaProfissao} 
            />
            
            <TextInput 
              style={styles.modalInput} 
              placeholder="Tempo de experiência" 
              placeholderTextColor="#7A8A9E" 
              value={tempoExperiencia} 
              onChangeText={setTempoExperiencia} 
              keyboardType="numeric" 
            />
            
            <TouchableOpacity onPress={handleAnexarCertificado}>
              <Text style={[styles.linkAnexar, certificadoUri && { color: '#388E3C', textDecorationLine: 'none' }]}>
                {certificadoUri ? 'Certificado anexado (Trocar)' : 'Anexar certificado'}
              </Text>
            </TouchableOpacity>
            
            <View style={styles.modalBtnContainer}>
              {salvando ? (
                <ActivityIndicator size="large" color={BLUE_COLOR} />
              ) : (
                <TouchableOpacity style={styles.modalBtnSalvar} onPress={handleSalvarEspecialidade}>
                  <Text style={styles.modalBtnSalvarText}>Salvar</Text>
                </TouchableOpacity>
              )}
            </View>

          </View>
        </TouchableOpacity>
      </Modal>

      <Modal animationType="fade" transparent={true} visible={!!modalConfig} onRequestClose={() => setModalConfig(null)}>
        <TouchableOpacity style={styles.modalFundoOverlay} activeOpacity={1} onPress={() => setModalConfig(null)}>
          <View style={styles.modalCard} onStartShouldSetResponder={() => true}>
            
            {modalConfig === 'raio' && (
              <>
                <Text style={styles.modalTitle}>Raio de Atendimento</Text>
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: BLUE_COLOR, marginBottom: 10 }}>{Math.round(raio)} KM</Text>
                <Slider style={{ width: 250, height: 40 }} minimumValue={1} maximumValue={100} step={1} minimumTrackTintColor={BLUE_COLOR} thumbTintColor={BLUE_COLOR} value={raio} onValueChange={(val) => setRaio(val)} />
                <View style={[styles.modalBtnContainer, { marginTop: 20 }]}>
                  <TouchableOpacity style={styles.modalBtnSalvar} onPress={() => { Alert.alert('Sucesso', `Raio ajustado para ${raio} KM`); setModalConfig(null); }}>
                    <Text style={styles.modalBtnSalvarText}>Salvar</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {modalConfig === 'notificacoes' && (
              <>
                <Text style={styles.modalTitle}>Notificações</Text>
                <View style={styles.linhaSwitch}>
                  <Text style={styles.textoSwitch}>Receber Alertas</Text>
                  <Switch value={notificacoesAtivas} onValueChange={setNotificacoesAtivas} trackColor={{ false: '#7A8A9E', true: BLUE_COLOR }} thumbColor={'#FFF'}/>
                </View>
                <View style={styles.modalBtnContainer}>
                  <TouchableOpacity style={styles.modalBtnSalvar} onPress={() => { Alert.alert('Sucesso', 'Preferências salvas!'); setModalConfig(null); }}>
                    <Text style={styles.modalBtnSalvarText}>Salvar</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingTop: 15,
    gap: 15,
  },
  btnVoltarRedondo: {
    backgroundColor: BLUE_COLOR,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 36,
    color: '#000',
  },
  scrollContent: {
    paddingHorizontal: 25,
    paddingTop: 20,
    gap: 15,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: CARD_BG,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#D3D3D3',
  },
  perfilRow: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  avatarCirculo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#D1D7DC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#000',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  perfilInfo: {
    marginLeft: 15,
    flex: 1,
  },
  nomeText: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 32,
    color: '#000',
    lineHeight: 34,
  },
  bioText: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 18,
    color: '#8A8A8A',
    marginBottom: 5,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  tagAzul: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BLUE_COLOR,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  tagText: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 18,
    color: '#FFF',
  },
  miniLogo: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  cardTitle: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 26,
    color: '#000',
  },
  cardSubtitle: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 14,
    color: '#A0A0A0',
    marginTop: -2,
  },
  comentariosRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 10,
  },
  boxComentario: {
    flex: 1,
    backgroundColor: '#D1D7DC',
    borderRadius: 12,
    padding: 10,
    height: 60,
    overflow: 'hidden',
  },
  autorText: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 14,
    color: '#000',
  },
  comentarioCorpo: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 14,
    color: '#8A8A8A',
    marginTop: -2,
  },
  textoVazioFixados: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 16,
    color: '#8A8A8A',
    marginTop: 5,
  },
  ganhosHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  valorPrincipal: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 30,
    color: BLUE_COLOR,
  },
  valorSemanal: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 20,
    color: BLUE_COLOR,
    marginTop: 2,
  },
  btnSacar: {
    backgroundColor: BLUE_COLOR,
    borderRadius: 15,
    width: 95,
    height: 32,
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#000',
    marginTop: -5,
  },
  btnSacarText: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 20,
    color: '#FFF',
  },
  accordionContainer: {
    gap: 12,
    marginTop: 2,
  },
  botaoLista: {
    backgroundColor: CARD_BG,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#D3D3D3',
    overflow: 'hidden',
  },
  botaoListaExpandido: {
    paddingBottom: 10,
  },
  accordionHeader: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  botaoListaText: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 24,
    color: '#444',
  },
  textAzul: {
    color: BLUE_COLOR,
  },
  accordionContent: {
    paddingHorizontal: 40,
    paddingTop: 2,
    gap: 4,
  },
  linhaEspecialidade: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemEspecialidade: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 24,
    color: '#555',
  },
  btnAdicionar: {
    alignSelf: 'flex-start',
    marginTop: 6,
    marginLeft: -2,
  },
  opcoesConfigItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#D1D7DC',
    width: '100%',
  },

  modalFundoOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    backgroundColor: '#EAEAEA',
    width: '85%',
    borderRadius: 30,
    paddingHorizontal: 25,
    paddingTop: 30,
    paddingBottom: 30,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  modalTitle: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 36,
    color: BLUE_COLOR,
    textAlign: 'center',
    lineHeight: 38,
    marginBottom: 25,
    width: '100%',
  },
  modalInput: {
    backgroundColor: '#FFF',
    width: '100%',
    height: 55,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: '#333',
    paddingHorizontal: 15,
    fontFamily: 'Homenaje_400Regular',
    fontSize: 22,
    color: '#333',
    marginBottom: 15,
  },
  linkAnexar: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 22,
    color: BLUE_COLOR,
    textDecorationLine: 'underline',
    alignSelf: 'center',
    marginTop: 5,
    marginBottom: 25,
  },
  modalBtnContainer: {
    width: '100%',
    alignItems: 'center',
  },
  modalBtnSalvar: {
    backgroundColor: BLUE_COLOR,
    width: '100%',
    height: 55,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#333', // Contorno escuro
  },
  modalBtnSalvarText: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 26,
    color: '#FFF',
  },
  modalInstrucao: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 18,
    color: '#666',
    marginBottom: 15,
    textAlign: 'center',
  },
  linhaSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  textoSwitch: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 22,
    color: '#333',
  },
});