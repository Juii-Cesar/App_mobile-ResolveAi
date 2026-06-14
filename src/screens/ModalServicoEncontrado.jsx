import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BLUE = '#076BDE';

export default function ModalServicoEncontrado({ visivel, dados, onAceitar, onRecusar }) {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visivel) {
      Animated.parallel([
        Animated.spring(scaleAnim, { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }),
        Animated.timing(opacityAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
    } else {
      scaleAnim.setValue(0.8);
      opacityAnim.setValue(0);
    }
  }, [visivel]);

  const nomeExibicao = dados?.nomeCliente && dados.nomeCliente !== 'Cliente' ? dados.nomeCliente : 'Cliente Oculto';

  const iniciais = nomeExibicao
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase();

  return (
    <Modal transparent visible={visivel} animationType="none" statusBarTranslucent>
      <View style={styles.overlay}>
        <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }], opacity: opacityAnim }]}>

          <View style={styles.badge}>
            <Text style={styles.badgeTexto}>Novo Serviço Encontrado!</Text>
            <View style={styles.badgePonto} />
          </View>

          <View style={styles.infoRow}>
            <View style={styles.avatar}>
              {nomeExibicao !== 'Cliente Oculto' ? (
                <Text style={styles.iniciaisTexto}>{iniciais}</Text>
              ) : (
                <Ionicons name="person-outline" size={28} color="#444" />
              )}
            </View>

            <View style={styles.infoTextos}>
              <Text style={styles.nomeCliente} numberOfLines={2}>
                {nomeExibicao}
              </Text>
              <Text style={styles.profissao}>{dados?.servico ?? 'Serviço Geral'}</Text>
            </View>
          </View>

          <View style={styles.extraInfoContainer}>
            {dados?.distanciaKM && (
              <View style={styles.badgePequeno}>
                <Ionicons name="location-outline" size={16} color="#555" />
                <Text style={styles.badgePequenoTexto}>A {dados.distanciaKM} km</Text>
              </View>
            )}

            {dados?.taxa > 0 && (
              <View style={[styles.badgePequeno, { backgroundColor: '#E8F5E9', borderColor: '#A5D6A7' }]}>
                <Ionicons name="cash-outline" size={16} color="#388E3C" />
                <Text style={[styles.badgePequenoTexto, { color: '#388E3C' }]}>
                  Taxa do App: R$ {dados.taxa},00
                </Text>
              </View>
            )}
          </View>

          <View style={styles.botoesRow}>
            <TouchableOpacity style={styles.btnAceitar} onPress={onAceitar} activeOpacity={0.8}>
              <Text style={styles.btnAceitarTexto}>Aceitar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnRecusar} onPress={onRecusar} activeOpacity={0.8}>
              <Text style={styles.btnRecusarTexto}>Recusar</Text>
            </TouchableOpacity>
          </View>

        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    padding: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: '#CCC',
  },
  badgeTexto: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 22,
    color: '#222',
  },
  badgePonto: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#F5A623',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#D1D7DC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    borderWidth: 1.5,
    borderColor: '#000',
  },
  iniciaisTexto: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 26,
    color: '#000',
  },
  infoTextos: {
    flex: 1,
  },
  nomeCliente: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 28,
    color: '#111',
    lineHeight: 30,
  },
  profissao: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 18,
    color: '#777',
    marginTop: 2,
  },
  extraInfoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  badgePequeno: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CCC',
  },
  badgePequenoTexto: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 16,
    color: '#555',
    marginLeft: 4,
    marginTop: 2,
  },
  botoesRow: {
    flexDirection: 'row',
    gap: 12,
  },
  btnAceitar: {
    flex: 1,
    height: 50,
    backgroundColor: BLUE,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#000',
  },
  btnAceitarTexto: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 22,
    color: '#FFF',
  },
  btnRecusar: {
    flex: 1,
    height: 50,
    backgroundColor: '#D9D9D9',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#000',
  },
  btnRecusarTexto: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 22,
    color: '#444',
  },
});