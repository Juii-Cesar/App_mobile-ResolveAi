import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Modal, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LogoIcon from '../assets/icons/LogoIcon';
import { Button } from '../components/Button';
import { useUserType } from "../context/UserTypeContext";
import { useRegistration } from "../context/RegistrationContext";

const BLUE_COLOR = '#076BDE';

export default function TelaDadosPessoais({ navigation }) {
  const { accountType } = useUserType();
  const { updateFormData } = useRegistration();

  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [dataNasc, setDataNasc] = useState('');
  const [cpf, setCpf] = useState('');

  const [modalAviso, setModalAviso] = useState({ visible: false, titulo: '', mensagem: '' });

  const fecharAviso = () => setModalAviso({ visible: false, titulo: '', mensagem: '' });

  const formatarCPF = (text) => {
    let clean = text.replace(/\D/g, '');
    if (clean.length > 11) clean = clean.substring(0, 11);
    return clean
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2');
  };

  const formatarData = (text) => {
    let clean = text.replace(/\D/g, '');
    if (clean.length > 8) clean = clean.substring(0, 8);
    return clean
      .replace(/(\d{2})(\d)/, '$1/$2')
      .replace(/(\d{2})(\d)/, '$1/$2');
  };

  const validarCPF = (strCPF) => {
    let Soma = 0;
    let Resto;
    const str = strCPF.replace(/\D/g, '');
    if (str.length !== 11 || /^(\d)\1{10}$/.test(str)) return false;

    for (let i = 1; i <= 9; i++) Soma = Soma + parseInt(str.substring(i - 1, i)) * (11 - i);
    Resto = (Soma * 10) % 11;
    if ((Resto === 10) || (Resto === 11)) Resto = 0;
    if (Resto !== parseInt(str.substring(9, 10))) return false;

    Soma = 0;
    for (let i = 1; i <= 10; i++) Soma = Soma + parseInt(str.substring(i - 1, i)) * (12 - i);
    Resto = (Soma * 10) % 11;
    if ((Resto === 10) || (Resto === 11)) Resto = 0;
    if (Resto !== parseInt(str.substring(10, 11))) return false;
    return true;
  };

  const handleContinuar = () => {
    if (!nome.trim() || !sobrenome.trim() || !dataNasc.trim() || !cpf.trim()) {
      setModalAviso({
        visible: true,
        titulo: 'Atenção',
        mensagem: 'Por favor, preencha todos os campos antes de continuar.',
      });
      return;
    }

    if (nome.trim().length < 2 || sobrenome.trim().length < 2) {
      setModalAviso({
        visible: true,
        titulo: 'Atenção',
        mensagem: 'Por favor, insira um nome e sobrenome válidos.',
      });
      return;
    }

    if (dataNasc.length < 10) {
      setModalAviso({
        visible: true,
        titulo: 'Atenção',
        mensagem: 'Por favor, insira uma data de nascimento completa (DD/MM/AAAA).',
      });
      return;
    }

    if (!validarCPF(cpf)) {
      setModalAviso({
        visible: true,
        titulo: 'Atenção',
        mensagem: 'O CPF inserido não é válido. Por favor, verifique e tente novamente.',
      });
      return;
    }

    updateFormData({
      nome: nome.trim(),
      sobrenome: sobrenome.trim(),
      dataNasc,
      cpf
    });

    if (accountType === 'cliente') {
      navigation.navigate('TelaQuaseLa');
    } else {
      navigation.navigate('TelaEspecialidades');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} bounces={false}>
          <View style={styles.header}>
            <SafeAreaView edges={['top']} />
            <View style={styles.logoContainer}>
              <LogoIcon width={70} height={70} fill="#FFFFFF" />
            </View>
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>Conte-nos mais{"\n"}sobre você</Text>

            <View style={styles.inputGroup}>
              <TextInput
                style={styles.input}
                placeholder="Nome"
                placeholderTextColor="#666"
                value={nome}
                onChangeText={setNome}
                autoCapitalize="words"
              />
              <TextInput
                style={styles.input}
                placeholder="Sobrenome"
                placeholderTextColor="#666"
                value={sobrenome}
                onChangeText={setSobrenome}
                autoCapitalize="words"
              />
              <TextInput
                style={styles.input}
                placeholder="Data de nascimento"
                placeholderTextColor="#666"
                keyboardType="numeric"
                value={dataNasc}
                onChangeText={(t) => setDataNasc(formatarData(t))}
                maxLength={10}
              />
              <TextInput
                style={styles.input}
                placeholder="CPF"
                placeholderTextColor="#666"
                keyboardType="numeric"
                value={cpf}
                onChangeText={(t) => setCpf(formatarCPF(t))}
                maxLength={14}
              />
            </View>

            <Button title="Continuar" onPress={handleContinuar} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

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
  container: { flex: 1, backgroundColor: '#DBDBDB' },
  header: { backgroundColor: BLUE_COLOR, height: 260, alignItems: 'center' },
  logoContainer: {
    width: '100%',
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30
  },
  content: {
    flex: 1,
    backgroundColor: '#DBDBDB',
    marginTop: -80,
    borderTopLeftRadius: 100,
    paddingHorizontal: 30,
    alignItems: 'center',
    paddingTop: 60,
  },
  title: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 45,
    color: BLUE_COLOR,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 45,
  },
  inputGroup: { width: '100%', gap: 15, marginBottom: 40 },
  input: {
    backgroundColor: '#EAEAEA',
    height: 55,
    borderRadius: 10,
    paddingHorizontal: 20,
    fontSize: 18,
    fontFamily: 'Homenaje_400Regular',
    color: '#000',
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