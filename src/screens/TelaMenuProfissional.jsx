import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import LogoIcon from '../assets/icons/LogoIcon';
import { Button } from '../components/Button';
import { logout } from "../services/auth";

const BLUE_COLOR = '#076BDE';
const CARD_BG = '#EAEAEA';

export default function TelaMenuProfissional({ navigation }) {

  const [espAberto, setEspAberto] = useState(false);
  const [configAberto, setConfigAberto] = useState(false);
  const [modalVisivel, setModalVisivel] = useState(false);

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.btnVoltarRedondo} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Menu Profissional</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        <View style={styles.card}>
          <View style={styles.perfilRow}>
            <View style={styles.avatarCirculo}>
              <Ionicons name="person-outline" size={45} color="#000" />
            </View>
            <View style={styles.perfilInfo}>
              <Text style={styles.nomeText}>Nome</Text>
              <Text style={styles.bioText}>Bio</Text>
              
              <View style={styles.tagsRow}>
                <View style={styles.tagAzul}>
                  <Text style={styles.tagText}>⭐ 5.0</Text>
                </View>
                <View style={styles.tagAzul}>
                  <Text style={styles.tagText}>2 Serviços</Text>
                </View>
              </View>
            </View>
            <LogoIcon width={25} height={25} fill={BLUE_COLOR} style={styles.miniLogo} />
          </View>
        </View>

        <TouchableOpacity 
          style={styles.card} 
          onPress={() => navigation.navigate('TelaAtividades')}
          activeOpacity={0.7}
        >
          <Text style={styles.cardTitle}>Atividades</Text>
          <Text style={styles.cardSubtitle}>Comentários Fixados</Text>
          
          <View style={styles.comentariosRow}>
            <View style={styles.boxComentario}>
              <Text style={styles.autorText}>Autor</Text>
              <Text style={styles.comentarioCorpo}>Comentário...</Text>
            </View>
            <View style={styles.boxComentario}>
              <Text style={styles.autorText}>Autor</Text>
              <Text style={styles.comentarioCorpo}>Comentário...</Text>
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.card}>
          <View style={styles.ganhosHeaderRow}>
            <Text style={styles.cardTitle}>Ganhos</Text>
            <Text style={styles.valorPrincipal}>R$ 420,00</Text>
          </View>
          
          <Text style={styles.cardSubtitle}>Saldo semanal</Text>
          <Text style={styles.valorSemanal}>R$ 60,00</Text>

          <TouchableOpacity style={styles.btnSacar} onPress={() => console.log('Mock: Sacar clicado')}>
            <Text style={styles.btnSacarText}>Sacar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.accordionContainer}>

          <View style={[styles.botaoLista, espAberto && styles.botaoListaExpandido]}>
            <TouchableOpacity 
              style={styles.accordionHeader} 
              onPress={() => setEspAberto(!espAberto)}
              activeOpacity={0.8}
            >
              <Text style={[styles.botaoListaText, espAberto && styles.textAzul]}>
                Minhas Especialidades
              </Text>
              <Ionicons 
                name={espAberto ? "chevron-down" : "chevron-forward"} 
                size={24} 
                color={espAberto ? BLUE_COLOR : "#000"} 
              />
            </TouchableOpacity>

            {espAberto && (
              <View style={styles.accordionContent}>
                <Text style={styles.itemEspecialidade}>Encanador</Text>
                <Text style={styles.itemEspecialidade}>Eletricista</Text>

                <TouchableOpacity 
                  style={styles.btnAdicionar} 
                  onPress={() => setModalVisivel(true)}
                >
                  <Ionicons name="add-circle-outline" size={24} color={BLUE_COLOR} />
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={[styles.botaoLista, configAberto && styles.botaoListaExpandido]}>
            <TouchableOpacity 
              style={styles.accordionHeader} 
              onPress={() => setConfigAberto(!configAberto)}
              activeOpacity={0.8}
            >
              <Text style={[styles.botaoListaText, configAberto && styles.textAzul]}>
                Configurações
              </Text>
              <Ionicons 
                name={configAberto ? "chevron-down" : "chevron-forward"} 
                size={24} 
                color={configAberto ? BLUE_COLOR : "#000"} 
              />
            </TouchableOpacity>

            {configAberto && (
              <View style={styles.accordionContent}>
                <TouchableOpacity style={styles.opcoesConfigItem} onPress={() => console.log('Mock: Raio de atendimento')}>
                  <Text style={styles.itemEspecialidade}>Raio de atendimento (KM)</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.opcoesConfigItem} onPress={() => console.log('Mock: Notificações')}>
                  <Text style={styles.itemEspecialidade}>Notificações e Alertas</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.opcoesConfigItem} onPress={() => console.log('Mock: Configurar Pix')}>
                  <Text style={styles.itemEspecialidade}>Dados Bancários / Pix</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.opcoesConfigItem, { borderBottomWidth: 0 }]} onPress={async () => logout()}>
                  <Text style={[styles.itemEspecialidade, { color: '#DE0707' }]}>Sair da conta</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

        </View>
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisivel}
        onRequestClose={() => setModalVisivel(false)}
      >
        <TouchableOpacity 
          style={styles.modalFundoOverlay} 
          activeOpacity={1} 
          onPress={() => setModalVisivel(false)}
        >

          <View style={styles.modalCard} onStartShouldSetResponder={() => true}>
            
            <Text style={styles.modalTitle}>Adicionando Especialidades</Text>

            <TextInput 
              style={styles.modalInput}
              placeholder="Profissão"
              placeholderTextColor="#7A8A9E"
              editable={false}
            />

            <TextInput 
              style={styles.modalInput}
              placeholder="Tempo de experiência"
              placeholderTextColor="#7A8A9E"
              editable={false}
            />

            <TouchableOpacity onPress={() => console.log('Mock: Anexar certificado')}>
              <Text style={styles.linkAnexar}>Anexar certificado</Text>
            </TouchableOpacity>

            <View style={styles.modalBtnContainer}>
              <Button 
                title="Salvar" 
                onPress={() => {
                  console.log('Mock: Especialidade salva!');
                  setModalVisivel(false);
                }} 
              />
            </View>

          </View>
        </TouchableOpacity>
      </Modal>

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
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#D3D3D3',
  },
  perfilRow: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  avatarCirculo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#D1D7DC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#000',
  },
  perfilInfo: {
    marginLeft: 15,
    flex: 1,
  },
  nomeText: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 32,
    color: '#000',
    lineHeight: 34,
  },
  bioText: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 18,
    color: '#8A8A8A',
    marginBottom: 5,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  tagAzul: {
    backgroundColor: BLUE_COLOR,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  tagText: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 18,
    color: '#FFF',
  },
  miniLogo: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  cardTitle: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 26,
    color: '#000',
  },
  cardSubtitle: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 14,
    color: '#A0A0A0',
    marginTop: -2,
  },
  comentariosRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 10,
  },
  boxComentario: {
    flex: 1,
    backgroundColor: '#D1D7DC',
    borderRadius: 12,
    padding: 10,
    height: 55,
  },
  autorText: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 14,
    color: '#000',
  },
  comentarioCorpo: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 14,
    color: '#8A8A8A',
    marginTop: -2,
  },
  ganhosHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  valorPrincipal: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 30,
    color: BLUE_COLOR,
  },
  valorSemanal: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 20,
    color: BLUE_COLOR,
    marginTop: 2,
  },
  btnSacar: {
    backgroundColor: BLUE_COLOR,
    borderRadius: 15,
    width: 95,
    height: 32,
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
    marginTop: -5,
  },
  btnSacarText: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 20,
    color: '#FFF',
  },
  accordionContainer: {
    gap: 12,
    marginTop: 2,
  },
  botaoLista: {
    backgroundColor: CARD_BG,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#D3D3D3',
    overflow: 'hidden',
  },
  botaoListaExpandido: {
    paddingBottom: 10,
  },
  accordionHeader: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  botaoListaText: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 24,
    color: '#444',
  },
  textAzul: {
    color: BLUE_COLOR,
  },
  accordionContent: {
    paddingHorizontal: 40,
    paddingTop: 2,
    gap: 4,
  },
  itemEspecialidade: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 24,
    color: '#555',
  },
  btnAdicionar: {
    alignSelf: 'flex-start',
    marginTop: 6,
    marginLeft: -2,
  },
  opcoesConfigItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#D1D7DC',
    width: '100%',
  },
  modalFundoOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    backgroundColor: '#EAEAEA',
    width: '80%',
    borderRadius: 30,
    paddingHorizontal: 25,
    paddingTop: 25,
    paddingBottom: 30,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  modalTitle: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 32,
    color: BLUE_COLOR,
    textAlign: 'center',
    lineHeight: 34,
    marginBottom: 20,
    width: '90%',
  },
  modalInput: {
    backgroundColor: '#D1D7DC',
    width: '100%',
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#A0A8B0',
    paddingHorizontal: 15,
    fontFamily: 'Homenaje_400Regular',
    fontSize: 22,
    color: '#000',
    marginBottom: 12,
  },
  linkAnexar: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 20,
    color: BLUE_COLOR,
    textDecorationLine: 'underline',
    alignSelf: 'flex-start',
    marginTop: 2,
    marginBottom: 25,
  },
  modalBtnContainer: {
    width: '100%',
    alignItems: 'center',
  }
});