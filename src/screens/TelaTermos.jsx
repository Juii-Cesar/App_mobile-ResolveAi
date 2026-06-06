import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import LogoIcon from '../assets/icons/LogoIcon';
import { Button } from '../components/Button';

const BLUE_COLOR = '#076BDE';
const GRAY_LINE = '#CCCCCC';

export default function TelaTermos({ navigation }) {
  
  const handleAceitarTermos = () => {
    console.log('Termos aceitos pelo profissional');
    navigation.navigate('TelaVerificacao', { termosConcluidos: true });
  };

  const itensTermos = [
    { id: 'uso', titulo: 'Termos de Uso do Profissional' },
    { id: 'privacidade', titulo: 'Política de Privacidade e Dados' },
    { id: 'conduta', titulo: 'Código de Conduta e Segurança' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={32} color="#000" />
        </TouchableOpacity>
        <LogoIcon width={45} height={45} fill={BLUE_COLOR} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        <Text style={styles.title}>Termos e condições</Text>
        <Text style={styles.subtitle}>
          Leia e confirme que concorda com os documentos abaixo para finalizar o envio do seu cadastro.
        </Text>

        <View style={styles.listContainer}>
          {itensTermos.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.listItem}
              onPress={() => console.log(`Abrir detalhe de: ${item.titulo}`)}
            >
              <Text style={styles.itemText}>{item.titulo}</Text>
              <Ionicons name="chevron-forward" size={24} color="#000" />
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>

      <View style={styles.footer}>
        <Button 
          title="Li e aceito os termos" 
          onPress={handleAceitarTermos} 
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#DBDBDB' 
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingTop: 15,
  },
  scrollContent: { 
    paddingHorizontal: 25, 
    paddingTop: 20,
  },
  title: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 36,
    color: '#000',
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 18,
    color: '#555',
    lineHeight: 22,
    marginBottom: 30,
  },
  listContainer: {
    borderTopWidth: 1,
    borderColor: GRAY_LINE,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderColor: GRAY_LINE,
  },
  itemText: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 24,
    color: '#000',
  },
  footer: {
    paddingHorizontal: 25,
    paddingBottom: 25,
    alignItems: 'center',
  }
});