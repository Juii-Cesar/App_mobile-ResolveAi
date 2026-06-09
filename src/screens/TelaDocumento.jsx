import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import LogoIcon from '../assets/icons/LogoIcon';
import { Button } from '../components/Button';
import IdentidadeIcon from '../components/Identidade';
import { useRegistration } from "../context/RegistrationContext";

const BLUE_COLOR = '#076BDE';

export default function TelaDocumento({ navigation }) {
  const { formData } = useRegistration();

  const handleTirarFoto = () => {
  navigation.navigate('TelaCameraDocumento');
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
          Tire uma foto do seu documento de identidade (RG ou CNH)
        </Text>

        <Text style={styles.sectionTitle}>O que fazer:</Text>

        <View style={styles.instrucoesContainer}>
          <Text style={styles.textoInstrucao}>
            • 1: Retire o documento do plástico e posicione-o em uma superfície plana e bem iluminada.
          </Text>
          <Text style={styles.textoInstrucao}>
            • 2: Certifique-se de que todos os dados, especialmente o CPF e a foto, estejam nítidos e sem reflexos de luz.
          </Text>
          <Text style={styles.textoInstrucao}>
            • 3: Não envie fotos de fotocópias, documentos escaneados ou fotos de outras telas.
          </Text>
          <Text style={styles.textoInstrucao}>
            • 4: Não corte as bordas do documento e evite cobrir as informações com os dedos.
          </Text>
        </View>

        <View style={styles.imageContainer}>
          <IdentidadeIcon width={300} height={120} />
        </View>

        <Text style={styles.textoConfidencial}>
          Seus dados são totalmente confidenciais. Eles serão utilizados exclusivamente para a verificação de segurança da plataforma e não serão expostos no seu perfil público.
        </Text>

        <View style={styles.buttonContainer}>
          <Button 
            title="Tirar foto" 
            onPress={handleTirarFoto} 
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
  sectionTitle: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 26,
    color: '#333',
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  instrucoesContainer: { width: '100%', gap: 8, marginBottom: 20 },
  textoInstrucao: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 18,
    color: '#444',
    lineHeight: 22,
  },
  imageContainer: {
    width: '100%',
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
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
  buttonContainer: { width: '100%', alignItems: 'center', paddingBottom: 20 }
});