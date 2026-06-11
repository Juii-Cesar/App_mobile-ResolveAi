import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ImageBackground } from 'react-native';

const BLUE = '#076BDE';

export default function TelaServicoFinalizado({ navigation, route }) {
  const valor = route?.params?.valor ?? 'R$ 0,00';

  const gavelaAnim = useRef(new Animated.Value(200)).current;

  useEffect(() => {
    Animated.spring(gavelaAnim, {
      toValue: 0,
      tension: 50,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, []);

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

         
          <Animated.View
            style={[
              styles.gaveta,
              { transform: [{ translateY: gavelaAnim }] },
            ]}
          >
      
            <View style={styles.traco} />

        
            <Text style={styles.titulo}>
              Serviço{'\n'}
              <Text style={styles.tituloDestaque}>finalizado!</Text>
            </Text>

        
            <Text style={styles.valorLabel}>Valor</Text>
            <Text style={styles.valorTexto}>{valor}</Text>

      
            <TouchableOpacity
              style={styles.btnPagamento}
              onPress={() => navigation.navigate('TelaPagamento', { valor })}
            >
              <Text style={styles.btnPagamentoTexto}>Ir para pagamento</Text>
            </TouchableOpacity>
          </Animated.View>

        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  btnRedondo: {
    backgroundColor: BLUE,
    width: 52,
    height: 52,
    borderRadius: 26,
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

  gaveta: {
    backgroundColor: '#EAEAEA',
    borderTopLeftRadius: 45,
    borderTopRightRadius: 45,

    paddingHorizontal: 35,
    paddingTop: 18,
    paddingBottom: 40,

    minHeight: 300,

    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },

  traco: {
    width: 60,
    height: 6,
    backgroundColor: '#000',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 25,
  },

  titulo: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 40,
    lineHeight: 42,
    color: '#000',
    marginBottom: 20,
  },

  tituloDestaque: {
    color: BLUE,
  },

  valorLabel: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 26,
    color: '#222',
    marginBottom: 8,
  },

  valorContainer: {
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 12,
    backgroundColor: '#FFF',

    paddingVertical: 10,
    paddingHorizontal: 15,

    marginBottom: 25,
  },

  valorTexto: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 34,
    color: '#111',
  },

  btnPagamento: {
    backgroundColor: BLUE,
    width: '99%',
    height: 44,
    alignSelf: 'center',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
    marginTop: 15,
  },

  btnPagamentoTexto: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 22,
    color: '#FFF',
  },
});