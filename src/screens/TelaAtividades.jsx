import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

const BLUE_COLOR = '#076BDE';
const CARD_BG = '#EAEAEA';
const COMMENT_BG = '#D1D7DC';

export default function TelaAtividadesDetalhada({ navigation }) {

  const avaliacoesMock = [
    { id: '1', data: 'Data serviço', nome: 'Nome', servico: 'Serviço' },
    { id: '2', data: 'Data serviço', nome: 'Nome', servico: 'Serviço' },
    { id: '3', data: 'Data serviço', nome: 'Nome', servico: 'Serviço' },
    { id: '4', data: 'Data serviço', nome: 'Nome', servico: 'Serviço' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.btnVoltarRedondo} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Atividades</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {avaliacoesMock.map((item) => (
          <View key={item.id} style={styles.card}>

            <Text style={styles.dataText}>{item.data}</Text>

            <View style={styles.cardCorpoRow}>

              <View style={styles.clienteContainer}>
                <View style={styles.avatarCirculo}>
                  <Ionicons name="person-outline" size={32} color="#000" />
                </View>
                <View style={styles.infoTextContainer}>
                  <Text style={styles.nomeText}>{item.nome}</Text>
                  <Text style={styles.servicoText}>{item.servico}</Text>
                </View>
              </View>

              <View style={styles.avaliacaoContainer}>
                <View style={styles.estrelasRow}>
                  {[1, 2, 3, 4, 5].map((estrela) => (
                    <Ionicons key={estrela} name="star-outline" size={20} color="#000" />
                  ))}
                </View>

                <View style={styles.boxComentario}>
                  <FontAwesome5 name="thumbtack" size={10} color="#555" style={styles.iconPin} />
                  <Text style={styles.comentarioTexto}>Comentário...</Text>
                </View>
              </View>

            </View>
          </View>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFF' 
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingTop: 15,
    gap: 15,
  },
  btnVoltarRedondo: {
    backgroundColor: BLUE_COLOR,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 36,
    color: '#000',
  },
  scrollContent: {
    paddingHorizontal: 25,
    paddingTop: 20,
    gap: 15,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: CARD_BG,
    borderRadius: 25,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#000',
  },
  dataText: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 14,
    color: '#000',
    alignSelf: 'flex-end',
    marginBottom: 2,
  },
  cardCorpoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  clienteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 0.45,
  },
  avatarCirculo: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#000',
  },
  infoTextContainer: {
    justifyContent: 'center',
  },
  nomeText: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 24,
    color: '#000',
    lineHeight: 24,
  },
  servicoText: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 22,
    color: '#000',
    textDecorationLine: 'underline',
    lineHeight: 22,
    marginTop: -2,
  },
  avaliacaoContainer: {
    flex: 0.55,
    alignItems: 'flex-end',
    gap: 8,
  },
  estrelasRow: {
    flexDirection: 'row',
    gap: 2,
  },
  boxComentario: {
    backgroundColor: COMMENT_BG,
    borderRadius: 15,
    width: '100%',
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 12,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#B0B8C0',
  },
  iconPin: {
    position: 'absolute',
    top: 6,
    right: 8,
    transform: [{ rotate: '45deg' }],
  },
  comentarioTexto: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 16,
    color: '#7A8A9E',
  },
});