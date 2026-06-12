import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function TelaCarteira() {
  const navigation = useNavigation();
  const [cartoes, setCartoes] = useState([]);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [modalExcluirVisivel, setModalExcluirVisivel] = useState(false);
  const [cartaoSelecionado, setCartaoSelecionado] = useState(null);
  const [modoEdicao, setModoEdicao] = useState(false);

  const [nomeCartao, setNomeCartao] = useState('');
  const [numero, setNumero] = useState('');
  const [vencimento, setVencimento] = useState('');
  const [nomeTitular, setNomeTitular] = useState('');

  function abrirModalCriacao() {
    setModoEdicao(false);
    setNomeCartao('');
    setNumero('');
    setVencimento('');
    setNomeTitular('');
    setModalVisivel(true);
  }

  function abrirModalEdicao(cartao) {
    setModoEdicao(true);
    setCartaoSelecionado(cartao);
    setNomeCartao(cartao.nomeCartao);
    setNumero(cartao.numero);
    setVencimento(cartao.vencimento);
    setNomeTitular(cartao.nomeTitular);
    setModalVisivel(true);
  }

  function confirmarExclusao(cartao) {
    setCartaoSelecionado(cartao);
    setModalExcluirVisivel(true);
  }

  function salvarCartao() {
    if (!nomeCartao.trim() || !numero.trim() || !vencimento.trim() || !nomeTitular.trim()) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }

    if (modoEdicao) {
      setCartoes(prev =>
        prev.map(c =>
          c.id === cartaoSelecionado.id
            ? { ...c, nomeCartao, numero, vencimento, nomeTitular }
            : c
        )
      );
    } else {
      const novo = {
        id: Date.now().toString(),
        nomeCartao,
        numero,
        vencimento,
        nomeTitular,
      };
      setCartoes(prev => [...prev, novo]);
    }

    setModalVisivel(false);
  }

  function excluirCartao() {
    setCartoes(prev => prev.filter(c => c.id !== cartaoSelecionado.id));
    setModalExcluirVisivel(false);
    setCartaoSelecionado(null);
  }

  function formatarNumero(text) {

    const digits = text.replace(/\D/g, '').slice(0, 16);

    const formatted = digits.replace(/(.{4})/g, '$1 ').trim();
    setNumero(formatted);
  }

  function formatarVencimento(text) {
    const digits = text.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) {
      setVencimento(digits.slice(0, 2) + '/' + digits.slice(2));
    } else {
      setVencimento(digits);
    }
  }

  function mascararNumero(numero) {
    const digits = numero.replace(/\s/g, '');
    if (digits.length < 4) return numero;
    return '**** **** **** ' + digits.slice(-4);
  }

  const renderCartao = ({ item }) => (
    <View style={styles.cartaoItem}>
      <View style={styles.cartaoInfo}>
        <Text style={styles.cartaoNome}>{item.nomeCartao}</Text>
        <Text style={styles.cartaoNumero}>{mascararNumero(item.numero)}</Text>
      </View>
      <View style={styles.cartaoAcoes}>
        <TouchableOpacity onPress={() => abrirModalEdicao(item)}>
          <Text style={styles.linkEditar}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => confirmarExclusao(item)}>
          <Text style={styles.linkExcluir}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>

        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.botaoVoltar}>
            <Ionicons name="chevron-back" size={22} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitulo}>Carteira</Text>
          <TouchableOpacity onPress={abrirModalCriacao} style={styles.botaoAdicionar}>
            <Ionicons name="add" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        {cartoes.length === 0 ? (
          <View style={styles.vazioContainer}>
            <Text style={styles.vazioTitulo}>
              Adicione{'\n'}
              um{'\n'}
              Cartão  
            </Text>
          </View>
        ) : (
          <FlatList
            data={cartoes}
            keyExtractor={item => item.id}
            renderItem={renderCartao}
            contentContainerStyle={styles.lista}
            showsVerticalScrollIndicator={false}
          />
        )}

      </View>


      <Modal
        visible={modalVisivel}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisivel(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.modalBox}>
            <Text style={styles.modalTitulo}>
              {modoEdicao ? 'Editando Cartão:' : 'Adicionando Cartão:'}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Nome cartão..."
              placeholderTextColor="#aaa"
              value={nomeCartao}
              onChangeText={setNomeCartao}
            />
            <TextInput
              style={styles.input}
              placeholder="Número..."
              placeholderTextColor="#aaa"
              value={numero}
              onChangeText={formatarNumero}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Vencimento"
              placeholderTextColor="#aaa"
              value={vencimento}
              onChangeText={formatarVencimento}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Nome titular..."
              placeholderTextColor="#aaa"
              value={nomeTitular}
              onChangeText={setNomeTitular}
            />

            <TouchableOpacity style={styles.botaoContinuar} onPress={salvarCartao}>
              <Text style={styles.botaoContinuarTexto}>
                {modoEdicao ? 'Salvar' : 'Continuar'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setModalVisivel(false)} style={styles.botaoCancelar}>
              <Text style={styles.botaoCancelarTexto}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal
        visible={modalExcluirVisivel}
        transparent
        animationa="fade"
        onRequestClose={() => setModalExcluirVisivel(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitulo}>
              Deseja excluir o cartão:{'\n'}
              <Text style={styles.modalNomeDestaque}>
                {cartaoSelecionado?.nomeCartao}
              </Text>
            </Text>

            <View style={styles.botoesConfirmacao}>
              <TouchableOpacity style={styles.botaoSim} onPress={excluirCartao}>
                <Text style={styles.botaoSimTexto}>Sim</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.botaoNao}
                onPress={() => setModalExcluirVisivel(false)}
              >
                <Text style={styles.botaoNaoTexto}>Não</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#EEE',
  },

  container: {
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 90,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  botaoVoltar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#005FEA',
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerTitulo: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 22,
    color: '#9FB0C0',
  },

  botaoAdicionar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0066D6',
    justifyContent: 'center',
    alignItems: 'center',
  },

  lista: {
    paddingBottom: 30,
  },

  cartaoItem: {
    backgroundColor: '#EAEAEA',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  cartaoInfo: {
    flex: 1,
  },

  cartaoNome: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 22,
    color: '#111',
  },

  cartaoNumero: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 18,
    color: '#6b6a6a',
    marginTop: 4,
  },

  cartaoAcoes: {
    alignItems: 'flex-end',
  },

  linkEditar: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 18,
    color: '#A6B7D8',
    marginBottom: 2,
  },

  linkExcluir: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 18,
    color: '#A6B7D8',
  },

    vazioContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 100,
  },

  vazioTitulo: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 42,
    color: '#98A3AD',
    textAlign: 'center',
    lineHeight: 42,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalBox: {
    width: '90%',
    maxWidth: 340,
    backgroundColor: '#F1F1F1',
    borderRadius: 18,
    padding: 18,
  },

  modalTitulo: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 34,
    color: '#1565C0',
    marginBottom: 14,
    lineHeight: 34,
  },

  modalNomeDestaque: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 30,
    color: '#1565C0',
  },

  input: {
    height: 40,
    backgroundColor: '#DCDCDC',
    borderRadius: 6,
    marginBottom: 8,
    paddingHorizontal: 10,
    fontFamily: 'Homenaje_400Regular',
    fontSize: 18,
    color: '#444',
  },

  botaoContinuar: {
    height: 34,
    backgroundColor: '#1565C0',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
  },

  botaoContinuarTexto: {
    color: '#FFF',
    fontFamily: 'Homenaje_400Regular',
    fontSize: 20,
  },
  
  botaoCancelar: {
    marginTop: 8,
    alignItems: 'center',
  },

  botaoCancelarTexto: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 18,
    color: '#666',
  },

  botoesConfirmacao: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 14,
    gap: 12,
  },

  botaoSim: {
    width: 80,
    height: 28,
    backgroundColor: '#1565C0',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },

  botaoSimTexto: {
    color: '#FFF',
    fontFamily: 'Homenaje_400Regular',
    fontSize: 18,
  },

  botaoNao: {
    width: 80,
    height: 28,
    backgroundColor: '#A9A9A9',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },

  botaoNaoTexto: {
    color: '#FFF',
    fontFamily: 'Homenaje_400Regular',
    fontSize: 18,
  },
});