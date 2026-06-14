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
  ActivityIndicator 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useServico } from '../context/ServicoContext';
import { supabase } from '../services/supabase';

const BLUE_COLOR = '#076BDE';

const PRIORIDADES = [
  { label: 'Urgente', cor: '#D32F2F', icone: 'warning-outline' },
  { label: 'Alta',    cor: '#F57C00', icone: 'alert-circle-outline' },
  { label: 'Normal',  cor: '#388E3C', icone: 'checkmark-circle-outline' },
];

export default function TelaInformarProblema({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const categoriaSelecionada = route?.params?.categoria ?? '';
  const { servicoAtivo } = useServico();
  const [descricao, setDescricao] = useState('');
  const [prioridade, setPrioridade] = useState(null);
  const [comentario, setComentario] = useState('');
  const [endereco, setEndereco] = useState('');
  const [mostrarComentario, setMostrarComentario] = useState(false);
  const [mostrarEndereco, setMostrarEndereco] = useState(false);
  const [enderecosSalvos, setEnderecosSalvos] = useState([]);
  const [buscandoEnderecos, setBuscandoEnderecos] = useState(false);
  const [buscaFeita, setBuscaFeita] = useState(false);

  const podeContinuar = descricao.trim().length > 0 && prioridade !== null && !servicoAtivo && endereco.trim().length > 0;

  function handleContinuar() {
    if (servicoAtivo) return;
    navigation.replace('TelaBuscarProfissional', {
      descricao,
      prioridade: PRIORIDADES[prioridade].label,
      comentario,
      endereco,
      categoria: categoriaSelecionada,
    });
  }

  async function carregarEnderecos() {
    setBuscandoEnderecos(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('enderecos_cliente') 
        .select('*')
        .eq('idcliente', user.id);

      if (data) {
        setEnderecosSalvos(data);
      } else if (error) {
        console.log('Erro do Supabase ao buscar endereços:', error);
      }
    } catch (error) {
      console.log('Erro geral ao buscar endereços:', error);
    } finally {
      setBuscandoEnderecos(false);
      setBuscaFeita(true);
    }
  }

  function toggleEndereco() {
    if (servicoAtivo) return;
    const vaiAbrir = !mostrarEndereco;
    setMostrarEndereco(vaiAbrir);
    
    if (vaiAbrir && !buscaFeita) {
      carregarEnderecos();
    }
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.btnVoltar}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 30 }]} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={20} color="#555" />
            <Text style={styles.searchText} numberOfLines={1}>
              {categoriaSelecionada || 'Pesquisa do usuário'}
            </Text>
          </View>

          {servicoAtivo && (
            <TouchableOpacity style={styles.bannerServicoAtivo} onPress={() => navigation.navigate('TelaChat', servicoAtivo.routeParams)} activeOpacity={0.85}>
              <View style={styles.bannerEsquerda}>
                <View style={styles.badgePonto} />
                <View>
                  <Text style={styles.bannerTitulo}>Você já tem um serviço ativo</Text>
                  <Text style={styles.bannerSub}>{servicoAtivo.profissionalNome} · {servicoAtivo.categoria}</Text>
                </View>
              </View>
              <Ionicons name="chatbubble-ellipses-outline" size={24} color={BLUE_COLOR} />
            </TouchableOpacity>
          )}

          <Text style={styles.titulo}>Precisando de um{'\n'}
            <Text style={styles.tituloDestaque}>{categoriaSelecionada ? `(${categoriaSelecionada})` : '(Pesquisa)'}</Text> ?
          </Text>

          <Text style={styles.subtitulo}>preencha as informações abaixo{'\n'}para localizarmos{'\n'}um profissional{'\n'}pra você</Text>

          <View style={styles.divisor} />

          <TextInput
            style={[styles.input, servicoAtivo && styles.inputBloqueado]}
            placeholder="Insira uma breve descrição do problema"
            placeholderTextColor="#999"
            value={descricao}
            onChangeText={setDescricao}
            multiline
            numberOfLines={3}
            editable={!servicoAtivo}
          />

          <View style={styles.prioridadeContainer}>
            <Text style={styles.prioridadeLabel}>Selecione a prioridade do seu serviço</Text>
            <View style={styles.prioridadeOpcoes}>
              {PRIORIDADES.map((p, i) => (
                <TouchableOpacity
                  key={i}
                  style={[styles.prioridadeBtn, prioridade === i && { backgroundColor: p.cor, borderColor: p.cor }, servicoAtivo && styles.prioridadeBtnBloqueado]}
                  onPress={() => !servicoAtivo && setPrioridade(i)}
                  disabled={!!servicoAtivo}
                >
                  <Ionicons name={p.icone} size={20} color={prioridade === i ? '#FFF' : servicoAtivo ? '#CCC' : p.cor} />
                  <Text style={[styles.prioridadeBtnText, prioridade === i && { color: '#FFF' }, servicoAtivo && { color: '#CCC' }]}>{p.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity style={styles.addBtn} onPress={() => !servicoAtivo && setMostrarComentario(!mostrarComentario)} disabled={!!servicoAtivo}>
            <Ionicons name={mostrarComentario ? 'remove-circle-outline' : 'add-circle-outline'} size={24} color={servicoAtivo ? '#CCC' : '#555'} />
            <Text style={[styles.addBtnText, servicoAtivo && { color: '#CCC' }]}>Add. comentário</Text>
          </TouchableOpacity>

          {mostrarComentario && !servicoAtivo && (
            <TextInput style={[styles.input, { marginTop: 8 }]} placeholder="Comentário adicional..." placeholderTextColor="#999" value={comentario} onChangeText={setComentario} multiline />
          )}

          <TouchableOpacity style={styles.addBtn} onPress={toggleEndereco} disabled={!!servicoAtivo}>
            <Ionicons name={mostrarEndereco ? 'remove-circle-outline' : 'add-circle-outline'} size={24} color={servicoAtivo ? '#CCC' : '#555'} />
            <Text style={[styles.addBtnText, servicoAtivo && { color: '#CCC' }]}>Add. endereço</Text>
          </TouchableOpacity>

          {mostrarEndereco && !servicoAtivo && (
            <View style={styles.enderecoContainer}>
              <Text style={styles.prioridadeLabel}>Escolha um endereço salvo:</Text>
              
              {buscandoEnderecos ? (
                <ActivityIndicator size="small" color={BLUE_COLOR} style={{ marginVertical: 10 }} />
              ) : (
                <View style={styles.listaEnderecos}>
                  {enderecosSalvos.length > 0 ? (
                    enderecosSalvos.map((end) => {
                      const textoEndereco = end.endereco_completo || end.rua || end.titulo || 'Endereço sem nome';
                      const isSelecionado = endereco === textoEndereco;

                      return (
                        <TouchableOpacity
                          key={end.id}
                          style={[styles.enderecoCard, isSelecionado && styles.enderecoCardAtivo]}
                          onPress={() => setEndereco(textoEndereco)}
                          activeOpacity={0.7}
                        >
                          <Ionicons 
                            name={isSelecionado ? "radio-button-on" : "radio-button-off"} 
                            size={24} 
                            color={isSelecionado ? BLUE_COLOR : '#7A8A9E'} 
                          />
                          <Text style={[styles.enderecoText, isSelecionado && styles.enderecoTextAtivo]}>
                            {textoEndereco}
                          </Text>
                        </TouchableOpacity>
                      );
                    })
                  ) : (
                    <View style={styles.semEnderecoBox}>
                      <Ionicons name="location-outline" size={20} color="#999" />
                      <Text style={styles.semEnderecoTexto}>Nenhum endereço salvo encontrado.</Text>
                    </View>
                  )}
                </View>
              )}

              <Text style={[styles.prioridadeLabel, { marginTop: 15 }]}>Ou digite um novo endereço:</Text>
              <TextInput 
                style={[styles.input, { marginTop: 5 }]} 
                placeholder="Ex: Rua das Flores, 123" 
                placeholderTextColor="#999" 
                value={endereco} 
                onChangeText={setEndereco} 
              />
            </View>
          )}

          <TouchableOpacity 
            style={[styles.btnContinuar, !podeContinuar && styles.btnContinuarDisabled]} 
            onPress={handleContinuar} 
            disabled={!podeContinuar}
            activeOpacity={0.8}
          >
            <Text style={styles.btnContinuarText}>{servicoAtivo ? 'Serviço em andamento' : 'Continuar'}</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#D9D9D9' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 10 },
  btnVoltar: { width: 44, height: 44, borderRadius: 22, backgroundColor: BLUE_COLOR, justifyContent: 'center', alignItems: 'center' },
  scroll: { paddingHorizontal: 25, paddingTop: 10 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 20, paddingHorizontal: 15, height: 45, borderWidth: 1.5, borderColor: '#A0A8B0', marginBottom: 20 },
  searchText: { marginLeft: 10, color: '#444', fontSize: 20, flex: 1, fontFamily: 'Homenaje_400Regular' },
  bannerServicoAtivo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#EEF4FF', borderRadius: 14, borderWidth: 1.5, borderColor: BLUE_COLOR, paddingHorizontal: 15, paddingVertical: 15, marginBottom: 20 },
  bannerEsquerda: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  badgePonto: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#388E3C' },
  bannerTitulo: { fontFamily: 'Homenaje_400Regular', fontSize: 20, color: '#111' },
  bannerSub: { fontFamily: 'Homenaje_400Regular', fontSize: 16, color: '#555' },
  titulo: { fontSize: 36, lineHeight: 38, color: '#111', fontFamily: 'Homenaje_400Regular' },
  tituloDestaque: { fontSize: 36, color: '#111', fontFamily: 'Homenaje_400Regular' },
  subtitulo: { marginTop: 15, fontSize: 18, lineHeight: 22, color: '#555', fontFamily: 'Homenaje_400Regular' },
  divisor: { width: 50, height: 6, backgroundColor: '#000', borderRadius: 3, alignSelf: 'center', marginVertical: 20 },
  input: { backgroundColor: '#FFF', borderRadius: 15, borderWidth: 1.5, borderColor: '#A8B7C1', paddingHorizontal: 15, paddingVertical: 15, fontSize: 20, color: '#333', marginBottom: 15, fontFamily: 'Homenaje_400Regular' },
  inputBloqueado: { opacity: 0.45 },
  prioridadeContainer: { marginBottom: 15 },
  prioridadeLabel: { fontSize: 20, color: '#7A8A9E', fontFamily: 'Homenaje_400Regular', marginBottom: 10 },
  prioridadeOpcoes: { flexDirection: 'column', gap: 10 },
  prioridadeBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 15, borderRadius: 15, borderWidth: 1.5, borderColor: '#A8B7C1', backgroundColor: '#FFF' },
  prioridadeBtnBloqueado: { opacity: 0.45 },
  prioridadeBtnText: { marginLeft: 10, fontSize: 22, color: '#555', fontFamily: 'Homenaje_400Regular' },
  addBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  addBtnText: { marginLeft: 10, fontSize: 22, color: '#7A8A9E', fontFamily: 'Homenaje_400Regular' },
  enderecoContainer: { width: '100%', marginTop: 5, backgroundColor: '#EAEAEA', padding: 15, borderRadius: 15, borderWidth: 1, borderColor: '#CCC' },
  listaEnderecos: { gap: 8 },
  enderecoCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', paddingHorizontal: 15, paddingVertical: 15, borderRadius: 12, borderWidth: 1.5, borderColor: '#A8B7C1' },
  enderecoCardAtivo: { borderColor: BLUE_COLOR, backgroundColor: '#EEF4FF' },
  enderecoText: { marginLeft: 10, fontFamily: 'Homenaje_400Regular', fontSize: 20, color: '#555', flex: 1 },
  enderecoTextAtivo: { color: '#111' },
  semEnderecoBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 15, borderStyle: 'dashed', borderWidth: 1, borderColor: '#A8B7C1', borderRadius: 12 },
  semEnderecoTexto: { fontFamily: 'Homenaje_400Regular', fontSize: 18, color: '#999', marginLeft: 8 },

  btnContinuar: { alignSelf: 'center', width: '80%', height: 55, borderRadius: 28, backgroundColor: BLUE_COLOR, justifyContent: 'center', alignItems: 'center', marginTop: 25 },
  btnContinuarDisabled: { backgroundColor: '#A8B7C1', borderWidth: 1.5, borderColor: '#111' },
  btnContinuarText: { color: '#FFF', fontSize: 28, fontFamily: 'Homenaje_400Regular' },
});