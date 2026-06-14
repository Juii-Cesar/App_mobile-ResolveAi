import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Alert,
  Image,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../../services/supabase";

function Estrelas({ avaliacao, onPress, disabled }) {
  return (
    <View style={styles.estrelasContainer}>
      {[1, 2, 3, 4, 5].map((n) => (
        <TouchableOpacity
          key={n}
          disabled={disabled}
          onPress={() => onPress(n)}
        >
          <Ionicons
            name={n <= avaliacao ? "star" : "star-outline"}
            size={18}
            color={n <= avaliacao ? "#F5A623" : "#999"}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

export const CardServico = ({
  servicoId,
  profissionalId,
  dt,
  nome,
  profissao,
  fotoPerfil,
  avaliado,
  avaliacaoInicial,
  comentarioInicial,
}) => {
  const [avaliacao, setAvaliacao] = useState(avaliacaoInicial);
  const [comentario, setComentario] = useState(comentarioInicial);
  const [foiAvaliado, setFoiAvaliado] = useState(avaliado);

  async function enviarAvaliacao() {
    try {
      if (avaliacao === 0) {
        Alert.alert("Avaliação", "Selecione uma nota.");
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { error } = await supabase.from("avaliacoes").insert({
        idservico: servicoId,
        idcliente: user.id,
        idprofissional: profissionalId,
        nota: avaliacao,
        comentario,
      });

      if (error) throw error;

      await supabase
        .from("servicos")
        .update({
          avaliado: true,
        })
        .eq("id", servicoId);
        setFoiAvaliado(true);

      Alert.alert("Sucesso", "Avaliação enviada com sucesso.");
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível enviar a avaliação.");
    }
  }

  return (
    <View style={styles.card}>
      <Text style={styles.dataServico}>{dt}</Text>

      <View style={styles.cardMeio}>
        <View style={styles.avatar}>
          {fotoPerfil ? (
            <Image source={{ uri: fotoPerfil }} style={styles.avatarImagem} />
          ) : (
            <Ionicons name="person-outline" size={24} color="#555" />
          )}
        </View>

        <View style={styles.cardInfo}>
          <Text style={styles.cardNome}>{nome}</Text>
          <Text style={styles.cardProfissao}>{profissao}</Text>
        </View>

        <Estrelas
          avaliacao={avaliacao}
          onPress={setAvaliacao}
          disabled={foiAvaliado}
        />
      </View>

      <TextInput
        editable={!foiAvaliado}
        style={styles.comentarioInput}
        placeholder="Comentário..."
        placeholderTextColor="#999"
        value={comentario}
        onChangeText={setComentario}
      />

      {!foiAvaliado && (
        <TouchableOpacity style={styles.botao} onPress={enviarAvaliacao}>
          <Text style={styles.botaoTexto}>Enviar avaliação</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "78%",
    alignSelf: "center",
    backgroundColor: "#ECECEC",
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#222",
    paddingHorizontal: 14,
    paddingVertical: 12,
  },

  dataServico: {
    fontSize: 16,
    textAlign: "right",
    marginBottom: 8,
  },

  cardMeio: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: "#222",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E6ECF2",
    marginRight: 12,
  },

  avatarImagem: {
    width: "100%",
    height: "100%",
  },

  cardInfo: {
    flex: 1,
  },

  cardNome: {
    fontSize: 16,
  },

  cardProfissao: {
    fontSize: 16,
  },

  estrelasContainer: {
    flexDirection: "row",
    gap: 2,
  },

  comentarioInput: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#BEBEBE",
    borderRadius: 20,
    paddingHorizontal: 12,
    backgroundColor: "#DCDCDC",
  },

  botao: {
    marginTop: 12,
    backgroundColor: "#1565C0",
    borderRadius: 20,
    paddingVertical: 8,
  },

  botaoTexto: {
    textAlign: "center",
    color: "#FFF",
    fontWeight: "bold",
  },
});
