import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, Alert, TextInput, 
  Modal, FlatList, KeyboardAvoidingView, Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import ModalServicoEncontrado from './ModalServicoEncontrado';

const BLUE_COLOR = '#076BDE';

const DADOS_SIMULADOS = {
  nomeCliente: 'Serviço de\nCliente',
  servico: 'Serviço como profissão',
};

const HISTORICO_RECENTE = [
  { id: 'h1', titulo: 'Casa', subtitulo: 'Rua Icoraci, 17 - Santíssimo, Rio de Janeiro', icone: 'home-outline', tipo: 'fixo' },
  { id: 'h2', titulo: 'Trabalho', subtitulo: 'Definir local', icone: 'briefcase-outline', tipo: 'fixo' },
  { id: 'h3', titulo: 'Bonsucesso', subtitulo: 'Rio de Janeiro - RJ', icone: 'clock-outline', tipo: 'historico' },
  { id: 'h4', titulo: 'Estrada da Posse, 1903', subtitulo: 'Santíssimo, Rio de Janeiro - RJ', icone: 'clock-outline', tipo: 'historico' },
];

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

  const [mostrandoFiltros, setMostrandoFiltros] = useState(false);
  const [online, setOnline] = useState(false);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [location, setLocation] = useState(null);
  const [modalBuscaVisivel, setModalBuscaVisivel] = useState(false);
  const [textoBusca, setTextoBusca] = useState('');
  const [resultadosBusca, setResultadosBusca] = useState([]);

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

  function handleIniciar() {
    setOnline(true);
    setTimeout(() => setModalVisivel(true), 2000);
  }

  function handleAceitar() {
    setModalVisivel(false);
    navigation.navigate('TelaChatProfissional', {
      profissionalNome: 'Nome Profissional',
      dadosServico: DADOS_SIMULADOS,
    });
  }

  function handleRecusar() {
    setModalVisivel(false);
    setOnline(false);
  }

  async function buscarEndereco(enderecoSelecionado) {
    const enderecoParaBuscar = enderecoSelecionado || textoBusca;
    
    if (!enderecoParaBuscar.trim()) return;

    try {
      const resultados = await Location.geocodeAsync(enderecoParaBuscar);
      
      if (resultados.length > 0) {
        const { latitude, longitude } = resultados[0];
        
        mapRef.current?.animateToRegion({
          latitude, longitude, latitudeDelta: 0.05, longitudeDelta: 0.05,
        }, 1000);
        
        fecharBusca();
      } else {
        Alert.alert('Poxa!', 'Não conseguimos encontrar esse local.');
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

  const renderItemBusca = ({ item }) => (
    <TouchableOpacity 
      style={styles.itemBuscaContainer} 
      onPress={() => buscarEndereco(item.titulo || item)}
    >
      <View style={styles.iconeBuscaBg}>
        <MaterialCommunityIcons 
          name={item.icone || 'map-marker-outline'} 
          size={24} 
          color="#555" 
        />
      </View>
      <View style={styles.textosItemBusca}>
        <Text style={styles.tituloItemBusca}>{item.titulo || item}</Text>
        {item.subtitulo && <Text style={styles.subtituloItemBusca}>{item.subtitulo}</Text>}
      </View>
      {item.tipo === 'fixo' && (
        <Text style={styles.textoAcaoItem}>
          {item.titulo === 'Casa' ? 'Editar' : 'Definir local'}
        </Text>
      )}
    </TouchableOpacity>
  );

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
          <Marker 
            coordinate={{ latitude: location.latitude, longitude: location.longitude }}
            title="Você está aqui"
          />
        )}
      </MapView>

      <SafeAreaView style={styles.safeArea} pointerEvents="box-none">
        <View style={styles.headerFlutuante} pointerEvents="box-none">
          <View style={{ flex: 1 }} /> 
          <TouchableOpacity style={styles.botaoFlutuanteRedondo} onPress={() => setModalBuscaVisivel(true)}>
            <Ionicons name="search-outline" size={26} color="#FFF" />
          </TouchableOpacity>
        </View>

        <View style={[styles.abaStatusContainer, mostrandoFiltros ? styles.abaFiltroAberta : styles.abaStatusFechada]}>
          <View style={styles.tracoArrastar} />
          {!mostrandoFiltros ? (
            <Text style={styles.textoStatus}>
              Você está <Text style={online ? styles.onlineHighlight : styles.offlineHighlight}>{online ? 'online' : 'offline'}</Text>
            </Text>
          ) : (
            <TouchableOpacity style={styles.selectFiltro}>
              <Text style={styles.textoSelect}>Como deseja atuar?</Text>
              <Ionicons name="triangle" size={18} color="#A0A0A0" style={styles.setaSelect} />
            </TouchableOpacity>
          )}

          <View style={styles.rodapeAba}>
            <TouchableOpacity onPress={() => setMostrandoFiltros(!mostrandoFiltros)} style={[mostrandoFiltros && styles.abaBotaoAtivo]}>
              <Feather name="sliders" size={28} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.botaoIniciar, online && styles.botaoIniciarOnline]} onPress={online ? () => setOnline(false) : handleIniciar}>
              <Text style={styles.textoBotaoIniciar}>{online ? 'Parar' : 'Iniciar'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('TelaMenuProfissional')}>
              <Ionicons name="menu" size={32} color="#000" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      <Modal visible={modalBuscaVisivel} animationType="slide" transparent={false}>
        <SafeAreaView style={styles.modalMapsContainer}>

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
            data={textoBusca.trim() === '' ? HISTORICO_RECENTE : resultadosBusca}
            keyExtractor={(item, index) => item.id || index.toString()}
            renderItem={renderItemBusca}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.listaBuscaContent}
            ListFooterComponent={
              textoBusca.trim() === '' ? (
                <TouchableOpacity style={styles.botaoMaisHistorico}>
                  <Text style={styles.textoMaisHistorico}>Mais do histórico recente</Text>
                </TouchableOpacity>
              ) : null
            }
          />
        </SafeAreaView>
      </Modal>

      <ModalServicoEncontrado
        visivel={modalVisivel}
        dados={DADOS_SIMULADOS}
        onAceitar={handleAceitar}
        onRecusar={handleRecusar}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#DBDBDB' 
  },
  safeArea: { 
    flex: 1, 
    justifyContent: 'space-between' 
  },
  headerFlutuante: { 
    flexDirection: 'row', 
    justifyContent: 'flex-end', 
    paddingHorizontal: 20, 
    paddingTop: 10 
  },
  botaoFlutuanteRedondo: { 
    backgroundColor: BLUE_COLOR, 
    width: 52, 
    height: 52, 
    borderRadius: 26, 
    justifyContent: 'center', 
    alignItems: 'center', 
    elevation: 5, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.3, 
    shadowRadius: 3 
  },
  abaStatusContainer: { 
    backgroundColor: '#EAEAEA', 
    borderTopLeftRadius: 45, 
    borderTopRightRadius: 45, 
    paddingHorizontal: 30, 
    paddingTop: 12, 
    paddingBottom: 25, 
    alignItems: 'center', 
    elevation: 10, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: -3 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 5 
  },
  abaStatusFechada: { 
    height: 190 
  },
  abaFiltroAberta: { 
    height: 230 
  },
  tracoArrastar: { 
    width: 60, 
    height: 6, 
    backgroundColor: '#000', 
    borderRadius: 3, 
    marginBottom: 15 
  },
  textoStatus: { 
    fontFamily: 'Homenaje_400Regular', 
    fontSize: 34, 
    color: '#000', 
    marginBottom: 15 
  },
  offlineHighlight: { 
    color: '#7A8A9E' 
  },
  onlineHighlight: { 
    color: '#388E3C' 
  },
  selectFiltro: { 
    flexDirection: 'row', 
    backgroundColor: '#D1D7DC', 
    width: '100%', 
    height: 55, 
    borderRadius: 12, 
    borderWidth: 1.5, 
    borderColor: '#7A8A9E', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    marginBottom: 20 
  },
  textoSelect: { 
    fontFamily: 'Homenaje_400Regular', 
    fontSize: 28, 
    color: '#7A8A9E' 
  },
  setaSelect: { 
    transform: [{ rotate: '180deg' }], 
    marginTop: 2 
  },
  rodapeAba: { 
    flexDirection: 'row', 
    width: '100%', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  botaoIniciar: { 
    backgroundColor: BLUE_COLOR, 
    width: 90, 
    height: 90, 
    borderRadius: 45, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderWidth: 2, 
    borderColor: '#000', 
    elevation: 4 
  },
  botaoIniciarOnline: { 
    backgroundColor: '#388E3C' 
  },
  textoBotaoIniciar: { 
    fontFamily: 'Homenaje_400Regular', 
    fontSize: 26, 
    color: '#FFF' 
  },
  abaBotaoAtivo: { 
    opacity: 0.5 
  },
  modalMapsContainer: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  headerBusca: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  botaoVoltarBusca: {
    marginRight: 10,
    padding: 5,
  },
  inputMaps: {
    flex: 1,
    fontSize: 18,
    color: '#333',
    height: 50,
  },
  botaoLimpar: {
    padding: 5,
  },
  botaoAcaoDireita: {
    padding: 5,
  },
  listaBuscaContent: {
    paddingTop: 10,
  },
  itemBuscaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: '#F0F0F0',
  },
  iconeBuscaBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  textosItemBusca: {
    flex: 1,
  },
  tituloItemBusca: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  subtituloItemBusca: {
    fontSize: 14,
    color: '#777',
  },
  textoAcaoItem: {
    color: '#008080',
    fontWeight: '600',
    fontSize: 14,
  },
  botaoMaisHistorico: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  textoMaisHistorico: {
    color: '#008080',
    fontWeight: '600',
    fontSize: 16,
  }
});