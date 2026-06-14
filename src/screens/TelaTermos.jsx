import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import LogoIcon from '../assets/icons/LogoIcon';
import { Button } from '../components/Button';
import { useRegistration } from "../context/RegistrationContext";

const BLUE_COLOR = '#076BDE';
const GRAY_LINE = '#CCCCCC';

export default function TelaTermos({ navigation, route }) {
  const { formData, updateFormData } = useRegistration();

  const documentosLidos = formData.documentosLidos || [];

  const [modalAviso, setModalAviso] = useState({ visible: false, titulo: '', mensagem: '' });

  const fecharAviso = () => setModalAviso({ visible: false, titulo: '', mensagem: '' });

  useEffect(() => {
    if (route.params?.documentoLidoId) {
      const idLido = route.params.documentoLidoId;

      if (!documentosLidos.includes(idLido)) {
        updateFormData({ documentosLidos: [...documentosLidos, idLido] });
      }

      navigation.setParams({ documentoLidoId: undefined });
    }
  }, [route.params?.documentoLidoId]);

  const itensTermos = [
    { id: 'uso', titulo: 'Termos de Uso do Profissional' },
    { id: 'privacidade', titulo: 'Política de Privacidade e Dados' },
    { id: 'conduta', titulo: 'Código de Conduta e Segurança' },
  ];

  const leuTodos = documentosLidos.length === itensTermos.length;

  const handleAceitarTermos = () => {
    if (!leuTodos) {
      setModalAviso({
        visible: true,
        titulo: 'Atenção',
        mensagem: 'Você precisa abrir e ler todos os documentos listados antes de aceitar.',
      });
      return;
    }

    updateFormData({ termosAceitos: true });
    navigation.navigate('TelaVerificacao');
  };

  const handleAbrirDocumento = (id) => {
    navigation.navigate('TelaTextoTermos', { id });
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={32} color="#000" />
        </TouchableOpacity>
        <LogoIcon width={45} height={45} fill={BLUE_COLOR} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Termos e condições</Text>
        <Text style={styles.subtitle}>
          Para garantir a segurança jurídica, abra e leia cada um dos documentos abaixo antes de aceitar.
        </Text>

        <View style={styles.listContainer}>
          {itensTermos.map((item) => {
            const jaLeu = documentosLidos.includes(item.id);
            return (
              <TouchableOpacity
                key={item.id}
                style={styles.listItem}
                onPress={() => handleAbrirDocumento(item.id)}
              >
                <View style={styles.rowItemLeft}>
                  {jaLeu && (
                    <Ionicons
                      name="checkmark-circle"
                      size={28}
                      color={BLUE_COLOR}
                      style={{ marginRight: 10 }}
                    />
                  )}
                  <Text style={[styles.itemText, jaLeu && { color: '#666' }]}>
                    {item.titulo}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#000" />
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Li e aceito os termos"
          onPress={handleAceitarTermos}
          disabled={!leuTodos}
        />
      </View>

      <Modal visible={modalAviso.visible} transparent animationType="fade" onRequestClose={fecharAviso}>
        <View style={styles.overlay}>
          <View style={styles.modalAvisoCard}>
            <Text style={styles.modalAvisoTitulo}>{modalAviso.titulo}:</Text>
            <Text style={styles.modalAvisoMensagem}>{modalAviso.mensagem}</Text>
            <TouchableOpacity style={styles.btnAvisoOk} onPress={fecharAviso}>
              <Text style={styles.btnAvisoOkTexto}>Ok</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DBDBDB'
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingTop: 15
  },
  scrollContent: {
    paddingHorizontal: 25,
    paddingTop: 20
  },
  title: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 36,
    color: '#000',
    marginBottom: 10
  },
  subtitle: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 18,
    color: '#555',
    lineHeight: 22,
    marginBottom: 30
  },
  listContainer: {
    borderTopWidth: 1,
    borderColor: GRAY_LINE,
    marginBottom: 30
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderColor: GRAY_LINE
  },
  rowItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 10
  },
  itemText: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 24,
    color: '#000',
    flexShrink: 1
  },
  footer: {
    paddingHorizontal: 25,
    paddingBottom: 25,
    alignItems: 'center'
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalAvisoCard: {
    width: 280,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  modalAvisoTitulo: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 32,
    color: BLUE_COLOR,
    lineHeight: 34,
    marginBottom: 10,
  },
  modalAvisoMensagem: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 22,
    color: '#111',
    lineHeight: 26,
    marginBottom: 22,
  },
  btnAvisoOk: {
    width: '100%',
    height: 48,
    backgroundColor: BLUE_COLOR,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnAvisoOkTexto: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 22,
    color: '#FFF',
  },
});