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

  return (
    <Modal transparent visible={visivel} animationType="none" statusBarTranslucent>
      <View style={styles.overlay}>
        <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }], opacity: opacityAnim }]}>

          {/* Badge topo */}
          <View style={styles.badge}>
            <Text style={styles.badgeTexto}>Serviço Encontrado!</Text>
            <View style={styles.badgePonto} />
          </View>

          {/* Info do cliente */}
          <View style={styles.infoRow}>
            <View style={styles.avatar}>
              <Ionicons name="person-outline" size={28} color="#444" />
            </View>

            <View style={styles.infoTextos}>
              <Text style={styles.nomeCliente}>{dados?.nomeCliente ?? 'Serviço de\nCliente'}</Text>
              <Text style={styles.profissao}>{dados?.servico ?? 'Serviço como profissão'}</Text>
            </View>
          </View>

          {/* Botões */}
          <View style={styles.botoesRow}>
            <TouchableOpacity style={styles.btnAceitar} onPress={onAceitar}>
              <Text style={styles.btnAceitarTexto}>Aceitar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnRecusar} onPress={onRecusar}>
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
    backgroundColor: 'rgba(0,0,0,0.35)',
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
    shadowOffset: {
      width: 0,
      height: 4,
    },
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
    borderWidth: 1,
    borderColor: '#DDD',
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
    marginBottom: 24,
  },

  avatar: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    borderWidth: 1,
    borderColor: '#CCC',
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
    fontSize: 16,
    color: '#777',
    marginTop: 2,
  },

  botoesRow: {
    flexDirection: 'row',
    gap: 12,
  },

  btnAceitar: {
    flex: 1,
    height: 44,
    backgroundColor: BLUE,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },

  btnAceitarTexto: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 18,
    color: '#FFF',
  },

  btnRecusar: {
    flex: 1,
    height: 44,
    backgroundColor: '#D9D9D9',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C0C0C0',
  },

  btnRecusarTexto: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 18,
    color: '#444',
  },
});