import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function TelaConta() {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>

    
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>S</Text>
          </View>
          <View style={styles.headerDireita}>
            <Text style={styles.saudacao}>Olá, Cliente</Text>
            <Ionicons name="person-outline" size={20} color="#333" />
          </View>
        </View>

        <View style={styles.botoesGrid}>
          <TouchableOpacity style={styles.botao}>
            <Text style={styles.botaoTexto}>Conta</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.botao}>
            <Text style={styles.botaoTexto}>Carteira</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.botao}>
            <View style={styles.botaoComIcone}>
              <Ionicons name="star-outline" size={15} color="#fff" style={{ marginRight: 5 }} />
              <Text style={styles.botaoTexto}>5.0</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.botao} onPress={() => navigation.navigate('TelaEnderecos')}>
            <Text style={styles.botaoTexto}>Endereços</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.graficoWrapper}>
          <View style={styles.graficoCirculo}>
            <Text style={styles.graficoTexto}>Gráfico{'\n'}Serviços</Text>
          </View>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#CBCBCB',
  },
  container: {
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  logoCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#1565C0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  headerDireita: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  saudacao: {
    fontSize: 14,
    color: '#222',
    fontWeight: '500',
  },
  botoesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  botao: {
    width: '48.5%',
    backgroundColor: '#1565C0',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoComIcone: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  botaoTexto: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  graficoWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  graficoCirculo: {
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: '#b0b0b0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  graficoTexto: {
    textAlign: 'center',
    fontSize: 14,
    color: '#444',
    fontWeight: '500',
  },
});