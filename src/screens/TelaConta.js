import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import LogoIcon from '../assets/icons/LogoIcon';
import { useServico } from '../context/ServicoContext';
import { useAuth } from '../context/AuthContext';

export default function TelaConta() {
  const navigation = useNavigation();
  const { servicoAtivo } = useServico();

  const { usuario } = useAuth();

  const [modalPerfilVisivel, setModalPerfilVisivel] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>

        <View style={styles.header}>
          <LogoIcon width={50} height={50} />
          <View style={styles.headerDireita}>
            <Text style={styles.saudacao}>Olá, {usuario?.nome ? `${usuario.nome} ${usuario.sobrenome ?? ''}`.trim() : 'Cliente'}</Text>
            <TouchableOpacity onPress={() => setModalPerfilVisivel(true)}>
              <Ionicons name="person-outline" size={20} color="#333" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.botoesGrid}>
          <TouchableOpacity style={styles.botao} onPress={() => navigation.navigate('TelaMinhaConta')}>
            <Text style={styles.botaoTexto}>Conta</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.botao} onPress={() => navigation.navigate('TelaFavoritos')}>
            <Text style={styles.botaoTexto}>Favoritos</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.botaoGrande} onPress={() => navigation.navigate('TelaEnderecos')}>
            <Text style={styles.botaoTexto}>Endereços</Text>
          </TouchableOpacity>
        </View>

    
        {servicoAtivo && (
          <View style={styles.servicoAtivoCard}>
         
            <View style={styles.servicoAtivoTopo}>
              <View style={styles.badgeAtivo}>
                <View style={styles.badgePonto} />
                <Text style={styles.badgeTexto}>Em atendimento</Text>
              </View>
              <Text style={styles.servicoCategoria}>{servicoAtivo.categoria}</Text>
            </View>

            <Text style={styles.servicoProfissional} numberOfLines={1}>
              {servicoAtivo.profissionalNome}
            </Text>
            <Text style={styles.servicoDescricao} numberOfLines={2}>
              {servicoAtivo.descricao}
            </Text>

            <TouchableOpacity
                style={styles.btnVoltarChat}
                onPress={() =>
                  navigation.navigate('Início', {
                    screen: 'TelaChat',
                    params: servicoAtivo.routeParams,
                  })
                }
              >
                <Ionicons name="chatbubble-ellipses-outline" size={18} color="#FFF" />
                <Text style={styles.btnVoltarChatTexto}>Abrir chat</Text>
              </TouchableOpacity>
          </View>
        )}


      </View>

      <Modal
        visible={modalPerfilVisivel}
        transparent
        animationType="fade"
        onRequestClose={() => setModalPerfilVisivel(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalPerfilVisivel(false)}
        >
          <View style={styles.modalBox} onStartShouldSetResponder={() => true}>
            <Text style={styles.modalTitulo}>Altere seu perfil de usuário</Text>

            <View style={styles.fotoContainer}>
              <View style={styles.fotoCirculo}>
                {usuario?.foto ? (
                  <Image source={{ uri: usuario.foto }} style={styles.fotoImagem} />
                ) : (
                  <Ionicons name="person-outline" size={48} color="#555" />
                )}
              </View>
              <TouchableOpacity onPress={() => { setModalPerfilVisivel(false); navigation.navigate('TelaMinhaConta'); }}>
                <Text style={styles.linkEditar}>Editar</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.nomeRow}>
              <Text style={styles.nomeTexto}>{usuario?.nome ? `${usuario.nome} ${usuario.sobrenome ?? ''}`.trim() : 'Usuário'}</Text>
              <TouchableOpacity onPress={() => { setModalPerfilVisivel(false); navigation.navigate('TelaMinhaConta'); }}>
                <Text style={styles.linkEditar}>Editar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

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
    paddingBottom: 90,
  },
  header: {
    height: 82,
    borderBottomWidth: 1,
    borderBottomColor: '#9BA7B1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#CBCBCB',
    marginBottom: 16,
  },
  headerDireita: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  saudacao: {
    fontSize: 18,
    color: '#222',
    fontWeight: '500',
    fontFamily: 'Homenaje_400Regular',
  },
  botoesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 14,
  },
  botao: {
    width: '48%',
    backgroundColor: '#1565C0',
    borderRadius: 15,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  botaoComIcone: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  botaoTexto: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 20,
    fontFamily: 'Homenaje_400Regular',
  },
  botaoGrande: {
    width: '100%',
    backgroundColor: '#1565C0',
    borderRadius: 15,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  servicoAtivoCard: {
    backgroundColor: '#EEF4FF',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 16,
    marginBottom: 15,
    marginHorizontal: 14,
    borderWidth: 1.5,
    borderColor: '#076BDE',
  },
  servicoAtivoTopo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeAtivo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E8F5E9',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgePonto: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#388E3C',
  },
  badgeTexto: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 13,
    color: '#2E7D32',
  },
  servicoCategoria: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 13,
    color: '#076BDE',
  },
  servicoProfissional: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 22,
    color: '#111',
    marginBottom: 4,
  },
  servicoDescricao: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 14,
    color: '#555',
    marginBottom: 14,
  },
  btnVoltarChat: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#076BDE',
    borderRadius: 12,
    paddingVertical: 10,
  },
  btnVoltarChatTexto: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 16,
    color: '#FFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingTop: 80,
    paddingLeft: 10,
  },
  modalBox: {
    width: 235,
    backgroundColor: '#FFF',
    borderRadius: 18,
    borderTopWidth: 5,
    borderTopColor: '#1565C0',
    padding: 16,
  },
  modalTitulo: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 24,
    color: '#1565C0',
    marginBottom: 14,
  },
  fotoContainer: {
    alignItems: 'center',
    marginBottom: 14,
  },
  fotoCirculo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#888',
    backgroundColor: '#EFEFEF',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  fotoImagem: {
    width: '100%',
    height: '100%',
  },
  linkEditar: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 20,
    color: '#1565C0',
    marginTop: 4,
  },
  nomeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  nomeTexto: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 25,
    color: '#111',
  },
});