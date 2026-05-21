import React, { useState } from 'react';
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

const profissionaisIniciais = [
  { id: '1', favoritado: false },
  { id: '2', favoritado: false },
  { id: '3', favoritado: false },
  { id: '4', favoritado: false },
  { id: '5', favoritado: false },
];

const categorias = [
  'Encanador',
  'Transporte',
  'Limpador de piscina',
  'Montador de móveis',
  'Eletricista',
];

function CardProfissional({ favoritado, onToggle }) {
  return (
    <View style={styles.card}>
      <View style={styles.avatar}>
        <Ionicons name="person-outline" size={22} color="#555" />
      </View>
      <Text style={styles.cardNome}>Profissional{'\n'}em destaque</Text>
      <TouchableOpacity onPress={onToggle} activeOpacity={0.7}>
        <Ionicons
          name={favoritado ? 'star' : 'star-outline'}
          size={22}
          color={favoritado ? '#F5A623' : '#222'}
        />
      </TouchableOpacity>
    </View>
  );
}

export default function TelaInicio() {
  const [profissionais, setProfissionais] = useState(profissionaisIniciais);

  function toggleFavorito(id) {
    setProfissionais(prev =>
      prev.map(p => p.id === id ? { ...p, favoritado: !p.favoritado } : p)
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>

        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>S</Text>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={16} color="#999" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="O que você precisa?"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.categoriasContainer}>
          {categorias.map((cat) => (
            <TouchableOpacity key={cat} style={styles.chip}>
              <Text style={styles.chipText}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          data={profissionais}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CardProfissional
              favoritado={item.favoritado}
              onToggle={() => toggleFavorito(item.id)}
            />
          )}
          contentContainerStyle={styles.lista}
          showsVerticalScrollIndicator={false}
        />

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#CBCBCB',
  },
  container: {
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: 10,
  },
  header: {
    alignItems: 'flex-end',
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#aaa',
    paddingHorizontal: 14,
    paddingVertical: 9,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#333',
    padding: 0,
  },
  categoriasContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  chip: {
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 3,
    backgroundColor: 'transparent',
  },
  chipText: {
    fontSize: 12,
    color: '#222',
  },
  lista: {
    gap: 8,
    paddingBottom: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#bbb',
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#888',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: '#e8e8e8',
  },
  cardNome: {
    flex: 1,
    fontSize: 13,
    color: '#222',
    fontWeight: '500',
    lineHeight: 18,
  },
});