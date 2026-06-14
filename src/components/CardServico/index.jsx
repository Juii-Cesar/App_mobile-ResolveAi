import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Image,
  Modal,
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
  const [modalAviso, setModalAviso] = useState({ visible: false, titulo: '', mensagem: '', tipo: 'default' });

  const fecharAviso = () => setModalAviso({ visible: false, titulo: '', mensagem: '', tipo: 'default' });

  async function enviarAvaliacao() {
    try {
      if (avaliacao === 0) {
        setModalAviso({ visible: true, titulo: 'Avaliação', mensagem: 'Selecione uma nota com as estrelas.', tipo: 'default' });
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

      setModalAviso({ visible: true, titulo: 'Sucesso', mensagem: 'Avaliação enviada com sucesso!', tipo: 'default' });
    } catch (error) {
      console.log(error);
      setModalAviso({ visible: true, titulo: 'Erro', mensagem: 'Não foi possível enviar a avaliação.', tipo: 'danger' });
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

      <Modal visible={modalAviso.visible} transparent animationType="fade" onRequestClose={fecharAviso}>
        <View style={styles.overlay}>
          <View style={styles.modalAvisoCard}>
            <Text style={[styles.modalAvisoTitulo, modalAviso.tipo === 'danger' && styles.modalAvisoTituloDanger]}>
              {modalAviso.titulo}:
            </Text>
            <Text style={styles.modalAvisoMensagem}>{modalAviso.mensagem}</Text>
            <TouchableOpacity style={styles.btnAvisoOk} onPress={fecharAviso}>
              <Text style={styles.btnAvisoOkTexto}>Ok</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalAvisoCard: {
    width: 280,
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  modalAvisoTitulo: {
    fontFamily: "Homenaje_400Regular",
    fontSize: 32,
    color: BLUE_COLOR,
    lineHeight: 34,
    marginBottom: 10,
  },
  modalAvisoTituloDanger: {
    color: '#D32F2F',
  },
  modalAvisoMensagem: {
    fontFamily: "Homenaje_400Regular",
    fontSize: 22,
    color: '#111',
    lineHeight: 26,
    marginBottom: 22,
  },
  btnAvisoOk: {
    width: '100%',
    height: 48,
    backgroundColor: BLUE_COLOR,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnAvisoOkTexto: {
    fontFamily: "Homenaje_400Regular",
    fontSize: 22,
    color: '#FFF',
  },
});