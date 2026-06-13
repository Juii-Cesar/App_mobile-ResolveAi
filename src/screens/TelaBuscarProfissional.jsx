import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, ActivityIndicator, Easing } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const BLUE_COLOR = '#076BDE';

const ESTADO = { BUSCANDO: 'buscando', ENCONTRADO: 'encontrado', CHAT_NOTIF: 'chat_notif' };
const TEMPO_BUSCA_MS = 3000;

export default function TelaBuscarProfissional({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { descricao, prioridade, categoria } = route?.params ?? {};

  const [estado, setEstado] = useState(ESTADO.BUSCANDO);
  const [notifChat, setNotifChat] = useState(0);
  const [location, setLocation] = useState(null);

  const pulsoAnim = useRef(new Animated.Value(1)).current;
  const gavelaAnim = useRef(new Animated.Value(0)).current;
  const mapRef = useRef(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        let loc = await Location.getCurrentPositionAsync({});
        setLocation(loc.coords);
      }
    })();
  }, []);

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
      Animated.spring(gavelaAnim, { toValue: 1, tension: 50, friction: 8, useNativeDriver: true }).start();
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

  const gavelaTranslate = gavelaAnim.interpolate({ inputRange: [0, 1], outputRange: [250, 0] });
  const espacoExtraBotao = insets.bottom > 0 ? insets.bottom : 15;

  return (
    <View style={styles.container}>

      <MapView 
        ref={mapRef} 
        style={StyleSheet.absoluteFillObject} 
        initialRegion={{
          latitude: location ? location.latitude : -22.9022,
          longitude: location ? location.longitude : -43.5587,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation={true}
        showsCompass={false}
        showsMyLocationButton={false}
        toolbarEnabled={false}
      >
        {location && estado === ESTADO.ENCONTRADO && (
          <Marker coordinate={{ latitude: location.latitude + 0.005, longitude: location.longitude + 0.005 }} />
        )}
      </MapView>

      <View style={[styles.camadaSobreposicao, { paddingTop: insets.top + 10 }]} pointerEvents="box-none">
        
        <View style={styles.headerFlutuante} pointerEvents="box-none">
          <TouchableOpacity style={styles.btnVoltar} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        {estado === ESTADO.BUSCANDO && (
          <View style={styles.buscandoContainer} pointerEvents="none">
            <Animated.View style={[styles.buscandoPulso, { transform: [{ scale: pulsoAnim }] }]}>
              <ActivityIndicator size="large" color={BLUE_COLOR} />
            </Animated.View>
            <Text style={styles.buscandoTexto}>Buscando profissional ...</Text>
          </View>
        )}

        {estado !== ESTADO.BUSCANDO ? (
          <Animated.View style={[styles.gaveta, { transform: [{ translateY: gavelaTranslate }], paddingBottom: espacoExtraBotao + 10 }]}>
            <View style={styles.traco} />

            <View style={styles.profissionalCard}>
              <View style={styles.avatar}>
                <Ionicons name="person-outline" size={32} color="#444" />
              </View>

              <View style={styles.profissionalInfo}>
                <Text style={styles.profissionalNome}>Profissional Localizado</Text>
                <Text style={styles.profissionalDetalhe}>1.2 km de distância</Text>
              </View>

              <View style={styles.avaliacaoContainer}>
                <Ionicons name="star" size={18} color="#F5A623" />
                <Text style={styles.avaliacaoNota}>4.9</Text>
                <Text style={styles.profissionalDetalhe}>{categoria || 'Serviços'}</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.btnChat} onPress={() => navigation.navigate('TelaChat', { profissionalNome: 'Profissional Localizado' })}>
              <Ionicons name="chatbubble-outline" size={24} color="#FFF" />
              <Text style={styles.btnChatTexto}> Chat</Text>

              {estado === ESTADO.CHAT_NOTIF && notifChat > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeTexto}>{notifChat}</Text>
                </View>
              )}
            </TouchableOpacity>
          </Animated.View>
        ) : (
          <View style={{ flex: 1 }} pointerEvents="none" />
        )}

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D9D9D9',
  },
  camadaSobreposicao: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerFlutuante: {
    paddingHorizontal: 20,
  },
  btnVoltar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: BLUE_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  buscandoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buscandoPulso: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
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
  buscandoTexto: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 32,
    color: '#111',
    marginTop: 20,
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: {
      width: 0,
      height: 1,
    },
    textShadowRadius: 3,
  },
  gaveta: {
    backgroundColor: '#EAEAEA',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 25,
    paddingTop: 15,
    elevation: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -5,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  traco: {
    width: 50,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#111',
    alignSelf: 'center',
    marginBottom: 20,
  },
  profissionalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#A0A8B0',
    borderRadius: 20,
    backgroundColor: '#FFF',
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: '#D1D7DC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    borderWidth: 1,
    borderColor: '#7A8A9E',
  },
  profissionalInfo: {
    flex: 1,
  },
  profissionalNome: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 20,
    color: '#111',
  },
  profissionalDetalhe: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 16,
    color: '#7A8A9E',
  },
  avaliacaoContainer: {
    alignItems: 'center',
  },
  avaliacaoNota: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 18,
    color: '#111',
  },
  btnChat: {
    height: 55,
    backgroundColor: BLUE_COLOR,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    elevation: 3,
  },
  btnChatTexto: {
    color: '#FFF',
    fontFamily: 'Homenaje_400Regular',
    fontSize: 26,
    marginLeft: 5,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: 10,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#D32F2F',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  badgeTexto: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});