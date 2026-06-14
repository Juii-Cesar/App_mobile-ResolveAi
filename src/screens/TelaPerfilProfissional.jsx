import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../services/supabase';
import * as WebBrowser from 'expo-web-browser';

const BLUE_COLOR = '#076BDE';
const CARD_BG = '#EAEAEA';

export default function TelaPerfilProfissional({ navigation, route }) {
  const { profissionalId, profissionalNome, profissionalFoto } = route.params ?? {};

  const [carregando, setCarregando] = useState(true);
  const [perfil, setPerfil] = useState(null);
  const [especialidadesAberta, setEspecialidadesAberta] = useState(false);

  useEffect(() => {
    async function carregarPerfil() {
      if (!profissionalId) {
        setCarregando(false);
        return;
      }

      try {
        const { data: usuario } = await supabase
          .from('usuarios')
          .select('nome, sobrenome, avaliacaomedia')
          .eq('id', profissionalId)
          .maybeSingle();

        const { data: documento } = await supabase
          .from('documentos_profissional')
          .select('fotoperfilurl')
          .eq('idprofissional', profissionalId)
          .maybeSingle();

        const { data: profissoes } = await supabase
          .from('profissoes_profissional')
          .select('profissao, tempo_experiencia, certificado_url')
          .eq('profissional_id', profissionalId);

        const { count: qtdServicos } = await supabase
          .from('servicos')
          .select('*', { count: 'exact', head: true })
          .eq('idprofissional', profissionalId)
          .eq('status', 'finalizado');

        const { data: fixados } = await supabase
          .from('avaliacoes')
          .select('id, comentario, nota, cliente:usuarios!idcliente(nome)')
          .eq('idprofissional', profissionalId)
          .eq('fixado', true)
          .limit(2);

        setPerfil({
          nome: usuario?.nome ?? profissionalNome ?? 'Profissional',
          sobrenome: usuario?.sobrenome ?? '',
          foto: documento?.fotoperfilurl ?? profissionalFoto ?? null,
          avaliacao: usuario?.avaliacaomedia ?? null,
          qtdServicos: qtdServicos ?? 0,
          especialidades: profissoes ?? [],
          fixados: fixados ?? [],
        });
      } catch (err) {
        console.log('ERRO GERAL AO CARREGAR PERFIL:', err);
        setPerfil({
          nome: profissionalNome ?? 'Profissional',
          sobrenome: '',
          foto: profissionalFoto ?? null,
          avaliacao: null,
          qtdServicos: 0,
          especialidades: [],
          fixados: [],
        });
      } finally {
        setCarregando(false);
      }
    }

    carregarPerfil();
  }, [profissionalId]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.btnVoltarRedondo} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Perfil Profissional</Text>
      </View>

      {carregando ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={BLUE_COLOR} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
        
          <View style={styles.card}>
            <View style={styles.perfilRow}>
              <View style={styles.avatarCirculo}>
                {perfil?.foto ? (
                  <Image source={{ uri: perfil.foto }} style={styles.avatarImage} />
                ) : (
                  <Ionicons name="person-outline" size={45} color="#000" />
                )}
              </View>

              <View style={styles.perfilInfo}>
                <Text style={styles.nomeText}>
                  {perfil?.nome}{perfil?.sobrenome ? ` ${perfil.sobrenome}` : ''}
                </Text>

                <View style={styles.tagsRow}>
                  {perfil?.avaliacao !== null && perfil?.avaliacao !== undefined && (
                    <View style={styles.tagAzul}>
                      <Ionicons name="star-outline" size={14} color="#FFF" style={{ marginRight: 4 }} />
                      <Text style={styles.tagText}>{Number(perfil.avaliacao).toFixed(1)}</Text>
                    </View>
                  )}
                  <View style={styles.tagAzul}>
                    <Text style={styles.tagText}>{perfil?.qtdServicos} Serviços</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Atividades</Text>
            <Text style={styles.cardSubtitle}>Comentários fixados</Text>

            {perfil?.fixados && perfil.fixados.length > 0 ? (
              <View style={styles.comentariosRow}>
                {perfil.fixados.map((av) => (
                  <View key={av.id} style={styles.boxComentario}>
                    <View style={styles.comentarioTopo}>
                      <Text style={styles.autorText} numberOfLines={1}>
                        {av.cliente?.nome ?? 'Cliente'}
                      </Text>
                      {av.nota != null && (
                        <View style={styles.notaInline}>
                          <Ionicons name="star" size={12} color="#F5A623" />
                          <Text style={styles.notaInlineText}>{av.nota}</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.comentarioCorpo} numberOfLines={3}>
                      {av.comentario ?? ''}
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.textoVazio}>Nenhuma avaliação em destaque ainda.</Text>
            )}
          </View>

          <TouchableOpacity
            style={styles.card}
            onPress={() => setEspecialidadesAberta((v) => !v)}
            activeOpacity={0.85}
          >
            <View style={styles.accordionHeader}>
              <Text style={styles.cardTitle}>Minhas Especialidades</Text>
              <Ionicons
                name={especialidadesAberta ? 'chevron-up' : 'chevron-down'}
                size={24}
                color="#555"
              />
            </View>

            {especialidadesAberta && (
              <View style={styles.accordionContent}>
                {perfil?.especialidades && perfil.especialidades.length > 0 ? (
                  perfil.especialidades.map((esp, i) => (
                    <View key={i} style={styles.linhaEspecialidade}>
                      <Ionicons name="checkmark-circle-outline" size={20} color={BLUE_COLOR} />
                      
                      <View style={{ flex: 1 }}>
                        <Text style={styles.itemEspecialidade}>{esp.profissao}</Text>
                        {esp.tempo_experiencia ? (
                          <Text style={styles.itemSubtexto}>
                            {esp.tempo_experiencia} anos de experiência
                          </Text>
                        ) : null}
                      </View>

                      {esp.certificado_url ? (
                          <TouchableOpacity 
                            style={styles.btnCertificado}
                            onPress={() => WebBrowser.openBrowserAsync(esp.certificado_url)}
                            activeOpacity={0.7}
                          >
                            <Ionicons name="document-text-outline" size={14} color={BLUE_COLOR} />
                            <Text style={styles.btnCertificadoTexto}>Ver cert.</Text>
                          </TouchableOpacity>
                          ) : null}
                    </View>
                  ))
                ) : (
                  <Text style={styles.textoVazio}>Nenhuma especialidade cadastrada.</Text>
                )}
              </View>
            )}
          </TouchableOpacity>

          {perfil?.especialidades?.length === 0 && perfil?.fixados?.length === 0 && (
            <View style={[styles.card, styles.vazioCard]}>
              <Ionicons name="person-outline" size={36} color="#B0B0B0" />
              <Text style={styles.vazioTexto}>Perfil ainda sendo preenchido</Text>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  headerRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 25, paddingTop: 15, paddingBottom: 10, gap: 15,
  },
  btnVoltarRedondo: {
    backgroundColor: BLUE_COLOR, width: 44, height: 44,
    borderRadius: 22, justifyContent: 'center', alignItems: 'center',
  },
  headerTitle: { fontFamily: 'Homenaje_400Regular', fontSize: 32, color: '#000' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 15, gap: 14, paddingBottom: 40 },
  card: { backgroundColor: CARD_BG, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#D3D3D3' },
  perfilRow: { flexDirection: 'row', alignItems: 'center' },
  avatarCirculo: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: '#D1D7DC',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1.5, borderColor: '#000', overflow: 'hidden',
  },
  avatarImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  perfilInfo: { marginLeft: 15, flex: 1 },
  nomeText: { fontFamily: 'Homenaje_400Regular', fontSize: 28, color: '#000', lineHeight: 30, marginBottom: 8 },
  tagsRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  tagAzul: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: BLUE_COLOR,
    borderRadius: 6, paddingHorizontal: 10, paddingVertical: 3,
  },
  tagText: { fontFamily: 'Homenaje_400Regular', fontSize: 16, color: '#FFF' },
  cardTitle: { fontFamily: 'Homenaje_400Regular', fontSize: 24, color: '#000' },
  cardSubtitle: { fontFamily: 'Homenaje_400Regular', fontSize: 13, color: '#A0A0A0', marginTop: -2, marginBottom: 4 },
  comentariosRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, gap: 10 },
  boxComentario: { flex: 1, backgroundColor: '#D1D7DC', borderRadius: 12, padding: 10, minHeight: 70 },
  comentarioTopo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  autorText: { fontFamily: 'Homenaje_400Regular', fontSize: 14, color: '#000', flex: 1 },
  notaInline: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  notaInlineText: { fontFamily: 'Homenaje_400Regular', fontSize: 13, color: '#555' },
  comentarioCorpo: { fontFamily: 'Homenaje_400Regular', fontSize: 13, color: '#8A8A8A' },
  accordionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  accordionContent: { marginTop: 12, gap: 10 },
  linhaEspecialidade: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  itemEspecialidade: { fontFamily: 'Homenaje_400Regular', fontSize: 20, color: '#333' },
  itemSubtexto: { fontFamily: 'Homenaje_400Regular', fontSize: 13, color: '#8A8A8A', marginTop: -2 },
  textoVazio: { fontFamily: 'Homenaje_400Regular', fontSize: 15, color: '#8A8A8A', marginTop: 8 },
  vazioCard: { alignItems: 'center', paddingVertical: 30, gap: 10 },
  vazioTexto: { fontFamily: 'Homenaje_400Regular', fontSize: 18, color: '#B0B0B0' },
  
  btnCertificado: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF4FF',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BLUE_COLOR,
    gap: 4,
    marginLeft: 10,
  },
  btnCertificadoTexto: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 14,
    color: BLUE_COLOR,
  },
});