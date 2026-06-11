import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import ModalServicoEncontrado from './ModalServicoEncontrado';

const BLUE_COLOR = '#076BDE';

// Dados simulados do cliente — substituir por dados reais do backend
const DADOS_SIMULADOS = {
  nomeCliente: 'Serviço de\nCliente',
  servico: 'Serviço como profissão',
};

export default function TelaPrincipalProfissional({ navigation }) {
  const [mostrandoFiltros, setMostrandoFiltros] = useState(false);
  const [online, setOnline] = useState(false);
  const [modalVisivel, setModalVisivel] = useState(false);

  function handleIniciar() {
    setOnline(true);
    // Simula chegada de serviço após 2s — substituir por listener do backend
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

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: 'https://i.imgur.com/vH1Wb7I.png' }}
        style={styles.mapaFundo}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.safeArea}>

          <View style={styles.headerFlutuante}>
            <TouchableOpacity style={styles.botaoFlutuanteRedondo} onPress={() => console.log('Home pressionado')}>
              <Ionicons name="home-outline" size={26} color="#FFF" />
            </TouchableOpacity>

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
                <Text style={styles.textoSelect}>Como deseja atuar ?</Text>
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
      </ImageBackground>

      {/* Modal de serviço encontrado */}
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
  mapaFundo: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerFlutuante: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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