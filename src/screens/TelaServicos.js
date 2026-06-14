import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import LogoIcon from "../assets/icons/LogoIcon";
import { CardServico } from "../components/CardServico";
import { supabase } from "../services/supabase";

export default function TelaServicos() {
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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <LogoIcon width={50} height={50} />
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
            <LogoIcon width={60} height={60} />
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#D9D9D9",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    height: 82,
    borderBottomWidth: 1,
    borderBottomColor: "#9BA7B1",
    alignItems: "flex-end",
    justifyContent: "center",
    paddingRight: 16,
    backgroundColor: "#D9D9D9",
  },

  lista: {
    paddingTop: 28,
    paddingBottom: 40,
    gap: 34,
  },

  emptyContainer: {
    marginTop: 80,
    alignItems: "center",
  },
});
