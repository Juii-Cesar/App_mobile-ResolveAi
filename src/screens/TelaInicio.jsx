import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import LogoIcon from "../assets/icons/LogoIcon";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProfissionalDestaque } from "../components/ProfissionalDestaque";
import { supabase } from "../services/supabase";

export default function TelaInicio({ navigation }) {
  const [profissionais, setProfissionais] = useState([]);

  const categorias = [
    "Encanador",
    "Transporte",
    "Limpador de piscina",
    "Montador de móveis",
    "Eletricista",
  ];

  function abrirBusca(categoria = "") {
    navigation.navigate("TelaInformarProblema", { categoria });
  }

  async function carregarProfissionais() {
    try {
      
      
      const { data: usuarios, error } = await supabase
        .from("usuarios")
        .select("id, nome")
        .eq("tipo", "profissional");


      if (error) {
        console.log("Erro ao buscar usuários:", error);
        return;
      }

      const profissionaisAleatorios = [...usuarios]
        .sort(() => Math.random() - 0.5)
        .slice(0, 5);

      const ids = profissionaisAleatorios.map((p) => p.id);

      const { data: documentos, error: erroDocumentos } = await supabase
        .from("documentos_profissional")
        .select("idprofissional, fotoperfilurl")
        .in("idprofissional", ids);

      if (erroDocumentos) {
        console.log("Erro ao buscar fotos:", erroDocumentos);
      }

      const profissionaisFormatados = profissionaisAleatorios.map(
        (profissional) => {
          const documento = documentos?.find(
            (doc) => doc.idprofissional === profissional.id,
          );

          return {
            ...profissional,
            foto: documento?.fotoperfilurl || null,
          };
        },
      );

      setProfissionais(profissionaisFormatados);
    } catch (err) {
      console.log(err);
    }
  }

 

  useEffect(() => {
    carregarProfissionais();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <LogoIcon width={50} height={50} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          style={styles.search}
          onPress={() => abrirBusca()}
          activeOpacity={0.75}
        >
          <Ionicons name="search-outline" size={20} color="#555" />
          <Text style={styles.searchPlaceholder}>O que você precisa?</Text>
        </TouchableOpacity>

        <View style={styles.tagsContainer}>
          {categorias.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.tag}
              onPress={() => abrirBusca(item)}
            >
              <Text style={styles.tagText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {profissionais.map((profissional) => (
          <ProfissionalDestaque
            key={profissional.id}
            nome={profissional.nome}
            foto={profissional.foto}
            onPress={() =>
              console.log("Profissional selecionado:", profissional.id)
            }
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D9D9D9",
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

  search: {
    marginHorizontal: 15,
    marginTop: 20,
    height: 45,
    borderWidth: 2,
    borderRadius: 30,
    backgroundColor: "#EEE",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
  },

  searchPlaceholder: {
    marginLeft: 10,
    flex: 1,
    color: "#999",
    fontSize: 14,
    fontFamily: "Homenaje_400Regular",
  },

  tagsContainer: {
    marginTop: 12,
    paddingHorizontal: 15,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  tag: {
    borderWidth: 1,
    borderColor: "#AAA",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#EEE",
  },

  tagText: {
    color: "#666",
    fontFamily: "Homenaje_400Regular",
  },
});
