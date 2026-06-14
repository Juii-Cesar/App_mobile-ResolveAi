import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, ActivityIndicator, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons'; // <-- CORREÇÃO: Importação adicionada

import LogoIcon from "../assets/icons/LogoIcon";
import { CardServico } from "../components/CardServico";
import { supabase } from "../services/supabase";

const BLUE_COLOR = '#076BDE';

export default function TelaServicos() {
  const insets = useSafeAreaInsets();
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    buscarServicos();
  }, []);

  async function buscarServicos() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from("servicos")
        .select(
          `
          *,
          usuarios!servicos_idprofissional_fkey (
            nome,
            sobrenome
          ),
          profissoes (
            nome
          )
        `,
        )
        .eq("idcliente", user.id)
        .eq("status", "finalizado")
        .order("criadoem", { ascending: false });

      if (error) throw error;

      const idsProfissionais = [
        ...new Set(data.map((item) => item.idprofissional).filter(Boolean)),
      ];

      const idsServicos = data.map((item) => item.id);

      let documentos = [];
      let avaliacoes = [];

      if (idsProfissionais.length > 0) {
        const { data: docs, error: erroDocs } = await supabase
          .from("documentos_profissional")
          .select("idprofissional, fotoperfilurl")
          .in("idprofissional", idsProfissionais);

        if (erroDocs) {
          console.log("Erro ao buscar fotos:", erroDocs);
        } else {
          documentos = docs || [];
        }
      }

      if (idsServicos.length > 0) {
        const { data: avals, error: erroAvaliacoes } = await supabase
          .from("avaliacoes")
          .select("*")
          .in("idservico", idsServicos);

        if (erroAvaliacoes) {
          console.log("Erro ao buscar avaliações:", erroAvaliacoes);
        } else {
          avaliacoes = avals || [];
        }
      }

      const servicosComDados = data.map((servico) => {
        const documento = documentos.find(
          (doc) => doc.idprofissional === servico.idprofissional,
        );

        const avaliacao = avaliacoes.find((av) => av.idservico === servico.id);

        return {
          ...servico,
          fotoPerfil: documento?.fotoperfilurl || null,
          avaliacaoData: avaliacao || null,
        };
      });

      setServicos(servicosComDados);
    } catch (err) {
      console.log("Erro TelaServicos:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={BLUE_COLOR} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Cabeçalho dinâmico e padronizado com o SafeArea */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) + 10 }]}>
        <Text style={styles.headerTitle}>Histórico</Text>
        <LogoIcon width={45} height={45} />
      </View>

      <FlatList
        data={servicos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <CardServico
            servicoId={item.id}
            profissionalId={item.idprofissional}
            dt={new Date(item.criadoem).toLocaleDateString("pt-BR")}
            nome={`${item.usuarios?.nome || ""} ${
              item.usuarios?.sobrenome || ""
            }`}
            profissao={item.profissoes?.nome || ""}
            fotoPerfil={item.fotoPerfil}
            avaliado={item.avaliado}
            avaliacaoInicial={item.avaliacaoData?.nota || 0}
            comentarioInicial={item.avaliacaoData?.comentario || ""}
          />
        )}
        contentContainerStyle={styles.lista}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={60} color="#A0A8B0" />
            <Text style={styles.emptyText}>Nenhum serviço finalizado ainda.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D9D9D9",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1.5,
    borderBottomColor: '#A8B7C1',
    backgroundColor: '#D9D9D9',
  },
  headerTitle: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 32,
    color: '#111',
  },
  lista: {
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 15,
  },
  emptyContainer: {
    marginTop: 80,
    alignItems: "center",
    gap: 10,
  },
  emptyText: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 20,
    color: '#7A8A9E',
  }
});