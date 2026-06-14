import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useFonts, Homenaje_400Regular } from '@expo-google-fonts/homenaje';
import { supabase } from '../services/supabase';

const BLUE_COLOR = '#076BDE';

export default function TelaEnderecos() {
  const [fontsLoaded] = useFonts({
    Homenaje_400Regular
  });

  const navigation = useNavigation();
  const [enderecos, setEnderecos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [modalAdicionar, setModalAdicionar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalExcluir, setModalExcluir] = useState(false);
  const [enderecoSelecionado, setEnderecoSelecionado] = useState(null);
  const [modalAviso, setModalAviso] = useState({ visible: false, titulo: '', mensagem: '', tipo: 'default' });

  const [form, setForm] = useState({
    nome: '',
    cep: '',
    rua: '',
    numero: '',
    complemento: '',
  });

  const fecharAviso = () => setModalAviso({ visible: false, titulo: '', mensagem: '', tipo: 'default' });

  useEffect(() => {
    carregarEnderecos();
  }, []);

  async function carregarEnderecos() {
    setCarregando(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('enderecos_cliente')
        .select('*')
        .eq('idcliente', user.id)
        .order('created_at', { ascending: false });

      if (data) setEnderecos(data);
    } catch (error) {
      console.log('Erro ao carregar endereços:', error);
    } finally {
      setCarregando(false);
    }
  }

  if (!fontsLoaded) return null;

  const resetForm = () =>
    setForm({ nome: '', cep: '', rua: '', numero: '', complemento: '' });

  const handleAdicionar = async () => {
    if (!form.nome.trim() || !form.rua.trim()) {
      setModalAviso({ visible: true, titulo: 'Atenção', mensagem: 'Preencha pelo menos o nome e a rua.', tipo: 'default' });
      return;
    }

    const enderecoCompletoStr = `${form.rua}, ${form.numero}${form.complemento ? ' - ' + form.complemento : ''} - CEP: ${form.cep}`;

    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { data, error } = await supabase.from('enderecos_cliente').insert({
        idcliente: user.id,
        titulo: form.nome,
        endereco_completo: enderecoCompletoStr,
        cep: form.cep,
        rua: form.rua,
        numero: form.numero,
        complemento: form.complemento
      }).select().single();

      if (data) {
        setEnderecos((prev) => [data, ...prev]);
        resetForm();
        setModalAdicionar(false);
      }
    } catch (error) {
      setModalAviso({ visible: true, titulo: 'Erro', mensagem: 'Não foi possível salvar o endereço.', tipo: 'danger' });
    }
  };

  const abrirEditar = (endereco) => {
    setEnderecoSelecionado(endereco);
    setForm({
      nome: endereco.titulo || '',
      cep: endereco.cep || '',
      rua: endereco.rua || '',
      numero: endereco.numero || '',
      complemento: endereco.complemento || '',
    });
    setModalEditar(true);
  };

  const handleEditar = async () => {
    if (!form.nome.trim() || !form.rua.trim()) return;

    const enderecoCompletoStr = `${form.rua}, ${form.numero}${form.complemento ? ' - ' + form.complemento : ''} - CEP: ${form.cep}`;

    try {
      const { data, error } = await supabase.from('enderecos_cliente').update({
        titulo: form.nome,
        endereco_completo: enderecoCompletoStr,
        cep: form.cep,
        rua: form.rua,
        numero: form.numero,
        complemento: form.complemento
      }).eq('id', enderecoSelecionado.id).select().single();

      if (data) {
        setEnderecos((prev) => prev.map((e) => (e.id === enderecoSelecionado.id ? data : e)));
        resetForm();
        setEnderecoSelecionado(null);
        setModalEditar(false);
      }
    } catch (error) {
      setModalAviso({ visible: true, titulo: 'Erro', mensagem: 'Não foi possível editar o endereço.', tipo: 'danger' });
    }
  };

  const abrirExcluir = (endereco) => {
    setEnderecoSelecionado(endereco);
    setModalExcluir(true);
  };

  const handleExcluir = async () => {
    try {
      const { error } = await supabase.from('enderecos_cliente').delete().eq('id', enderecoSelecionado.id);

      if (!error) {
        setEnderecos((prev) => prev.filter((e) => e.id !== enderecoSelecionado.id));
        setEnderecoSelecionado(null);
        setModalExcluir(false);
      }
    } catch (error) {
      setModalAviso({ visible: true, titulo: 'Erro', mensagem: 'Não foi possível excluir o endereço.', tipo: 'danger' });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.btnVoltar} onPress={() => navigation?.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnVoltar} onPress={() => { resetForm(); setModalAdicionar(true); }}>
          <Ionicons name="add" size={26} color="#fff" />
        </TouchableOpacity>
      </View>

      {carregando ? (
        <View style={styles.vazioContainer}>
          <ActivityIndicator size="large" color={BLUE_COLOR} />
        </View>
      ) : enderecos.length === 0 ? (
        <View style={styles.vazioContainer}>
          <Text style={styles.vazioTexto}>Adicione{'\n'}um{'\n'}Endereço</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.listaContainer} showsVerticalScrollIndicator={false}>
          {enderecos.map((endereco) => (
            <View key={endereco.id} style={styles.enderecoCard}>
              <View style={styles.enderecoInfo}>
                <Text style={styles.enderecoNome}>{endereco.titulo}</Text>
                <Text style={styles.enderecoCompleto} numberOfLines={2}>
                  {endereco.endereco_completo}
                </Text>
              </View>

              <View style={styles.enderecoAcoes}>
                <TouchableOpacity onPress={() => abrirEditar(endereco)}>
                  <Text style={styles.acaoEditar}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => abrirExcluir(endereco)}>
                  <Text style={styles.acaoExcluir}>Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      <Modal visible={modalAdicionar} transparent animationType="fade" onRequestClose={() => setModalAdicionar(false)}>
        <ModalFormulario
          titulo="Adicionando endereço:"
          form={form}
          setForm={setForm}
          onConfirmar={handleAdicionar}
          onFechar={() => setModalAdicionar(false)}
        />
      </Modal>

      <Modal visible={modalEditar} transparent animationType="fade" onRequestClose={() => setModalEditar(false)}>
        <ModalFormulario
          titulo="Editando endereço:"
          form={form}
          setForm={setForm}
          onConfirmar={handleEditar}
          onFechar={() => setModalEditar(false)}
        />
      </Modal>

      <Modal visible={modalExcluir} transparent animationType="fade" onRequestClose={() => setModalExcluir(false)}>
        <View style={styles.overlay}>
          <View style={styles.modalExcluirCard}>
            <Text style={styles.modalExcluirTexto}>
              Deseja excluir o endereço:{'\n'}
              <Text style={styles.modalExcluirNome}>{enderecoSelecionado?.titulo}</Text>
            </Text>
            <View style={styles.modalExcluirBotoes}>
              <TouchableOpacity style={styles.btnSim} onPress={handleExcluir}>
                <Text style={styles.btnSimTexto}>Sim</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnNao} onPress={() => setModalExcluir(false)}>
                <Text style={styles.btnNaoTexto}>Não</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
}

function ModalFormulario({ titulo, form, setForm, onConfirmar, onFechar }) {
  return (
    <KeyboardAvoidingView style={styles.overlay} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.modalCard}>
        <TouchableOpacity style={styles.btnCloseModal} onPress={onFechar}>
          <Ionicons name="close" size={24} color="#999" />
        </TouchableOpacity>

        <Text style={styles.modalTitulo}>{titulo}</Text>

        <CampoTexto placeholder="Nome do local (Ex: Casa)" value={form.nome} onChangeText={(v) => setForm((f) => ({ ...f, nome: v }))} />
        <CampoTexto placeholder="CEP..." value={form.cep} onChangeText={(v) => setForm((f) => ({ ...f, cep: v }))} keyboardType="numeric" />
        <CampoTexto placeholder="Rua..." value={form.rua} onChangeText={(v) => setForm((f) => ({ ...f, rua: v }))} />
        <CampoTexto placeholder="Número..." value={form.numero} onChangeText={(v) => setForm((f) => ({ ...f, numero: v }))} keyboardType="numeric" />
        <CampoTexto placeholder="Complemento..." value={form.complemento} onChangeText={(v) => setForm((f) => ({ ...f, complemento: v }))} />

        <TouchableOpacity style={styles.btnContinuar} onPress={onConfirmar}>
          <Text style={styles.btnContinuarTexto}>Salvar</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

function CampoTexto({ placeholder, value, onChangeText, keyboardType }) {
  return (
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor="#aaa"
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType || 'default'}
    />
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#D9D9D9'
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10
  },
  btnVoltar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: BLUE_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vazioContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  vazioTexto: {
    fontSize: 42,
    textAlign: "center",
    color: "#9FB0C0",
    fontFamily: "Homenaje_400Regular",
    lineHeight: 52
  },
  listaContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 120,
  },
  enderecoCard: {
    width: '100%',
    minHeight: 92,
    backgroundColor: "#F3F3F3",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: '#A8B7C1'
  },
  enderecoInfo: {
    flex: 1,
    paddingRight: 15,
  },
  enderecoNome: {
    fontSize: 24,
    fontFamily: "Homenaje_400Regular",
    color: "#111"
  },
  enderecoCompleto: {
    fontSize: 16,
    fontFamily: "Homenaje_400Regular",
    color: "#555",
    marginTop: 2
  },
  enderecoAcoes: {
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 8
  },
  acaoEditar: {
    fontSize: 18,
    color: BLUE_COLOR,
    fontFamily: "Homenaje_400Regular"
  },
  acaoExcluir: {
    fontSize: 18,
    color: "#D32F2F",
    fontFamily: "Homenaje_400Regular"
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center"
  },
  modalCard: {
    width: 300,
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5
  },
  btnCloseModal: {
    position: 'absolute',
    top: 10,
    right: 15,
    padding: 5
  },
  modalTitulo: {
    fontSize: 32,
    alignSelf: "flex-start",
    marginBottom: 16,
    marginTop: 10,
    lineHeight: 34,
    color: BLUE_COLOR,
    fontFamily: "Homenaje_400Regular"
  },
  input: {
    width: "100%",
    height: 44,
    backgroundColor: "#F0F0F0",
    borderRadius: 10,
    paddingHorizontal: 14,
    marginBottom: 12,
    fontSize: 18,
    fontFamily: "Homenaje_400Regular",
    color: "#000",
    borderWidth: 1,
    borderColor: '#CCC'
  },
  btnContinuar: {
    width: "100%",
    height: 48,
    backgroundColor: BLUE_COLOR,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  btnContinuarTexto: {
    color: "#FFF",
    fontSize: 24,
    fontFamily: "Homenaje_400Regular"
  },
  modalExcluirCard: {
    width: 280,
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5
  },
  modalExcluirTexto: {
    fontSize: 26,
    color: "#111",
    fontFamily: "Homenaje_400Regular",
    lineHeight: 28,
    textAlign: 'center'
  },
  modalExcluirNome: {
    color: BLUE_COLOR,
    fontFamily: "Homenaje_400Regular"
  },
  modalExcluirBotoes: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 25
  },
  btnSim: {
    width: 100,
    height: 40,
    backgroundColor: BLUE_COLOR,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  btnNao: {
    width: 100,
    height: 40,
    backgroundColor: "#A0A0A0",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  btnSimTexto: {
    color: "#FFF",
    fontSize: 20,
    fontFamily: "Homenaje_400Regular"
  },
  btnNaoTexto: {
    color: "#FFF",
    fontSize: 20,
    fontFamily: "Homenaje_400Regular"
  },
  modalAvisoCard: {
    width: 280,
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  modalAvisoTitulo: {
    fontFamily: "Homenaje_400Regular",
    fontSize: 32,
    color: BLUE_COLOR,
    lineHeight: 34,
    marginBottom: 10,
  },
  modalAvisoTituloDanger: {
    color: '#D32F2F',
  },
  modalAvisoMensagem: {
    fontFamily: "Homenaje_400Regular",
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
    fontFamily: "Homenaje_400Regular",
    fontSize: 22,
    color: '#FFF',
  },
});