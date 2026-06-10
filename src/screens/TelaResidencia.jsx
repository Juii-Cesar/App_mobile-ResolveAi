import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import LogoIcon from '../assets/icons/LogoIcon';
import { Button } from '../components/Button';
import { useRegistration } from "../context/RegistrationContext";

const BLUE_COLOR = '#076BDE';

export default function TelaResidencia({ navigation }) {
  const { updateFormData } = useRegistration();
  const [arquivo, setArquivo] = useState(null);

  const selecionarArquivo = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'], 
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        setArquivo(result.assets[0]);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível acessar os arquivos do dispositivo.');
    }
  };

  const handleConfirmar = () => {
    if (!arquivo) {
      Alert.alert('Atenção', 'Por favor, selecione um comprovante antes de continuar.');
      return;
    }

    updateFormData({ comprovanteResidencia: arquivo.uri });

    navigation.navigate('TelaVerificacao');
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
          Comprovante de Residência
        </Text>

        <Text style={styles.instructionText}>
          Precisamos de uma foto ou arquivo PDF (conta de luz, água, internet ou telefone) em seu nome ou de um familiar de 1º grau, emitido há no máximo 3 meses.
        </Text>

        <View style={styles.uploadContainer}>
          <MaterialCommunityIcons name="file-document-outline" size={80} color={BLUE_COLOR} />
          
          {arquivo ? (
            <View style={styles.arquivoSelecionado}>
              <Text style={styles.nomeArquivo} numberOfLines={2}>
                {arquivo.name}
              </Text>
              <TouchableOpacity onPress={() => setArquivo(null)}>
                <Text style={styles.removerTexto}>Remover arquivo</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.btnSelecionar} onPress={selecionarArquivo}>
              <Text style={styles.btnSelecionarTexto}>Selecionar Arquivo</Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.textoConfidencial}>
          Seus dados são confidenciais e usados apenas para confirmar sua área de atuação no aplicativo.
        </Text>

        <View style={styles.buttonContainer}>
          <Button 
            title="Confirmar Envio" 
            onPress={handleConfirmar} 
            disabled={!arquivo}
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#DBDBDB' },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingTop: 15,
  },
  scrollContent: { paddingHorizontal: 25, paddingTop: 20, alignItems: 'center' },
  title: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 34,
    color: '#000',
    textAlign: 'left',
    width: '100%',
    lineHeight: 38,
    marginBottom: 15,
  },
  instructionText: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 20,
    color: '#444',
    lineHeight: 24,
    marginBottom: 30,
    textAlign: 'left',
    width: '100%',
  },
  uploadContainer: {
    width: '100%',
    backgroundColor: '#EAEAEA',
    borderWidth: 2,
    borderColor: BLUE_COLOR,
    borderStyle: 'dashed',
    borderRadius: 15,
    padding: 30,
    alignItems: 'center',
    marginBottom: 30,
  },
  btnSelecionar: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: BLUE_COLOR,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 15,
  },
  btnSelecionarTexto: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 20,
    color: BLUE_COLOR,
  },
  arquivoSelecionado: {
    alignItems: 'center',
    marginTop: 15,
  },
  nomeArquivo: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  removerTexto: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 16,
    color: '#FF4D4D',
    textDecorationLine: 'underline',
  },
  textoConfidencial: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    lineHeight: 19,
    paddingHorizontal: 10,
    marginBottom: 25,
  },
  buttonContainer: { 
    width: '100%', 
    alignItems: 'center', 
    paddingBottom: 20 
  }
});