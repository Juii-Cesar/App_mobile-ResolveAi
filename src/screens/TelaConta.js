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

export default function TelaConta() {
  const navigation = useNavigation();
  const [modalPerfilVisivel, setModalPerfilVisivel] = useState(false);
  const [foto, setFoto] = useState(null);
  const [nome, setNome] = useState('Nome');
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>

        <View style={styles.header}>
          <LogoIcon width={50} height={50} />
          <View style={styles.headerDireita}>
            <Text style={styles.saudacao}>Olá, Cliente</Text>
            <TouchableOpacity onPress={() => setModalPerfilVisivel(true)}>
              <Ionicons name="person-outline" size={20} color="#333" />
            </TouchableOpacity>
          </View>
        </View>


        <View style={styles.botoesGrid}>
          <TouchableOpacity style={styles.botao} onPress={() => navigation.navigate('TelaMinhaConta')}>
            <Text style={styles.botaoTexto}>Conta</Text>
          </TouchableOpacity>

        <TouchableOpacity
          style={styles.botao}
          onPress={() => navigation.navigate('TelaCarteira')}
        >
          <Text style={styles.botaoTexto}>Carteira</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botaoGrande}
          onPress={() => navigation.navigate('TelaFavoritos')}
        >

        <View style={styles.botaoComIcone}>
          <Text style={styles.botaoTexto}>Favoritos</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botaoGrande}
        onPress={() => navigation.navigate('TelaEnderecos')}
      >
        <Text style={styles.botaoTexto}>Endereços</Text>
      </TouchableOpacity>
    </View>

    <View style={styles.avaliacaoCard}>
  <View>
    <Text style={styles.nota}>4.8</Text>
    <Text style={styles.subTexto}>Sua avaliação</Text>
  </View>

  <Text style={styles.totalAvaliacoes}>
    12 avaliações
  </Text>
</View>

  <View style={styles.historicoCard}>
    <Text style={styles.historicoTitulo}>Histórico</Text>
  </View>


      </View>
      {/* Modal perfil */}
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
                {foto ? (
                  <Image source={{ uri: foto }} style={styles.fotoImagem} />
                ) : (
                  <Ionicons name="person-outline" size={48} color="#555" />
                )}
              </View>

              <TouchableOpacity>
                <Text style={styles.linkEditar}>Editar</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.nomeRow}>
              <Text style={styles.nomeTexto}>{nome}</Text>
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
  logoCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
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
    fontSize: 18,
    color: '#222',
    fontWeight: '500',
    fontFamily:"Homenaje_400Regular",
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
    fontFamily:"Homenaje_400Regular",
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

  avaliacaoCard: {
    backgroundColor: '#EEF2EC',
    borderRadius: 20,
    paddingHorizontal: 22,
    paddingVertical: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    marginHorizontal: 14,
  },

  nota: {
    fontSize: 46,
    fontFamily:"Homenaje_400Regular",
    fontWeight: 'bold',
    color: '#2E7D32',
},

  subTexto: {
    fontSize: 19,
    color: '#555',
    fontFamily:"Homenaje_400Regular",
},

  totalAvaliacoes: {
    fontSize: 19,
    color: '#888',
    fontFamily:"Homenaje_400Regular",
},

  historicoCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 14,
  },

  historicoTitulo: {
    fontSize: 24,
    marginBottom: 18,
    fontFamily:"Homenaje_400Regular",
},

  itemHistorico: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
},

  status: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
},

  pedido: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
},

  detalhe: {
    fontSize: 13,
    fontFamily:"Homenaje_400Regular",
    color: '#888',
},

  divisor: {
    height: 1,
    backgroundColor: '#D9D9D9',
    marginVertical: 6,
},
historicoVazio: {
  height: 60,
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