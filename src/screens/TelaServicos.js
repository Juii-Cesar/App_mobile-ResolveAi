import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const servicos = [
  { id: '1' },
  { id: '2' },
  { id: '3' },
];

function Estrelas({ avaliacao, onPress }) {
  return (
    <View style={styles.estrelasContainer}>
      {[1, 2, 3, 4, 5].map((n) => (
        <TouchableOpacity key={n} onPress={() => onPress(n)} activeOpacity={0.7}>
          <Ionicons
            name={n <= avaliacao ? 'star' : 'star-outline'}
            size={17}
            color={n <= avaliacao ? '#F5A623' : '#999'}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

function CardServico() {
  const [avaliacao, setAvaliacao] = React.useState(0);
  const [comentario, setComentario] = React.useState('');

  return (
    <View style={styles.card}>

    
      <Text style={styles.dataServico}>Data serviço</Text>

    
      <View style={styles.cardMeio}>
        <View style={styles.avatar}>
          <Ionicons name="person-outline" size={24} color="#555" />
        </View>

        <View style={styles.cardInfo}>
          <Text style={styles.cardNome}>Nome</Text>
          <Text style={styles.cardProfissao}>Profissão</Text>
        </View>

        <Estrelas avaliacao={avaliacao} onPress={setAvaliacao} />
      </View>

      
      <TextInput
        style={styles.comentarioInput}
        placeholder="Comentário..."
        placeholderTextColor="#bbb"
        value={comentario}
        onChangeText={setComentario}
      />
    </View>
  );
}

export default function TelaServicos() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      
      <View style={styles.header}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>S</Text>
        </View>
      </View>

      <FlatList
        data={servicos}
        keyExtractor={(item) => item.id}
        renderItem={() => <CardServico />}
        contentContainerStyle={styles.lista}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#CBCBCB',
  },
  header: {
    alignItems: 'flex-end',
    paddingHorizontal: 14,
    paddingTop: 10,
    marginBottom: 10,
  },
  logoCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#1565C0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  lista: {
    paddingHorizontal: 14,
    gap: 16,         
    paddingBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#bbb',
    padding: 14,
    gap: 10,
  },
  dataServico: {
    fontSize: 11,
    color: '#777',
    textAlign: 'right', 
  },
  cardMeio: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#888',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e8e8e8',
  },
  cardInfo: {
    flex: 1,
  },
  cardNome: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111',
    textDecorationLine: 'underline',
  },
  cardProfissao: {
    fontSize: 12,
    color: '#444',
    textDecorationLine: 'underline',
  },
  estrelasContainer: {
    flexDirection: 'row',
    gap: 3,
  },
  comentarioInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 12,
    color: '#333',
    backgroundColor: '#f5f5f5',
  },
});