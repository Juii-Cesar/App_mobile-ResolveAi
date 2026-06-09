import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRegistration } from "../context/RegistrationContext";
import { Button } from '../components/Button';

export default function TelaCameraDocumento({ navigation }) {
  const { updateFormData } = useRegistration();
  const [etapa, setEtapa] = useState('frente');
  const [fotoFrente, setFotoFrente] = useState(null);
  const [fotoVerso, setFotoVerso] = useState(null);
  const cameraRef = useRef(null);

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      if (etapa === 'frente') setFotoFrente(photo.uri);
      else setFotoVerso(photo.uri);
    }
  };

  const proximaEtapa = () => {
    if (etapa === 'frente') {
      setEtapa('verso');
    } else {
      updateFormData({ docFrente: fotoFrente, docVerso: fotoVerso });
      navigation.navigate('TelaVerificacao');
    }
  };

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} ref={cameraRef} facing="back">
        <View style={styles.overlay}>
          <Text style={styles.textoEtapa}>Foto da {etapa === 'frente' ? 'FRENTE' : 'VERSO'}</Text>
        </View>
      </CameraView>

      <View style={styles.controles}>
        {!fotoFrente && etapa === 'frente' ? (
          <TouchableOpacity style={styles.btnCaptura} onPress={takePicture} />
        ) : !fotoVerso && etapa === 'verso' ? (
          <TouchableOpacity style={styles.btnCaptura} onPress={takePicture} />
        ) : (
          <Button title={etapa === 'frente' ? "Confirmar Frente" : "Finalizar"} onPress={proximaEtapa} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#000' 
},
  camera: { 
    flex: 0.8 
},
  overlay: { 
    flex: 1, 
    justifyContent: 'flex-start', 
    alignItems: 'center', 
    paddingTop: 50 
},
  textoEtapa: { 
    color: '#FFF', 
    fontSize: 24, 
    fontWeight: 'bold' 
},
  controles: { 
    flex: 0.2, 
    justifyContent: 'center', 
    alignItems: 'center' 
},
  btnCaptura: { 
    width: 70, 
    height: 70, 
    borderRadius: 35, 
    backgroundColor: '#FFF' 
},
});