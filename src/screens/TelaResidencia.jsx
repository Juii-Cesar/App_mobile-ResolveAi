import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import LogoIcon from '../assets/icons/LogoIcon';
import { Button } from '../components/Button';

const BLUE_COLOR = '#076BDE';
const GRAY_BOX = '#C4CCD4';

export default function TelaResidencia({ navigation }) {
  const handleAvancar = (metodo) => {
    console.log(`Comprovante enviado via: ${metodo}`);

    navigation.navigate('TelaVerificacao', { residenciaConcluida: true });
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
        
        <Text style={styles.title}>
          Envie seu comprovante de Residência
        </Text>

        <View style={styles.boxDocumento}>
          <Ionicons name="document-text-outline" size={60} color="#7A8A9E" />
        </View>

        <Text style={styles.sectionTitle}>O que fazer:</Text>

        <View style={styles.instrucoesContainer}>
          <Text style={styles.textoInstrucao}>
            • 1: Contas de luz, água, gás, internet ou faturas de cartão de crédito são aceitas.
          </Text>
          <Text style={styles.textoInstrucao}>
            • 2: O documento precisa ter sido emitido há, no máximo, 3 meses.
          </Text>
          <Text style={styles.textoInstrucao}>
            • 3: O comprovante deve estar em seu nome ou no nome de parentes de 1º grau (pais ou cônjuge).
          </Text>
          <Text style={styles.textoInstrucao}>
            • 4: Confira se o seu nome, endereço completo e a data da fatura estão totalmente visíveis, legíveis e sem desfoques.
          </Text>
        </View>

        <Text style={styles.textoExtra}>
          Comprovantes digitais (em PDF) ou prints inteiros da tela também são aceitos.
        </Text>

        <View style={styles.buttonGroup}>

          <TouchableOpacity 
            style={styles.botaoCinza} 
            onPress={() => handleAvancar('upload_arquivo')}
          >
            <Text style={styles.textoBotaoCinza}>Enviar documento</Text>
          </TouchableOpacity>

          <Button 
            title="Tirar foto" 
            onPress={() => handleAvancar('camera')} 
          />
        </View>

      </ScrollView>
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
    paddingTop: 15,
  },
  scrollContent: { 
    paddingHorizontal: 25, 
    paddingTop: 20,
    alignItems: 'center'
  },
  title: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 34,
    color: '#000',
    textAlign: 'left',
    width: '100%',
    lineHeight: 38,
    marginBottom: 15,
  },
  boxDocumento: {
    width: '100%',
    height: 180,
    backgroundColor: GRAY_BOX,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 26,
    color: '#333',
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  instrucoesContainer: {
    width: '100%',
    gap: 8,
    marginBottom: 15,
  },
  textoInstrucao: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 18,
    color: '#444',
    lineHeight: 22,
  },
  textoExtra: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 17,
    color: '#333',
    textAlign: 'left',
    width: '100%',
    lineHeight: 20,
    marginBottom: 25,
  },
  buttonGroup: {
    width: '100%',
    alignItems: 'center',
    gap: 12,
    paddingBottom: 20,
  },
  botaoCinza: {
    backgroundColor: '#A6A6A6',
    width: 260,
    height: 45,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#000',
  },
  textoBotaoCinza: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 24,
    color: '#000',
  }
});