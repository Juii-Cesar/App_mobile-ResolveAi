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
import LogoIcon from '../assets/icons/LogoIcon'

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
        <LogoIcon width={50} height={50}/>
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
  backgroundColor: '#D9D9D9',
},

header: {
  height: 82,
  borderBottomWidth: 1,
  borderBottomColor: '#9BA7B1',
  alignItems: 'flex-end',
  justifyContent: 'center',
  paddingRight: 16,
  backgroundColor: '#D9D9D9',
},

logoCircle: {
  width: 46,
  height: 46,
  borderRadius: 30,
  borderWidth: 2,
  borderColor: '#1565C0',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#D9D9D9',
},

logoText: {
  color: '#1565C0',
  fontSize: 22,
  fontWeight: 'bold',
},

lista: {
  paddingTop: 28,
  paddingBottom: 40,
  gap: 34,
},

card: {
  width: '78%',
  alignSelf: 'center',
  backgroundColor: '#ECECEC',
  borderRadius: 24,
  borderWidth: 2,
  borderColor: '#222',
  paddingHorizontal: 14,
  paddingVertical: 12,
},

dataServico: {
  fontSize: 16,
  color: '#111',
  textAlign: 'right',
  marginBottom: 8,
  fontFamily: 'Homenaje_400Regular',
},

cardMeio: {
  flexDirection: 'row',
  alignItems: 'center',
},

avatar: {
  width: 56,
  height: 56,
  borderRadius: 50,
  borderWidth: 2,
  borderColor: '#222',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#E6ECF2',
  marginRight: 12,
},

cardInfo: {
  flex: 1,
},

cardNome: {
  fontSize: 24,
  color: '#111',
  lineHeight: 24,
  fontFamily: 'Homenaje_400Regular',
},

cardProfissao: {
  fontSize: 20,
  color: '#222',
  lineHeight: 20,
  fontFamily: 'Homenaje_400Regular',
},

estrelasContainer: {
  flexDirection: 'row',
  gap: 2,
  marginBottom: 10,
},

comentarioInput: {
  marginTop: 10,
  height: 28,
  borderWidth: 1,
  borderColor: '#BEBEBE',
  borderRadius: 20,
  paddingHorizontal: 12,
  backgroundColor: '#DCDCDC',
  fontSize: 15,
  color: '#333',
  fontFamily: 'Homenaje_400Regular',
  paddingTop: 0,
  paddingBottom: 0,
},
});