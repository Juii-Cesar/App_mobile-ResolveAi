import React, { useState } from "react";
import { StyleSheet, View, Text, Image, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { File } from 'expo-file-system';
import { decode } from 'base64-arraybuffer';

import { useUserType } from "../context/UserTypeContext";
import { useRegistration } from "../context/RegistrationContext";
import { Button } from "../components/Button";
import { supabase } from '../services/supabase';

const BLUE_COLOR = "#076BDE";

export const TelaQuaseLa = () => {
  const navigation = useNavigation();
  const { accountType } = useUserType();
  const { formData, updateFormData } = useRegistration();
  
  const [isLoading, setIsLoading] = useState(false);

  const handleTirarFoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permissão necessária", "Precisamos de acesso à câmera para você fotografar o documento.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'], 
        quality: 0.7,
    });

    if (!result.canceled) {
      const photoUri = result.assets[0].uri;

      updateFormData({ documentoCliente: photoUri });

      finalizarCadastroCliente(photoUri);
    }
  };

  const finalizarCadastroCliente = async (photoUri) => {
    setIsLoading(true);
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error("Usuário não encontrado. Faça login novamente.");

      const nomeCompleto = formData.nome ? `${formData.nome} ${formData.sobrenome || ''}`.trim() : 'Cliente';

      const { error: erroUsuario } = await supabase
        .from('usuarios')
        .upsert({
          id: user.id,
          nome: nomeCompleto,
          cpf: formData.cpf,
          tipo: 'cliente',
          statuscadastro: 'aprovado'
        });

      if (erroUsuario) throw new Error("Erro ao criar usuário: " + erroUsuario.message);

      const localFile = new File(photoUri);
      const base64 = await localFile.base64();
      const fileExt = photoUri.split('.').pop() || 'jpg';
      const fileName = `${user.id}/doc_cliente_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('documentos-sigilosos')
        .upload(fileName, decode(base64), { 
          contentType: fileExt === 'png' ? 'image/png' : 'image/jpeg',
          upsert: true 
        });

      if (uploadError) throw new Error("Erro no upload da foto: " + uploadError.message);

      Alert.alert("Sucesso!", "Cadastro concluído. Seja bem-vindo!");
      navigation.replace("Tabs");

    } catch (error) {
      console.error("Erro no cadastro de cliente:", error);
      Alert.alert("Ops!", "Ocorreu um problema ao finalizar seu cadastro. " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom", "left", "right"]}>
      <View style={styles.header}>
        <SafeAreaView edges={["top"]} />
        <Text style={styles.quaseLaContainer}>Quase lá</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>
          Tire uma foto do seu{"\n"}documento de identidade{"\n"}(RG ou CNH)
        </Text>
        <Text style={styles.subTitle}>O que fazer:</Text>
        <View style={styles.infos}>
          <Text style={styles.instructions}>
            1: Retire o documento do plástico e{"\n"}posicione-o em uma superfície
            plana e{"\n"}bem iluminada.{"\n"}
            {"\n"}2: Certifique-se de que todos os dados,{"\n"}especialmente o CPF
            e a foto, estejam{"\n"}nítidos e sem reflexos de luz.{"\n"}
            {"\n"}3: Não envie fotos de fotocópias,{"\n"}documentos escaneados ou
            fotos de{"\n"}outras telas.{"\n"}
            {"\n"}4: Não corte as bordas do documento e{"\n"}evite cobrir as
            informações com os dedos.
          </Text>
          <Image source={require("../assets/img/exIdentidade.png")} />
        </View>
        <Text style={styles.securityWarning}>
          Seus dados são totalmente confidenciais. Eles serão{"\n"}utilizados
          exclusivamente para a verificação de segurança{"\n"}da plataforma e
          não serão expostos no seu perfil público.
        </Text>

        <View style={{ marginTop: 20, width: '100%', alignItems: 'center' }}>
          {isLoading ? (
            <View style={{ alignItems: 'center' }}>
              <ActivityIndicator size="large" color={BLUE_COLOR} />
              <Text style={{ marginTop: 10, color: BLUE_COLOR, fontWeight: 'bold' }}>Finalizando seu cadastro...</Text>
            </View>
          ) : (
            <Button
              title="Tirar foto"
              onPress={handleTirarFoto}
            />
          )}
        </View>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#DBDBDB" 
  },
  header: { 
    backgroundColor: BLUE_COLOR, 
    height: 220, 
    alignItems: "center" 
  },
  quaseLaContainer: { 
    marginTop: 40, 
    fontSize: 50, 
    fontFamily: "Homenaje_400Regular", 
    color: "#fff" 
  },
  content: { 
    flex: 1, 
    backgroundColor: "#DBDBDB", 
    marginTop: -80, 
    borderTopLeftRadius: 100, 
    alignItems: "center", 
    paddingTop: 24, 
    gap: 12 
  },
  title: { 
    fontFamily: "Homenaje_400Regular", 
    fontSize: 24, 
    color: BLUE_COLOR, 
    textAlign: "left" 
  },
  subTitle: { 
    color: "#404040", 
    fontFamily: "Homenaje_400Regular", 
    fontSize: 16, 
    alignSelf: "flex-start", 
    marginLeft: "5%" 
  },
  infos: { 
    gap: 8, 
    alignItems: 'center' 
  },
  instructions: { 
    color: "#404040", 
    fontFamily: "Homenaje_400Regular", 
    fontSize: 16 
  },
  securityWarning: { 
    color: "#404040", 
    fontFamily: "Homenaje_400Regular", 
    fontSize: 12, 
    textAlign: 'center' 
  },
});