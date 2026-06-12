import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { logout } from "../services/auth";

export default function TelaMinhaConta() {
  const navigation = useNavigation();

  const [telefone, setTelefone] = useState('');
  const [email, setEmail]       = useState('');
  const [nome, setNome]         = useState('Nome');
  const [foto, setFoto]         = useState(null);

  const [modalPerfilVisivel, setModalPerfilVisivel] = useState(false);
  const [editandoNome, setEditandoNome]             = useState(false);
  const [nomeTemp, setNomeTemp]                     = useState('');

  async function escolherFoto() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à sua galeria.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      setFoto(result.assets[0].uri);
    }
  }

  function salvarNome() {
    if (nomeTemp.trim()) setNome(nomeTemp.trim());
    setEditandoNome(false);
  }

  function salvarConta() {
    Alert.alert('Salvo', 'Informações atualizadas com sucesso!');
  }

  function sair() {
    Alert.alert('Sair', 'Deseja sair da sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: async () => await logout() },
    ]);
  }

  function excluirConta() {
    Alert.alert('Excluir conta', 'Tem certeza? Esta ação não pode ser desfeita.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => navigation.navigate('Abertura') },
    ]);
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('TelaConta')} style={styles.botaoVoltar}>
          <Ionicons name="chevron-back" size={22} color="#1565C0" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <Text style={styles.titulo}>Minha conta</Text>
        <Text style={styles.subtitulo}>
          Olá, usuário{'\n'}bem vindo ao{'\n'}painel conta atualize{'\n'}suas informações
        </Text>

        <Text style={styles.label}>Telefone:</Text>
        <TextInput
          style={styles.input}
          placeholder="Telefone..."
          placeholderTextColor="#B5B5B5"
          value={telefone}
          onChangeText={setTelefone}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>E-mail:</Text>
        <TextInput
          style={styles.input}
          placeholder="E-mail..."
          placeholderTextColor="#B5B5B5"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TouchableOpacity style={styles.botaoContinuar} onPress={salvarConta}>
          <Text style={styles.botaoContinuarTexto}>Continuar</Text>
        </TouchableOpacity>

        <View style={styles.botoesPerigo}>
          <TouchableOpacity style={styles.botaoSair} onPress={sair}>
            <Text style={styles.botaoPerigoTexto}>Sair</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.botaoExcluir} onPress={excluirConta}>
            <Text style={styles.botaoPerigoTexto}>Excluir conta</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      <Modal
        visible={modalPerfilVisivel}
        transparent
        animationType="fade"
        onRequestClose={() => setModalPerfilVisivel(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalPerfilVisivel(false)}
        >
          <View style={styles.modalBox} onStartShouldSetResponder={() => true}>

            <Text style={styles.modalTitulo}>Altere seu perfil de usuário</Text>
            <View style={styles.fotoContainer}>
              <TouchableOpacity style={styles.fotoCirculo} onPress={escolherFoto}>
                {foto ? (
                  <Image source={{ uri: foto }} style={styles.fotoImagem} />
                ) : (
                  <Ionicons name="person-outline" size={48} color="#555" />
                )}
              </TouchableOpacity>
              <TouchableOpacity onPress={escolherFoto}>
                <Text style={styles.linkEditar}>Editar</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.nomeRow}>
              {editandoNome ? (
                <TextInput
                  style={styles.nomeInput}
                  value={nomeTemp}
                  onChangeText={setNomeTemp}
                  onSubmitEditing={salvarNome}
                  autoFocus
                  returnKeyType="done"
                />
              ) : (
                <Text style={styles.nomeTexto}>{nome}</Text>
              )}
              <TouchableOpacity
                onPress={() => {
                  if (editandoNome) {
                    salvarNome();
                  } else {
                    setNomeTemp(nome);
                    setEditandoNome(true);
                  }
                }}
              >
                <Text style={styles.linkEditar}>
                  {editandoNome ? 'Salvar' : 'Editar'}
                </Text>
              </TouchableOpacity>
            </View>

          </View>
        </TouchableOpacity>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#D9D9D9',
  },

  header: {
    height: 60,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },

  botaoVoltar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1976D2',
    justifyContent: 'center',
    alignItems: 'center',
  },

  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  titulo: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 58,
    color: '#1976D2',
    lineHeight: 58,
    marginBottom: 8,
  },

  subtitulo: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 24,
    color: '#111',
    lineHeight: 24,
    marginBottom: 18,
  },

  label: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 26,
    color: '#1976D2',
    marginBottom: 4,
  },

  input: {
    height: 44,
    backgroundColor: '#EFEFEF',
    borderWidth: 1,
    borderColor: '#C8C8C8',
    borderRadius: 6,
    paddingHorizontal: 10,
    marginBottom: 14,

    fontFamily: 'Homenaje_400Regular',
    fontSize: 22,
    color: '#444',
  },

  botaoContinuar: {
    backgroundColor: '#1976D2',
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 20,
    height: 42,

    justifyContent: 'center',
    alignItems: 'center',

    marginTop: 8,
    marginBottom: 14,
  },

  botaoContinuarTexto: {
    fontFamily: 'Homenaje_400Regular',
    color: '#FFF',
    fontSize: 26,
  },

  botoesPerigo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },

  botaoSair: {
    flex: 1,
    backgroundColor: '#D50000',
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 20,
    height: 40,

    justifyContent: 'center',
    alignItems: 'center',
  },

  botaoExcluir: {
    flex: 1,
    backgroundColor: '#D50000',
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 20,
    height: 40,

    justifyContent: 'center',
    alignItems: 'center',
  },

  botaoPerigoTexto: {
    fontFamily: 'Homenaje_400Regular',
    color: '#FFF',
    fontSize: 22,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingTop: 80,
    paddingLeft: 10,
  },

  modalBox: {
    width: 230,
    backgroundColor: '#FFF',

    borderRadius: 16,

    borderTopWidth: 5,
    borderTopColor: '#1976D2',

    padding: 16,
  },

  modalTitulo: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 26,
    color: '#1976D2',
    marginBottom: 12,
  },

  fotoContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },

  fotoCirculo: {
    width: 100,
    height: 100,
    borderRadius: 50,

    borderWidth: 1,
    borderColor: '#888',

    backgroundColor: '#ECECEC',

    justifyContent: 'center',
    alignItems: 'center',

    overflow: 'hidden',
  },

  fotoImagem: {
    width: '100%',
    height: '100%',
  },

  linkEditar: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 20,
    color: '#1976D2',
    marginTop: 4,
  },

  nomeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  nomeTexto: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 32,
    color: '#111',
  },

  nomeInput: {
    flex: 1,

    fontFamily: 'Homenaje_400Regular',
    fontSize: 30,

    borderBottomWidth: 1,
    borderBottomColor: '#1976D2',

    marginRight: 10,
    color: '#111',
  },
});