import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import LogoIcon from "../assets/icons/LogoIcon";
import { ProfissionalDestaque } from "../components/ProfissionalDestaque";
import { supabase } from "../services/supabase";

const BLUE_COLOR = '#076BDE';

export default function TelaInicio({ navigation }) {
  const insets = useSafeAreaInsets();
  const [profissionais, setProfissionais] = useState([]);
  const [textoBusca, setTextoBusca] = useState('');

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

      const profissionaisAleatorios = [...usuarios].sort(() => Math.random() - 0.5).slice(0, 5);
      const ids = profissionaisAleatorios.map((p) => p.id);

      const { data: documentos, error: erroDocumentos } = await supabase
        .from("documentos_profissional")
        .select("idprofissional, fotoperfilurl")
        .in("idprofissional", ids);

      if (erroDocumentos) console.log("Erro ao buscar fotos:", erroDocumentos);

      const profissionaisFormatados = profissionaisAleatorios.map((profissional) => {
        const documento = documentos?.find((doc) => doc.idprofissional === profissional.id);
        return { ...profissional, foto: documento?.fotoperfilurl || null };
      });

      setProfissionais(profissionaisFormatados);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    carregarProfissionais();
  }, []);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <LogoIcon width={50} height={50} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}>
        <View style={styles.search}>
          <Ionicons name="search-outline" size={22} color="#555" />
          <TextInput
            style={styles.searchInput}
            placeholder="O que você precisa?"
            placeholderTextColor="#7A8A9E"
            value={textoBusca}
            onChangeText={setTextoBusca}
            onSubmitEditing={() => {
              if (textoBusca.trim().length > 0) {
                abrirBusca(textoBusca.trim());
                setTextoBusca('');
              }
            }}
            returnKeyType="search"
          />
        </View>

        <View style={styles.tagsContainer}>
          {categorias.map((item, index) => (
            <TouchableOpacity key={index} style={styles.tag} onPress={() => abrirBusca(item)}>
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
              navigation.navigate('TelaPerfilProfissional', {
                profissionalId: profissional.id,
                profissionalNome: profissional.nome,
                profissionalFoto: profissional.foto,
              })
            }
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#D9D9D9" 
  },
  header: { 
    borderBottomWidth: 1, 
    borderBottomColor: "#9BA7B1", 
    alignItems: "flex-end", 
    justifyContent: "center", 
    paddingRight: 20, 
    paddingBottom: 15, 
    backgroundColor: "#D9D9D9" 
  },
  search: { 
    marginHorizontal: 20, 
    marginTop: 25, 
    height: 50, 
    borderWidth: 1.5, 
    borderColor: '#A0A8B0', 
    borderRadius: 25, 
    backgroundColor: "#FFF", 
    flexDirection: "row", 
    alignItems: "center", 
    paddingHorizontal: 18, 
    elevation: 2, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 3 
  },
  searchInput: { 
    marginLeft: 10, 
    flex: 1, 
    color: "#333", 
    fontSize: 18, 
    fontFamily: "Homenaje_400Regular",
    paddingVertical: 0,
  },
  tagsContainer: { 
    marginTop: 15, 
    paddingHorizontal: 20, 
    flexDirection: "row", 
    flexWrap: "wrap", 
    gap: 10, 
    marginBottom: 15 
  },
  tag: { 
    borderWidth: 1, 
    borderColor: "#B0B0B0", 
    borderRadius: 20, 
    paddingVertical: 8, 
    paddingHorizontal: 15, 
    backgroundColor: "#EAEAEA" 
  },
  tagText: { 
    color: "#444", 
    fontFamily: "Homenaje_400Regular", 
    fontSize: 16 
  },
});