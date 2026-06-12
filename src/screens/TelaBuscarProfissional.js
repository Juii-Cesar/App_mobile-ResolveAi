import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { ImageBackground } from 'react-native';

const BLUE = '#076BDE';


const ESTADO = {
  BUSCANDO: 'buscando',
  ENCONTRADO: 'encontrado',
  CHAT_NOTIF: 'chat_notif',
};


const TEMPO_BUSCA_MS = 3000;

export default function TelaBuscarProfissional({ navigation, route }) {
  const { descricao, prioridade, categoria } = route?.params ?? {};

  const [estado, setEstado] = useState(ESTADO.BUSCANDO);
  const [notifChat, setNotifChat] = useState(0);

  const pulsoAnim = useRef(new Animated.Value(1)).current;
  const gavelaAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (estado === ESTADO.BUSCANDO) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulsoAnim, { toValue: 1.15, duration: 700, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
          Animated.timing(pulsoAnim, { toValue: 1, duration: 700, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
        ])
      ).start();
    } else {
      pulsoAnim.stopAnimation();
      pulsoAnim.setValue(1);
    }
  }, [estado]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setEstado(ESTADO.ENCONTRADO);
      Animated.spring(gavelaAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }).start();
    }, TEMPO_BUSCA_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (estado === ESTADO.ENCONTRADO) {
      const timer = setTimeout(() => {
        setEstado(ESTADO.CHAT_NOTIF);
        setNotifChat(1);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [estado]);

  const gavelaTranslate = gavelaAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [200, 0],
  });

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: 'https://i.imgur.com/vH1Wb7I.png' }}
        style={styles.mapa}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.safeArea}>

  
          <View style={styles.headerFlutuante}>
            <TouchableOpacity
              style={styles.btnRedondo}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>

  
          {estado === ESTADO.BUSCANDO && (
            <View style={styles.buscandoContainer}>
              <Animated.View style={[styles.buscandoPulso, { transform: [{ scale: pulsoAnim }] }]}>
                <ActivityIndicator size="large" color={BLUE} />
              </Animated.View>
              <Text style={styles.buscandoTexto}>Buscando profissional ...</Text>
            </View>
          )}

        
          {estado !== ESTADO.BUSCANDO && (
            <Animated.View
              style={[
                styles.gaveta,
                { transform: [{ translateY: gavelaTranslate }] },
              ]}
            >
             
              <View style={styles.traco} />

              <View style={styles.profissionalCard}>
      
                <View style={styles.avatar}>
                  <Ionicons name="person-outline" size={28} color="#444" />
                </View>

              
                <View style={styles.profissionalInfo}>
                  <Text style={styles.profissionalNome}>Nome</Text>
                  <Text style={styles.profissionalDetalhe}>Distância</Text>
                </View>

              
                <View style={styles.avaliacaoContainer}>
                  <Ionicons name="star-outline" size={16} color="#F5A623" />
                  <Text style={styles.avaliacaoNota}>4.2</Text>
                  <Text style={styles.profissionalDetalhe}>Profissão</Text>
                </View>
              </View>

              
              <TouchableOpacity
                style={styles.btnChat}
                onPress={() => navigation.navigate('TelaChat', {
                  profissionalNome: 'Nome Profissional',
                })}
              >
                <Ionicons name="chatbubble-outline" size={22} color="#FFF" />
                <Text style={styles.btnChatTexto}>Chat</Text>

              
                {estado === ESTADO.CHAT_NOTIF && notifChat > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeTexto}>{notifChat}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </Animated.View>
          )}

        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D9D9D9',
  },

  mapa: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },

  headerFlutuante: {
    paddingHorizontal: 14,
    paddingTop: 8,
  },

  btnRedondo: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: BLUE,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buscandoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buscandoPulso: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  buscandoTexto: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 34,
    color: '#111',
    marginTop: 18,
  },

  gaveta: {
    backgroundColor: '#EAEAEA',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 40,
    shadowColor: '#000',
    shadowOffset: {
    width: 0,
    height: -2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 6,
  },

  traco: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#111',
    alignSelf: 'center',
    marginBottom: 10,
  },


  profissionalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 18,
    backgroundColor: '#EAEAEA',
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#444',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  profissionalInfo: {
    flex: 1,
  },

  profissionalNome: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 14,
    color: '#111',
  },

  profissionalDetalhe: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 10,
    color: '#666',
  },

  avaliacaoContainer: {
    alignItems: 'center',
  },

  avaliacaoNota: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 12,
    color: '#111',
  },

  btnChat: {
    height: 38,
    backgroundColor: BLUE,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },

  btnChatTexto: {
    color: '#FFF',
    fontFamily: 'Homenaje_400Regular',
    fontSize: 22,
  },

  badge: {
    position: 'absolute',
    top: -4,
    right: 10,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#D32F2F',
    justifyContent: 'center',
    alignItems: 'center',
  },

  badgeTexto: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
});