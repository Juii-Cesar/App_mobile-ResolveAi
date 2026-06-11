import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const BLUE = '#076BDE';

const PRIORIDADES = [
  { label: 'Urgente', cor: '#D32F2F', icone: 'warning-outline' },
  { label: 'Alta',    cor: '#F57C00', icone: 'alert-circle-outline' },
  { label: 'Normal',  cor: '#388E3C', icone: 'checkmark-circle-outline' },
];

export default function TelaInformarProblema({ navigation, route }) {
  const categoriaSelecionada = route?.params?.categoria ?? '';

  const [descricao, setDescricao] = useState('');
  const [prioridade, setPrioridade] = useState(null);
  const [comentario, setComentario] = useState('');
  const [endereco, setEndereco] = useState('');
  const [mostrarComentario, setMostrarComentario] = useState(false);
  const [mostrarEndereco, setMostrarEndereco] = useState(false);

  const podeContinuar = descricao.trim().length > 0 && prioridade !== null;

  function handleContinuar() {
    navigation.navigate('TelaBuscarProfissional', {
      descricao,
      prioridade: PRIORIDADES[prioridade].label,
      comentario,
      endereco,
      categoria: categoriaSelecionada,
    });
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.btnVoltar}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnGlobo}>
          <Ionicons name="globe-outline" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >

          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={18} color="#555" />
            <Text style={styles.searchText} numberOfLines={1}>
              {categoriaSelecionada || 'Pesquisa do usuário'}
            </Text>
          </View>

          <Text style={styles.titulo}>
            Precisando de um{'\n'}
            <Text style={styles.tituloDestaque}>
              {categoriaSelecionada ? `(${categoriaSelecionada})` : '(Pesquisa)'}
            </Text>{' '}?
          </Text>

          <Text style={styles.subtitulo}>
            preencha as informações abaixo{'\n'}
            para localizarmos{'\n'}
            um profissional{'\n'}
            pra você
          </Text>

          <View style={styles.divisor} />


          <TextInput
            style={styles.input}
            placeholder="Insira uma breve descrição do problema"
            placeholderTextColor="#999"
            value={descricao}
            onChangeText={setDescricao}
            multiline
            numberOfLines={3}
          />

          <View style={styles.prioridadeContainer}>
            <Text style={styles.prioridadeLabel}>Selecione a prioridade do seu serviço</Text>
            <View style={styles.prioridadeOpcoes}>
              {PRIORIDADES.map((p, i) => (
                <TouchableOpacity
                  key={i}
                  style={[
                    styles.prioridadeBtn,
                    prioridade === i && { backgroundColor: p.cor, borderColor: p.cor },
                  ]}
                  onPress={() => setPrioridade(i)}
                >
                  <Ionicons
                    name={p.icone}
                    size={16}
                    color={prioridade === i ? '#FFF' : p.cor}
                  />
                  <Text
                    style={[
                      styles.prioridadeBtnText,
                      prioridade === i && { color: '#FFF' },
                    ]}
                  >
                    {p.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>


          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => setMostrarComentario(!mostrarComentario)}
          >
            <Ionicons
              name={mostrarComentario ? 'remove-circle-outline' : 'add-circle-outline'}
              size={20}
              color="#555"
            />
            <Text style={styles.addBtnText}>Add. comentário</Text>
          </TouchableOpacity>

          {mostrarComentario && (
            <TextInput
              style={[styles.input, { marginTop: 8 }]}
              placeholder="Comentário adicional..."
              placeholderTextColor="#999"
              value={comentario}
              onChangeText={setComentario}
              multiline
            />
          )}


          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => setMostrarEndereco(!mostrarEndereco)}
          >
            <Ionicons
              name={mostrarEndereco ? 'remove-circle-outline' : 'add-circle-outline'}
              size={20}
              color="#555"
            />
            <Text style={styles.addBtnText}>Add. endereço</Text>
          </TouchableOpacity>

          {mostrarEndereco && (
            <TextInput
              style={[styles.input, { marginTop: 8 }]}
              placeholder="Endereço do serviço..."
              placeholderTextColor="#999"
              value={endereco}
              onChangeText={setEndereco}
            />
          )}

          <TouchableOpacity
            style={[styles.btnContinuar, !podeContinuar && styles.btnContinuarDisabled]}
            onPress={handleContinuar}
            disabled={!podeContinuar}
          >
            <Text style={styles.btnContinuarText}>Continuar</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D9D9D9',
  },

  header: {
    height: 42,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 4,
  },

  btnVoltar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: BLUE,
    justifyContent: 'center',
    alignItems: 'center',
  },

  btnGlobo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: BLUE,
    justifyContent: 'center',
    alignItems: 'center',
  },

  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 0,
  },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEE',
    borderRadius: 20,
    paddingHorizontal: 14,
    height: 36,
    borderWidth: 1.5,
    borderColor: '#222',
    marginTop: -5,
    marginBottom: 10,
  },

  searchText: {
    marginLeft: 8,
    color: '#444',
    fontSize: 18,
    flex: 1,
    fontFamily: 'Homenaje_400Regular',
  },

  titulo: {
    fontSize: 34,
    lineHeight: 38,
    color: '#111',
    fontFamily: 'Homenaje_400Regular',
  },

  tituloDestaque: {
    fontSize: 34,
    color: '#111',
    fontFamily: 'Homenaje_400Regular',
  },

  subtitulo: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 18,
    color: '#555',
    fontFamily: 'Homenaje_400Regular',
  },

  divisor: {
    width: 40,
    height: 5,
    backgroundColor: '#000',
    borderRadius: 3,
    alignSelf: 'center',
    marginVertical: 12,
  },

  input: {
    backgroundColor: '#EEE',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#A8B7C1',
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 18,
    color: '#333',
    marginBottom: 12,
    fontFamily: 'Homenaje_400Regular',
  },

  prioridadeContainer: {
    marginBottom: 12,
  },

  prioridadeLabel: {
    fontSize: 18,
    color: '#9BA7B1',
    fontFamily: 'Homenaje_400Regular',
    marginBottom: 8,
  },

  prioridadeOpcoes: {
    flexDirection: 'column',
    gap: 8,
  },

  prioridadeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#A8B7C1',
    backgroundColor: '#EEE',
  },

  prioridadeBtnText: {
    marginLeft: 8,
    fontSize: 18,
    color: '#555',
    fontFamily: 'Homenaje_400Regular',
  },

  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },

  addBtnText: {
    marginLeft: 8,
    fontSize: 18,
    color: '#9BA7B1',
    fontFamily: 'Homenaje_400Regular',
  },

  btnContinuar: {
    alignSelf: 'center',
    width: '72%',
    height: 48,
    borderRadius: 24,
    backgroundColor: BLUE,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    borderWidth: 2,
    borderColor: '#111',
  },

  btnContinuarDisabled: {
    backgroundColor: '#9BA7B1',
  },

  btnContinuarText: {
    color: '#FFF',
    fontSize: 24,
    fontFamily: 'Homenaje_400Regular',
  },
});