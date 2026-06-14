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

const BLUE_COLOR = '#076BDE';
const CARD_BG = '#EAEAEA';

function Estrelas({ avaliacao, onPress, disabled }) {
  return (
    <View style={styles.estrelasContainer}>
      {[1, 2, 3, 4, 5].map((n) => (
        <TouchableOpacity
          key={n}
          disabled={disabled}
          onPress={() => onPress(n)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={n <= avaliacao ? "star" : "star-outline"}
            size={22}
            color={n <= avaliacao ? "#F5A623" : "#A0A8B0"}
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
        Alert.alert("Avaliação", "Selecione uma nota com as estrelas.");
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

      Alert.alert("Sucesso", "Avaliação enviada com sucesso!");
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
            <Ionicons name="person-outline" size={30} color="#555" />
          )}
        </View>

        <View style={styles.cardInfo}>
          <Text numberOfLines={1} style={styles.cardNome}>{nome}</Text>
          <Text numberOfLines={1} style={styles.cardProfissao}>{profissao}</Text>
        </View>

        <Estrelas
          avaliacao={avaliacao}
          onPress={setAvaliacao}
          disabled={foiAvaliado}
        />
      </View>

      <TextInput
        editable={!foiAvaliado}
        style={[styles.comentarioInput, foiAvaliado && styles.comentarioDesativado]}
        placeholder="Deixe um comentário sobre o serviço..."
        placeholderTextColor="#7A8A9E"
        value={comentario}
        onChangeText={setComentario}
        multiline
      />

      {!foiAvaliado && (
        <TouchableOpacity style={styles.botao} onPress={enviarAvaliacao} activeOpacity={0.8}>
          <Text style={styles.botaoTexto}>Enviar Avaliação</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: CARD_BG,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#D3D3D3",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dataServico: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 16,
    color: '#7A8A9E',
    textAlign: "right",
    marginBottom: 6,
    marginTop: -4,
  },
  cardMeio: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: "#000",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#D1D7DC",
    marginRight: 12,
  },
  avatarImagem: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  cardInfo: {
    flex: 1,
    marginRight: 10,
  },
  cardNome: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 24,
    color: '#000',
    lineHeight: 26,
  },
  cardProfissao: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 18,
    color: '#555',
    marginTop: -2,
  },
  estrelasContainer: {
    flexDirection: "row",
    gap: 4,
  },
  comentarioInput: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 20,
    marginTop: 15,
    borderWidth: 1.5,
    borderColor: "#A8B7C1",
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    minHeight: 50,
    backgroundColor: "#FFF",
    color: "#333",
  },
  comentarioDesativado: {
    backgroundColor: '#D1D7DC',
    color: '#555',
  },
  botao: {
    marginTop: 15,
    backgroundColor: BLUE_COLOR,
    borderRadius: 25,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: '#333',
    alignItems: 'center',
  },
  botaoTexto: {
    fontFamily: 'Homenaje_400Regular',
    color: "#FFF",
    fontSize: 22,
  },
});