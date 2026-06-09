import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../components/Button';
import { useRegistration } from "../context/RegistrationContext";

const BLUE_COLOR = '#076BDE';

export default function TelaFotoPerfil({ navigation }) {
  const { updateFormData } = useRegistration();
  const [permission, requestPermission] = useCameraPermissions();
  const [foto, setFoto] = useState(null);
  const cameraRef = useRef(null);

  if (!permission) {
    return <View style={styles.containerEscuro} />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.containerAviso}>
        <Text style={styles.textoAviso}>Precisamos da sua permissão para abrir a câmera e tirar a foto de perfil.</Text>
        <TouchableOpacity style={styles.botaoPermissao} onPress={requestPermission}>
          <Text style={styles.textoBotaoPermissao}>Permitir Câmera</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const tirarFoto = async () => {
    if (cameraRef.current) {
      const options = { quality: 0.7, skipProcessing: false };
      const data = await cameraRef.current.takePictureAsync(options);
      setFoto(data.uri);
    }
  };

  return (
    <SafeAreaView style={styles.containerEscuro}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={32} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tire sua foto</Text>
        <View style={{ width: 32 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.molduraContainer}>
          {!foto ? (
            <CameraView style={styles.camera} facing="front" ref={cameraRef}>
              <View style={styles.mascaraCirculo} />
            </CameraView>
          ) : (
            <Image source={{ uri: foto }} style={styles.previewFoto} />
          )}
        </View>

        {!foto ? (
          <View style={styles.instrucoesContainer}>
            <Text style={styles.textoInstrucao}>• Busque um lugar bem iluminado.</Text>
            <Text style={styles.textoInstrucao}>• Evite usar boné, touca ou óculos escuros.</Text>
            <Text style={styles.textoInstrucao}>• Fique de frente para a câmera.</Text>
          </View>
        ) : (
          <Text style={styles.textoSucesso}>Ficou excelente! Deseja usar esta foto?</Text>
        )}

        <View style={styles.actionContainer}>
          {!foto ? (
            <TouchableOpacity style={styles.botaoCapturar} onPress={tirarFoto}>
              <View style={styles.circuloInterno} />
            </TouchableOpacity>
          ) : (
            <View style={styles.botoesConfirmacao}>
              <TouchableOpacity style={styles.botaoRefazer} onPress={() => setFoto(null)}>
                <Text style={styles.textoRefazer}>Refazer</Text>
              </TouchableOpacity>
              
              <Button 
                title="Confirmar" 
                onPress={() => {
                  updateFormData({ fotoPerfil: foto }); 
                  navigation.navigate('TelaVerificacao', { fotoConcluida: true });
                }} 
              />
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  containerEscuro: { 
    flex: 1, 
    backgroundColor: '#121212' 
  },
  containerAviso: { 
    flex: 1, 
    backgroundColor: '#121212', 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 30 
  },
  textoAviso: { 
    fontFamily: 'Homenaje_400Regular', 
    fontSize: 24, 
    color: '#FFF', 
    textAlign: 'center', 
    marginBottom: 20 
  },
  botaoPermissao: { 
    backgroundColor: BLUE_COLOR, 
    paddingVertical: 12, 
    paddingHorizontal: 25, 
    borderRadius: 15 
  },
  textoBotaoPermissao: { 
    fontFamily: 'Homenaje_400Regular', 
    fontSize: 22, 
    color: '#FFF' 
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingTop: 10 
  },
  headerTitle: { 
    fontFamily: 'Homenaje_400Regular', 
    fontSize: 28, 
    color: '#FFF' 
  },
  content: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'space-around', 
    paddingVertical: 20 
  },
  molduraContainer: { 
    width: 280, 
    height: 280, 
    borderRadius: 140, 
    borderWidth: 4, 
    borderColor: BLUE_COLOR, 
    overflow: 'hidden', 
    backgroundColor: '#000' 
  },
  camera: { 
    flex: 1 
  },
  mascaraCirculo: { 
    flex: 1, 
    backgroundColor: 'transparent' 
  },
  previewFoto: { 
    flex: 1, 
    resizeMode: 'cover' 
  },
  instrucoesContainer: { 
    width: '80%', 
    gap: 8 
  },
  textoInstrucao: { 
    fontFamily: 'Homenaje_400Regular', 
    fontSize: 20, 
    color: '#D9DFE3' 
  },
  textoSucesso: { 
    fontFamily: 'Homenaje_400Regular', 
    fontSize: 24, 
    color: '#FFF', 
    textAlign: 'center' 
  },
  actionContainer: { 
    width: '100%', 
    alignItems: 'center', 
    height: 110, 
    justifyContent: 'center' 
  },
  botaoCapturar: { 
    width: 84, 
    height: 84, 
    borderRadius: 42, 
    borderWidth: 4, 
    borderColor: '#FFF', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  circuloInterno: { 
    width: 66, 
    height: 66, 
    borderRadius: 33, 
    backgroundColor: '#FFF' 
  },
  botoesConfirmacao: { 
    alignItems: 'center', 
    gap: 12 
  },
  botaoRefazer: { 
    paddingVertical: 5 
  },
  textoRefazer: { 
    fontFamily: 'Homenaje_400Regular', 
    fontSize: 22, 
    color: '#FF4D4D', 
    textDecorationLine: 'underline' 
  },
});