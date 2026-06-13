import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const BLUE = '#076BDE';

export default function TelaServicoFinalizado({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const valor = route?.params?.valor ?? 'R$ 0,00';

  const gavelaAnim = useRef(new Animated.Value(400)).current;

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
      <View style={styles.safeArea}>

        <View style={[styles.headerFlutuante, { paddingTop: insets.top + 10 }]}>
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
            { transform: [{ translateY: gavelaAnim }], paddingBottom: insets.bottom + 40 },
          ]}
        >
          <View style={styles.traco} />

          <Text style={styles.titulo}>
            Serviço{'\n'}
            <Text style={styles.tituloDestaque}>finalizado!</Text>
          </Text>

          <Text style={styles.valorLabel}>Valor Total</Text>
          <View style={styles.valorContainer}>
            <Text style={styles.valorTexto}>
              {valor.toString().includes('R$') ? valor : `R$ ${valor}`}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.btnPagamento}
            onPress={() => Alert.alert('Em breve!', 'A integração com pagamentos está em desenvolvimento.')}
          >
            <Text style={styles.btnPagamentoTexto}>Ir para pagamento</Text>
          </TouchableOpacity>
        </Animated.View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D9D9D9', 
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerFlutuante: {
    paddingHorizontal: 20,
  },
  btnRedondo: {
    backgroundColor: BLUE,
    width: 44,
    height: 44,
    borderRadius: 22,
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
    backgroundColor: '#FFF', 
    borderTopLeftRadius: 45,
    borderTopRightRadius: 45,
    paddingHorizontal: 35,
    paddingTop: 20,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { 
      width: 0, 
      height: -5 
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  traco: {
    width: 60,
    height: 6,
    backgroundColor: '#A0A8B0',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 30,
  },
  titulo: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 48,
    lineHeight: 52,
    color: '#111',
    marginBottom: 30,
  },
  tituloDestaque: {
    color: BLUE,
  },
  valorLabel: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 24,
    color: '#7A8A9E',
    marginBottom: 10,
  },
  valorContainer: {
    backgroundColor: '#F7F9FA',
    borderWidth: 1.5,
    borderColor: '#A0A8B0',
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 35,
    alignItems: 'center',
  },
  valorTexto: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 42,
    color: '#111',
  },
  btnPagamento: {
    backgroundColor: BLUE,
    width: '100%',
    height: 55,
    alignSelf: 'center',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#111',
  },
  btnPagamentoTexto: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 26,
    color: '#FFF',
  },
});