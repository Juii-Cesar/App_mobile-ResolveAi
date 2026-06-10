import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import LogoIcon from '../assets/icons/LogoIcon';
import { Button } from '../components/Button';
import { useRegistration } from "../context/RegistrationContext";

const BLUE_COLOR = '#076BDE';

export default function TelaPortfolio({ navigation }) {
  const { updateFormData, formData } = useRegistration();
  const [imagens, setImagens] = useState(formData.portfolio || []);

  const selecionarImagens = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de acesso às suas fotos para montar seu portfólio.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      const novasUris = result.assets.map(asset => asset.uri);
      setImagens([...imagens, ...novasUris]);
    }
  };

  const removerImagem = (uri) => {
    setImagens(imagens.filter(item => item !== uri));
  };

  const handleConfirmar = () => {
    updateFormData({ portfolio: imagens });
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

      <View style={styles.content}>
        <Text style={styles.title}>Fotos de Serviços Anteriores</Text>
        <Text style={styles.subtitle}>(Opcional)</Text>
        
        <Text style={styles.instructionText}>
          Mostre o seu talento! Adicione fotos de trabalhos que você já realizou. Perfis com fotos de serviços recebem até 3x mais pedidos.
        </Text>

        <TouchableOpacity style={styles.btnUpload} onPress={selecionarImagens}>
          <MaterialCommunityIcons name="camera-plus" size={40} color={BLUE_COLOR} />
          <Text style={styles.btnUploadTexto}>Adicionar Fotos</Text>
        </TouchableOpacity>

        <FlatList
          data={imagens}
          keyExtractor={(item) => item}
          numColumns={3}
          contentContainerStyle={styles.grid}
          renderItem={({ item }) => (
            <View style={styles.imageWrapper}>
              <Image source={{ uri: item }} style={styles.thumbnail} />
              <TouchableOpacity style={styles.btnRemover} onPress={() => removerImagem(item)}>
                <Ionicons name="close-circle" size={24} color="#FF4D4D" />
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhuma foto adicionada ainda.</Text>
          }
        />

        <View style={styles.footer}>
          <Button 
            title={imagens.length > 0 ? "Salvar Portfólio" : "Pular por enquanto"} 
            onPress={handleConfirmar} 
          />
        </View>
      </View>
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
  content: { flex: 1, paddingHorizontal: 25, paddingTop: 20 },
  title: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 34,
    color: '#000',
    textAlign: 'left',
    lineHeight: 38,
  },
  subtitle: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 22,
    color: BLUE_COLOR,
    marginBottom: 10,
  },
  instructionText: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 18,
    color: '#555',
    lineHeight: 22,
    marginBottom: 20,
  },
  btnUpload: {
    width: '100%',
    height: 100,
    backgroundColor: '#EAEAEA',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: BLUE_COLOR,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  btnUploadTexto: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 22,
    color: BLUE_COLOR,
  },
  grid: {
    paddingBottom: 20,
  },
  imageWrapper: {
    flex: 1/3,
    aspectRatio: 1,
    padding: 5,
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  btnRemover: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FFF',
    borderRadius: 12,
  },
  emptyText: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  }
});