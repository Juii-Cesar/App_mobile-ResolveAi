import React, { useState } from "react";
import { StyleSheet, View, Text, Image, Modal, TouchableOpacity, ActivityIndicator } from "react-native";
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
  const [modalAviso, setModalAviso] = useState({ visible: false, titulo: '', mensagem: '', tipo: 'default', onOk: null });

  const fecharAviso = () => {
    const cb = modalAviso.onOk;
    setModalAviso({ visible: false, titulo: '', mensagem: '', tipo: 'default', onOk: null });
    if (cb) cb();
  };

  const handleTirarFoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      setModalAviso({
        visible: true,
        titulo: 'Permissão necessária',
        mensagem: 'Precisamos de acesso à câmera para você fotografar o documento.',
        tipo: 'default',
        onOk: null,
      });
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

      setModalAviso({
        visible: true,
        titulo: 'Sucesso!',
        mensagem: 'Cadastro concluído. Seja bem-vindo!',
        tipo: 'default',
        onOk: () => navigation.replace("Tabs"),
      });

    } catch (error) {
      console.error("Erro no cadastro de cliente:", error);
      setModalAviso({
        visible: true,
        titulo: 'Ops!',
        mensagem: 'Ocorreu um problema ao finalizar seu cadastro. ' + error.message,
        tipo: 'danger',
        onOk: null,
      });
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
            <Button title="Tirar foto" onPress={handleTirarFoto} />
          )}
        </View>
      </View>

      <Modal visible={modalAviso.visible} transparent animationType="fade" onRequestClose={fecharAviso}>
        <View style={styles.overlay}>
          <View style={styles.modalAvisoCard}>
            <Text style={[styles.modalAvisoTitulo, modalAviso.tipo === 'danger' && styles.modalAvisoTituloDanger]}>
              {modalAviso.titulo}:
            </Text>
            <Text style={styles.modalAvisoMensagem}>{modalAviso.mensagem}</Text>
            <TouchableOpacity style={styles.btnAvisoOk} onPress={fecharAviso}>
              <Text style={styles.btnAvisoOkTexto}>Ok</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  modalAvisoTituloDanger: {
    color: '#D32F2F',
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