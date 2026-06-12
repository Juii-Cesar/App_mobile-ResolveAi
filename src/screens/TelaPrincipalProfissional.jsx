import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import ModalServicoEncontrado from './ModalServicoEncontrado';

const BLUE_COLOR = '#076BDE';

const DADOS_SIMULADOS = {
  nomeCliente: 'Serviço de\nCliente',
  servico: 'Serviço como profissão',
};

export default function TelaPrincipalProfissional({ navigation }) {
  const [mostrandoFiltros, setMostrandoFiltros] = useState(false);
  const [online, setOnline] = useState(false);
  const [modalVisivel, setModalVisivel] = useState(false);
  
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Aviso', 'Precisamos da sua localização para o mapa funcionar.');
        return;
      }

      let locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        (newLocation) => {
          setLocation(newLocation.coords);
        }
      );

      return () => {
        if (locationSubscription) {
          locationSubscription.remove();
        }
      };
    })();
  }, []);

  function handleIniciar() {
    setOnline(true);
    setTimeout(() => {
      setModalVisivel(true);
    }, 2000);
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

  const regiaoInicial = {
    latitude: location ? location.latitude : -22.9022,
    longitude: location ? location.longitude : -43.5587,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  return (
    <View style={styles.container}>
      <MapView 
        style={StyleSheet.absoluteFillObject} 
        region={regiaoInicial}
        showsUserLocation={true}
        showsMyLocationButton={false}
      >
        {location && online && (
          <Marker 
            coordinate={{ latitude: location.latitude, longitude: location.longitude }}
            title="Você está aqui"
            description="Aguardando serviços..."
          />
        )}
      </MapView>

      <SafeAreaView style={styles.safeArea} pointerEvents="box-none">

        <View style={styles.headerFlutuante} pointerEvents="box-none">
          <View style={{ flex: 1 }} /> 
          <TouchableOpacity style={styles.botaoFlutuanteRedondo} onPress={() => console.log('Busca pressionada')}>
            <Ionicons name="search-outline" size={26} color="#FFF" />
          </TouchableOpacity>
        </View>

        <View style={[
          styles.abaStatusContainer,
          mostrandoFiltros ? styles.abaFiltroAberta : styles.abaStatusFechada
        ]}>
          <View style={styles.tracoArrastar} />

          {!mostrandoFiltros ? (
            <Text style={styles.textoStatus}>
              Você está{' '}
              <Text style={online ? styles.onlineHighlight : styles.offlineHighlight}>
                {online ? 'online' : 'offline'}
              </Text>
            </Text>
          ) : (
            <TouchableOpacity
              style={styles.selectFiltro}
              onPress={() => console.log('Abrir opções')}
            >
              <Text style={styles.textoSelect}>Como deseja atuar?</Text>
              <Ionicons name="triangle" size={18} color="#A0A0A0" style={styles.setaSelect} />
            </TouchableOpacity>
          )}

          <View style={styles.rodapeAba}>
            <TouchableOpacity
              onPress={() => setMostrandoFiltros(!mostrandoFiltros)}
              style={[mostrandoFiltros && styles.abaBotaoAtivo]}
            >
              <Feather name="sliders" size={28} color="#000" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.botaoIniciar, online && styles.botaoIniciarOnline]}
              onPress={online ? () => setOnline(false) : handleIniciar}
            >
              <Text style={styles.textoBotaoIniciar}>
                {online ? 'Parar' : 'Iniciar'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('TelaMenuProfissional')}>
              <Ionicons name="menu" size={32} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

      </SafeAreaView>

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
    backgroundColor: '#DBDBDB',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerFlutuante: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 10,
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
    shadowRadius: 3,
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
    shadowRadius: 5,
  },
  abaStatusFechada: {
    height: 190,
  },
  abaFiltroAberta: {
    height: 230,
  },
  tracoArrastar: {
    width: 60,
    height: 6,
    backgroundColor: '#000',
    borderRadius: 3,
    marginBottom: 15,
  },
  textoStatus: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 34,
    color: '#000',
    marginBottom: 15,
  },
  offlineHighlight: {
    color: '#7A8A9E',
  },
  onlineHighlight: {
    color: '#388E3C',
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
    marginBottom: 20,
  },
  textoSelect: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 28,
    color: '#7A8A9E',
  },
  setaSelect: {
    transform: [{ rotate: '180deg' }],
    marginTop: 2,
  },
  rodapeAba: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    elevation: 4,
  },
  botaoIniciarOnline: {
    backgroundColor: '#388E3C',
  },
  textoBotaoIniciar: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 26,
    color: '#FFF',
  },
  abaBotaoAtivo: {
    opacity: 0.5,
  },
});