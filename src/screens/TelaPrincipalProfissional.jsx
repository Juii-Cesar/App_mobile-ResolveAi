import React, { useState, useEffect, useRef, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, TextInput, Modal, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useFocusEffect } from '@react-navigation/native'; 
import ModalServicoEncontrado from './ModalServicoEncontrado';

import { supabase } from '../services/supabase';

const BLUE_COLOR = '#076BDE';

const SUGESTOES_BAIRROS = [
  'Campo Grande, Rio de Janeiro',
  'Santíssimo, Rio de Janeiro',
  'Bangu, Rio de Janeiro',
  'Santa Cruz, Rio de Janeiro',
  'Padre Miguel, Rio de Janeiro',
  'Realengo, Rio de Janeiro',
  'Barra da Tijuca, Rio de Janeiro',
  'Recreio dos Bandeirantes, Rio de Janeiro'
];

export default function TelaPrincipalProfissional({ navigation }) {
  const mapRef = useRef(null);
  const insets = useSafeAreaInsets();
  const [mostrandoFiltros, setMostrandoFiltros] = useState(false);
  const [online, setOnline] = useState(false);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [location, setLocation] = useState(null);
  const [modalBuscaVisivel, setModalBuscaVisivel] = useState(false);
  const [textoBusca, setTextoBusca] = useState('');
  const [resultadosBusca, setResultadosBusca] = useState([]);
  const [profissoes, setProfissoes] = useState([]);
  const [profissaoSelecionada, setProfissaoSelecionada] = useState('');
  const [dropdownAberto, setDropdownAberto] = useState(false);
  const [dadosChamado, setDadosChamado] = useState(null);
  
  const [filaServicos, setFilaServicos] = useState([]);

  const [historicoRecente, setHistoricoRecente] = useState([
    { id: 'h1', titulo: 'Casa', subtitulo: 'Definir local', icone: 'home-outline', tipo: 'fixo' },
    { id: 'h2', titulo: 'Trabalho', subtitulo: 'Definir local', icone: 'briefcase-outline', tipo: 'fixo' }
  ]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Aviso', 'Precisamos da sua localização para o mapa funcionar.');
        return;
      }
      let locationSubscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 5000, distanceInterval: 10 },
        (newLocation) => setLocation(newLocation.coords)
      );
      return () => {
        if (locationSubscription) locationSubscription.remove();
      };
    })();
  }, []);

  useFocusEffect(
    useCallback(() => {
      async function carregarProfissoes() {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const { data } = await supabase
            .from('profissoes_profissional')
            .select('profissao')
            .eq('profissional_id', user.id);

          if (data && data.length > 0) {
            const listaProfissoes = data.map(item => item.profissao);
            setProfissoes(listaProfissoes);
            setProfissaoSelecionada(prev => prev || listaProfissoes[0]); 
          } else {
            setProfissoes([]);
            setProfissaoSelecionada('');
          }
        } catch (error) {
          console.log("Erro ao buscar profissões:", error);
        }
      }
      carregarProfissoes();
    }, [])
  );

  useEffect(() => {
    if (textoBusca.trim() === '') {
      setResultadosBusca([]);
    } else {
      const filtrados = SUGESTOES_BAIRROS.filter(bairro => 
        bairro.toLowerCase().includes(textoBusca.toLowerCase())
      );
      setResultadosBusca(filtrados);
    }
  }, [textoBusca]);

  useEffect(() => {
    let channel;
    async function escutarServicos() {
      if (!online) {
        setFilaServicos([]); 
        return;
      }

      const { data: profData } = await supabase.from('profissoes').select('id').ilike('nome', profissaoSelecionada).maybeSingle();
      if (!profData) return;

      const { data: pendentes } = await supabase
        .from('servicos')
        .select('id, descricao, cliente:usuarios!idcliente(nome)')
        .eq('status', 'procurandoProfissional')
        .eq('idprofissao', profData.id);

      if (pendentes && pendentes.length > 0) {
        const formatados = pendentes.map(s => ({
          id: s.id,
          nomeCliente: s.cliente?.nome || 'Cliente',
          servico: profissaoSelecionada ? `Precisa de: ${profissaoSelecionada}` : 'Serviço Geral',
          descricao: s.descricao
        }));
        setFilaServicos(formatados);
      }

      channel = supabase.channel('novos_servicos')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'servicos', filter: `status=eq.procurandoProfissional` }, 
          async (payload) => {
            if (payload.new.idprofissao === profData.id) {
              const { data: cli } = await supabase.from('usuarios').select('nome').eq('id', payload.new.idcliente).single();
              setFilaServicos(prev => [...prev, {
                id: payload.new.id,
                nomeCliente: cli?.nome || 'Cliente',
                servico: profissaoSelecionada ? `Precisa de: ${profissaoSelecionada}` : 'Serviço Geral',
                descricao: payload.new.descricao
              }]);
            }
          }
        ).subscribe();
    }

    escutarServicos();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [online, profissaoSelecionada]);


  function handleIniciar() {
    if (!profissaoSelecionada && profissoes.length > 0) {
      Alert.alert('Atenção', 'Selecione como deseja atuar antes de ficar online!');
      return;
    }
    setOnline(!online);
  }

  async function handleAceitar() {
    if (filaServicos.length === 0) return;
    
    const servico = filaServicos[0];
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from('servicos')
      .update({ status: 'servicoAceito', idprofissional: user.id })
      .eq('id', servico.id);

    if (!error) {
      setOnline(false);
      setFilaServicos([]); 
      navigation.navigate('TelaChatProfissional', {
        profissionalNome: servico.nomeCliente,
        dadosServico: servico,
      });
    } else {
      Alert.alert('Poxa!', 'Este serviço não está mais disponível.');
      handleRecusar();
    }
  }

  function handleRecusar() {
    setFilaServicos(prev => prev.slice(1));
  }

  function adicionarAoHistorico(novoEndereco) {
    setHistoricoRecente(prevHistorico => {
      const fixos = prevHistorico.filter(item => item.tipo === 'fixo');
      let resto = prevHistorico.filter(item => item.tipo !== 'fixo');
      resto = resto.filter(item => item.titulo !== novoEndereco);
      const novoItem = { id: Date.now().toString(), titulo: novoEndereco, subtitulo: 'Buscado recentemente', icone: 'clock-outline', tipo: 'historico' };
      resto = [novoItem, ...resto];
      if (resto.length > 5) resto = resto.slice(0, 5);
      return [...fixos, ...resto];
    });
  }

  async function buscarEndereco(enderecoSelecionado) {
    const enderecoParaBuscar = enderecoSelecionado || textoBusca;
    if (!enderecoParaBuscar.trim()) return;

    try {
      const resultados = await Location.geocodeAsync(enderecoParaBuscar);
      if (resultados.length > 0) {
        const { latitude, longitude } = resultados[0];
        mapRef.current?.animateToRegion({ latitude, longitude, latitudeDelta: 0.05, longitudeDelta: 0.05 }, 1000);
        adicionarAoHistorico(enderecoParaBuscar);
        fecharBusca();
      } else {
        Alert.alert('Poxa!', 'Não conseguimos encontrar esse local. Tente digitar o nome da cidade junto.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um problema ao buscar o endereço.');
    }
  }

  function fecharBusca() {
    setModalBuscaVisivel(false);
    setTextoBusca('');
    setResultadosBusca([]);
  }

  const regiaoInicial = {
    latitude: location ? location.latitude : -22.9022,
    longitude: location ? location.longitude : -43.5587,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  const renderItemBusca = ({ item }) => {
    const isSugestao = typeof item === 'string';
    const titulo = isSugestao ? item : item.titulo;
    const icone = isSugestao ? 'map-marker-outline' : (item.icone || 'map-marker-outline');
    const subtitulo = isSugestao ? null : item.subtitulo;

    return (
      <TouchableOpacity style={styles.itemBuscaContainer} onPress={() => buscarEndereco(titulo)}>
        <View style={styles.iconeBuscaBg}><MaterialCommunityIcons name={icone} size={24} color="#555" /></View>
        <View style={styles.textosItemBusca}>
          <Text style={styles.tituloItemBusca} numberOfLines={1}>{titulo}</Text>
          {subtitulo && <Text style={styles.subtituloItemBusca}>{subtitulo}</Text>}
        </View>
        {!isSugestao && item.tipo === 'fixo' && (
          <Text style={styles.textoAcaoItem}>{item.titulo === 'Casa' ? 'Editar' : 'Definir'}</Text>
        )}
      </TouchableOpacity>
    );
  };

  const alturaBase = 190;
  const alturaFiltro = 240;
  const alturaFiltroAberto = 380; 
  
  const alturaCaixa = !mostrandoFiltros ? alturaBase : (dropdownAberto ? alturaFiltroAberto : alturaFiltro);
  const espacoExtraBotao = insets.bottom > 0 ? insets.bottom : 15;

  return (
    <View style={styles.container}>
      <MapView 
        ref={mapRef} 
        style={StyleSheet.absoluteFillObject} 
        initialRegion={regiaoInicial}
        showsUserLocation={true}
        showsMyLocationButton={false}
      >
        {location && online && (
          <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }} title="Você está aqui" />
        )}
      </MapView>

      <View style={[styles.camadaSobreposicao, { paddingTop: insets.top }]} pointerEvents="box-none">
        
        <View style={styles.headerFlutuante} pointerEvents="box-none">
          <View style={{ flex: 1 }} /> 
          <TouchableOpacity style={styles.botaoFlutuanteRedondo} onPress={() => setModalBuscaVisivel(true)}>
            <Ionicons name="search-outline" size={26} color="#FFF" />
          </TouchableOpacity>
        </View>

        <View style={{ flex: 1 }} pointerEvents="none" />

        <View style={[
          styles.abaStatusContainer,
          { 
            height: alturaCaixa + espacoExtraBotao,
            paddingBottom: espacoExtraBotao + 10
          }
        ]}>
          <View style={styles.tracoArrastar} />
          
          {!mostrandoFiltros ? (
            <Text style={styles.textoStatus}>
              Você está <Text style={online ? styles.onlineHighlight : styles.offlineHighlight}>{online ? 'online' : 'offline'}</Text>
            </Text>
          ) : (
            <View style={{ width: '100%', flex: 1 }}>
              <TouchableOpacity 
                style={[styles.selectFiltro, dropdownAberto && { marginBottom: 5 }]} 
                activeOpacity={0.8}
                onPress={() => setDropdownAberto(!dropdownAberto)}
              >
                <Text style={[styles.textoSelect, profissaoSelecionada && { color: '#000' }]}>
                  {profissaoSelecionada || 'Como deseja atuar?'}
                </Text>
                <Ionicons name={dropdownAberto ? "chevron-up" : "chevron-down"} size={22} color="#7A8A9E" />
              </TouchableOpacity>

              {dropdownAberto && (
                <View style={styles.dropdownLista}>
                  <FlatList
                    data={profissoes}
                    keyExtractor={(item, index) => index.toString()}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    renderItem={({ item }) => (
                      <TouchableOpacity 
                        style={styles.dropdownItem}
                        onPress={() => {
                          setProfissaoSelecionada(item);
                          setDropdownAberto(false);
                        }}
                      >
                        <Text style={styles.dropdownItemText}>{item}</Text>
                      </TouchableOpacity>
                    )}
                    ListEmptyComponent={
                      <Text style={[styles.dropdownItemText, { color: '#999', padding: 15 }]}>
                        Nenhuma especialidade cadastrada.
                      </Text>
                    }
                  />
                </View>
              )}
            </View>
          )}

          <View style={styles.rodapeAba}>
            <TouchableOpacity 
              onPress={() => {
                setMostrandoFiltros(!mostrandoFiltros);
                setDropdownAberto(false);
              }} 
              style={[mostrandoFiltros && styles.abaBotaoAtivo]}
            >
              <Feather name="sliders" size={28} color="#000" />
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.botaoIniciar, online && styles.botaoIniciarOnline]} onPress={handleIniciar}>
              <Text style={styles.textoBotaoIniciar}>{online ? 'Parar' : 'Iniciar'}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => navigation.navigate('TelaMenuProfissional')}>
              <Ionicons name="menu" size={32} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

      </View>

      <Modal visible={modalBuscaVisivel} animationType="slide" transparent={false}>
        <View style={[styles.modalMapsContainer, { paddingTop: insets.top }]}>
          <View style={styles.headerBusca}>
            <TouchableOpacity onPress={fecharBusca} style={styles.botaoVoltarBusca}>
              <Ionicons name="arrow-back" size={28} color="#333" />
            </TouchableOpacity>
            
            <TextInput
              style={styles.inputMaps}
              placeholder="Pesquise no Google Maps"
              placeholderTextColor="#666"
              value={textoBusca}
              onChangeText={setTextoBusca}
              autoFocus={true}
              onSubmitEditing={() => buscarEndereco(textoBusca)}
            />
            
            {textoBusca.length > 0 ? (
              <TouchableOpacity onPress={() => setTextoBusca('')} style={styles.botaoLimpar}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.botaoAcaoDireita}>
                 <MaterialCommunityIcons name="directions" size={26} color="#008080" />
              </TouchableOpacity>
            )}
          </View>

          <FlatList
            data={textoBusca.trim() === '' ? historicoRecente : resultadosBusca}
            keyExtractor={(item, index) => typeof item === 'string' ? index.toString() : item.id}
            renderItem={renderItemBusca}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.listaBuscaContent}
            ListFooterComponent={
              textoBusca.trim() === '' && historicoRecente.length > 2 ? (
                <TouchableOpacity style={styles.botaoMaisHistorico}>
                  <Text style={styles.textoMaisHistorico}>Mais do histórico recente</Text>
                </TouchableOpacity>
              ) : null
            }
          />
        </View>
      </Modal>

      <ModalServicoEncontrado
        visivel={filaServicos.length > 0}
        dados={filaServicos[0] || null}
        onAceitar={handleAceitar}
        onRecusar={handleRecusar}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#DBDBDB' },
  camadaSobreposicao: { flex: 1, justifyContent: 'space-between' },
  headerFlutuante: { flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 20, paddingTop: 10 },
  botaoFlutuanteRedondo: { backgroundColor: BLUE_COLOR, width: 52, height: 52, borderRadius: 26, justifyContent: 'center', alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 3 },

  abaStatusContainer: { backgroundColor: '#EAEAEA', borderTopLeftRadius: 45, borderTopRightRadius: 45, paddingHorizontal: 30, paddingTop: 12, alignItems: 'center', elevation: 15, shadowColor: '#000', shadowOffset: { width: 0, height: -5 }, shadowOpacity: 0.2, shadowRadius: 10 },
  tracoArrastar: { width: 60, height: 6, backgroundColor: '#000', borderRadius: 3, marginBottom: 15 },
  textoStatus: { fontFamily: 'Homenaje_400Regular', fontSize: 34, color: '#000', marginBottom: 15 },
  offlineHighlight: { color: '#7A8A9E' },
  onlineHighlight: { color: '#388E3C' },
  selectFiltro: { flexDirection: 'row', backgroundColor: '#D1D7DC', width: '100%', height: 55, borderRadius: 12, borderWidth: 1.5, borderColor: '#7A8A9E', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 20 },
  textoSelect: { fontFamily: 'Homenaje_400Regular', fontSize: 24, color: '#7A8A9E' },
  dropdownLista: { flex: 1, backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: '#D1D7DC', marginBottom: 15, overflow: 'hidden' },
  dropdownItem: { paddingVertical: 12, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  dropdownItemText: { fontFamily: 'Homenaje_400Regular', fontSize: 22, color: '#333' },
  rodapeAba: { flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' },
  botaoIniciar: { backgroundColor: BLUE_COLOR, width: 90, height: 90, borderRadius: 45, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#000', elevation: 4 },
  botaoIniciarOnline: { backgroundColor: '#388E3C' },
  textoBotaoIniciar: { fontFamily: 'Homenaje_400Regular', fontSize: 26, color: '#FFF' },
  abaBotaoAtivo: { opacity: 0.5 },
  modalMapsContainer: { flex: 1, backgroundColor: '#FFF' },
  headerBusca: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 10, borderBottomWidth: 1, borderColor: '#E0E0E0', backgroundColor: '#FFF', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 2 },
  botaoVoltarBusca: { marginRight: 10, padding: 5 },
  inputMaps: { flex: 1, fontSize: 18, color: '#333', height: 50 },
  botaoLimpar: { padding: 5 },
  botaoAcaoDireita: { padding: 5 },
  listaBuscaContent: { paddingTop: 10 },
  itemBuscaContainer: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 20, borderBottomWidth: 1, borderColor: '#F0F0F0' },
  iconeBuscaBg: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  textosItemBusca: { flex: 1 },
  tituloItemBusca: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 2 },
  subtituloItemBusca: { fontSize: 14, color: '#777' },
  textoAcaoItem: { color: '#008080', fontWeight: '600', fontSize: 14 },
  botaoMaisHistorico: { alignItems: 'center', paddingVertical: 20 },
  textoMaisHistorico: { color: '#008080', fontWeight: '600', fontSize: 16 }
});