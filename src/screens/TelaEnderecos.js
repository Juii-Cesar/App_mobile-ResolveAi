import React, { useState } from 'react';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useFonts, Homenaje_400Regular } from '@expo-google-fonts/homenaje';

export default function TelaEnderecos() {

  const [fontsLoaded] = useFonts({
    Homenaje_400Regular
  });

  const navigation = useNavigation();
  const [enderecos, setEnderecos] = useState([]);
  const [modalAdicionar, setModalAdicionar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalExcluir, setModalExcluir] = useState(false);
  const [enderecoSelecionado, setEnderecoSelecionado] = useState(null);

  const [form, setForm] = useState({
    nome: '',
    cep: '',
    rua: '',
    numero: '',
    complemento: '',
  });

  if (!fontsLoaded) {
    return null;
  }

  const resetForm = () =>
    setForm({ nome: '', cep: '', rua: '', numero: '', complemento: '' });

  const handleAdicionar = () => {
    if (!form.nome.trim()) return;
    setEnderecos((prev) => [...prev, { id: Date.now(), ...form }]);
    resetForm();
    setModalAdicionar(false);
  };

  const abrirEditar = (endereco) => {
    setEnderecoSelecionado(endereco);
    setForm({
      nome: endereco.nome,
      cep: endereco.cep,
      rua: endereco.rua,
      numero: endereco.numero,
      complemento: endereco.complemento,
    });
    setModalEditar(true);
  };

  const handleEditar = () => {
    setEnderecos((prev) =>
      prev.map((e) =>
        e.id === enderecoSelecionado.id ? { ...e, ...form } : e
      )
    );
    resetForm();
    setEnderecoSelecionado(null);
    setModalEditar(false);
  };

  const abrirExcluir = (endereco) => {
    setEnderecoSelecionado(endereco);
    setModalExcluir(true);
  };

  const handleExcluir = () => {
    setEnderecos((prev) => prev.filter((e) => e.id !== enderecoSelecionado.id));
    setEnderecoSelecionado(null);
    setModalExcluir(false);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => navigation?.goBack()}
        >
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => {
            resetForm();
            setModalAdicionar(true);
          }}
        >
          <Ionicons name="add" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {enderecos.length === 0 ? (
        <View style={styles.vazioContainer}>
          <Text style={styles.vazioTexto}>Adicione{'\n'}um{'\n'}Endereço</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.listaContainer}
          showsVerticalScrollIndicator={false}
        >
          {enderecos.map((endereco) => (
            <View key={endereco.id} style={styles.enderecoCard}>
              <Text style={styles.enderecoNome}>{endereco.nome}</Text>
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

      <Modal
        visible={modalAdicionar}
        transparent
        animationType="fade"
        onRequestClose={() => setModalAdicionar(false)}
      >
        <ModalFormulario
          titulo="Adicionando endereço:"
          form={form}
          setForm={setForm}
          onConfirmar={handleAdicionar}
          onFechar={() => setModalAdicionar(false)}
        />
      </Modal>

      <Modal
        visible={modalEditar}
        transparent
        animationType="fade"
        onRequestClose={() => setModalEditar(false)}
      >
        <ModalFormulario
          titulo="Editando endereço:"
          form={form}
          setForm={setForm}
          onConfirmar={handleEditar}
          onFechar={() => setModalEditar(false)}
        />
      </Modal>
      <Modal
        visible={modalExcluir}
        transparent
        animationType="fade"
        onRequestClose={() => setModalExcluir(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.modalExcluirCard}>
            <Text style={styles.modalExcluirTexto}>
              Deseja excluir o endereço:{'\n'}
              <Text style={styles.modalExcluirNome}>
                {enderecoSelecionado?.nome}
              </Text>
            </Text>
            <View style={styles.modalExcluirBotoes}>
              <TouchableOpacity
                style={styles.btnSim}
                onPress={handleExcluir}
              >
                <Text style={styles.btnSimTexto}>Sim</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnNao}
                onPress={() => setModalExcluir(false)}
              >
                <Text style={styles.btnNaoTexto}>Não</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function ModalFormulario({ titulo, form, setForm, onConfirmar, onFechar }) {
  return (
    <KeyboardAvoidingView
      style={styles.overlay}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.modalCard}>
        <Text style={styles.modalTitulo}>{titulo}</Text>

        <CampoTexto
          placeholder="Nome endereço..."
          value={form.nome}
          onChangeText={(v) => setForm((f) => ({ ...f, nome: v }))}
        />
        <CampoTexto
          placeholder="CEP..."
          value={form.cep}
          onChangeText={(v) => setForm((f) => ({ ...f, cep: v }))}
          keyboardType="numeric"
        />
        <CampoTexto
          placeholder="Rua..."
          value={form.rua}
          onChangeText={(v) => setForm((f) => ({ ...f, rua: v }))}
        />
        <CampoTexto
          placeholder="Número..."
          value={form.numero}
          onChangeText={(v) => setForm((f) => ({ ...f, numero: v }))}
          keyboardType="numeric"
        />
        <CampoTexto
          placeholder="Complemento..."
          value={form.complemento}
          onChangeText={(v) => setForm((f) => ({ ...f, complemento: v }))}
        />

        <TouchableOpacity style={styles.btnContinuar} onPress={onConfirmar}>
          <Text style={styles.btnContinuarTexto}>Continuar</Text>
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

safeArea:{
flex:1,
backgroundColor:"#D9D9D9"
},

header:{
flexDirection:"row",
justifyContent:"space-between",
paddingHorizontal:18,
paddingTop:8
},

headerBtn:{
width:34,
height:34,
borderRadius:20,
backgroundColor:"#005FEA",
justifyContent:"center",
alignItems:"center"
},

vazioContainer:{
flex:1,
justifyContent:"center",
alignItems:"center"
},

vazioTexto:{
fontSize:42,
textAlign:"center",
color:"#9FB0C0",
fontFamily:"Homenaje_400Regular",
lineHeight:52
},

listaContainer:{
paddingTop:16,
paddingBottom:120,
alignItems:"center"
},

enderecoCard:{
width:340,
minHeight:92,
backgroundColor:"#F3F3F3",
borderRadius:18,
paddingHorizontal:14,
paddingVertical:12,
marginBottom:16,
flexDirection:"row",
justifyContent:"space-between",
alignItems:"center"
},

enderecoNome:{
fontSize:24,
fontFamily:"Homenaje_400Regular",
color:"#000"
},

enderecoAcoes:{
alignItems:"flex-end"
},

acaoEditar:{
fontSize:18,
color:"#A7B7CC",
fontFamily:"Homenaje_400Regular"
},

acaoExcluir:{
fontSize:18,
color:"#A7B7CC",
fontFamily:"Homenaje_400Regular"
},

overlay:{
flex:1,
backgroundColor:"rgba(0,0,0,0.25)",
justifyContent:"center",
alignItems:"center"
},

modalCard:{
width:280,
backgroundColor:"#F3F3F3",
borderRadius:18,
padding:18,
alignItems:"center"
},

modalTitulo:{
fontSize:38,
alignSelf:"flex-start",
marginBottom:12,
lineHeight:38,
color:"#005FEA",
fontFamily:"Homenaje_400Regular"
},

input:{
width:"100%",
height:38,
backgroundColor:"#D9D9D9",
borderRadius:6,
paddingHorizontal:10,
marginBottom:10,
fontSize:18,
fontFamily:"Homenaje_400Regular",
color:"#000"
},

btnContinuar:{
width:"100%",
height:34,
backgroundColor:"#0066F5",
borderRadius:18,
justifyContent:"center",
alignItems:"center",
marginTop:4,
borderWidth:1
},

btnContinuarTexto:{
color:"#FFF",
fontSize:22,
fontFamily:"Homenaje_400Regular"
},

modalExcluirCard:{
width:280,
backgroundColor:"#F3F3F3",
borderRadius:18,
padding:18
},

modalExcluirTexto:{
fontSize:30,
color:"#005FEA",
fontFamily:"Homenaje_400Regular",
lineHeight:32
},

modalExcluirNome:{
color:"#005FEA",
fontFamily:"Homenaje_400Regular"
},

modalExcluirBotoes:{
flexDirection:"row",
justifyContent:"space-between",
marginTop:18
},

btnSim:{
width:90,
height:28,
backgroundColor:"#0066F5",
borderRadius:18,
justifyContent:"center",
alignItems:"center",
borderWidth:1
},

btnNao:{
width:90,
height:28,
backgroundColor:"#A0A0A0",
borderRadius:18,
justifyContent:"center",
alignItems:"center",
borderWidth:1
},

btnSimTexto:{
color:"#FFF",
fontSize:18,
fontFamily:"Homenaje_400Regular"
},

btnNaoTexto:{
color:"#FFF",
fontSize:18,
fontFamily:"Homenaje_400Regular"
}

});