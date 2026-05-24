import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LogoIcon from '../assets/icons/LogoIcon';
import { Button } from '../components/Button';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const BLUE_COLOR = '#076BDE';

const LISTA_ESPECIALIDADES = [
  { id: '1', nome: 'Eletricista', icone: 'flashlight' },
  { id: '2', nome: 'Encanador', icone: 'pipe' },
  { id: '3', nome: 'Pintor', icone: 'format-paint' },
  { id: '4', nome: 'Mecânico', icone: 'wrench' },
  { id: '5', nome: 'Pedreiro', icone: 'wall' },
  { id: '6', nome: 'Chaveiro', icone: 'key' },
];

export default function TelaEspecialidades({ navigation }) {
  const [selecionados, setSelecionados] = useState([]);

  const handleSelecionar = (id) => {
    if (selecionados.includes(id)) {
      setSelecionados(selecionados.filter(item => item !== id));
    } else {
      if (selecionados.length < 3) {
        setSelecionados([...selecionados, id]);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <View style={styles.header}>
        <SafeAreaView edges={['top']} />
        <View style={styles.logoContainer}>
          <LogoIcon width={70} height={70} fill="#FFFFFF" />
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Selecione as suas{"\n"}especialidades</Text>
        <Text style={styles.subtitle}>Escolha até 3 opções principais</Text>

        <ScrollView 
          contentContainerStyle={styles.grid} 
          showsVerticalScrollIndicator={false}
        >
          {LISTA_ESPECIALIDADES.map((item) => {
            const estaSelecionado = selecionados.includes(item.id);
            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.cardEspecialidade,
                  estaSelecionado && styles.cardSelecionado
                ]}
                onPress={() => handleSelecionar(item.id)}
              >
                <MaterialCommunityIcons 
                  name={item.icone} 
                  size={32} 
                  color={estaSelecionado ? '#FFF' : '#000'} 
                />
                <Text style={[
                  styles.textoEspecialidade,
                  estaSelecionado && styles.textoSelecionado
                ]}>
                  {item.nome}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.footerContainer}>
          <Button 
            title="Continuar" 
            onPress={() => {
              console.log('Especialidades escolhidas:', selecionados);
              navigation.navigate('TelaVerificacao');
            }} 
          />
          
          <Text style={styles.textoLegal}>
            Ao continuar, você concorda com os nossos{' '}
            <Text style={styles.linkLegal}>Termos de Serviço</Text> e{' '}
            <Text style={styles.linkLegal}>Política de Privacidade</Text>.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#DBDBDB' 
  },
  header: {
    backgroundColor: BLUE_COLOR,
    height: 220, 
    alignItems: 'center',
  },
  logoContainer: {
    marginTop: 40 
  },
  content: { 
    flex: 1, 
    backgroundColor: '#DBDBDB',
    marginTop: -80, 
    borderTopLeftRadius: 100, 
    paddingHorizontal: 30, 
    alignItems: 'center',
    paddingTop: 40, 
  },
  title: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 45, 
    color: BLUE_COLOR,
    textAlign: 'center',
    lineHeight: 45,
    marginBottom: 5,
  },
  subtitle: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 22,
    color: '#555',
    marginBottom: 20,
  },
  grid: {
    width: '100%',
    gap: 15,
    paddingBottom: 10,
    alignItems: 'center'
  },
  cardEspecialidade: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    width: 260,
    height: 55,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: '#000',
    paddingHorizontal: 20,
    gap: 15,
  },
  cardSelecionado: {
    backgroundColor: BLUE_COLOR,
    borderColor: BLUE_COLOR,
  },
  textoEspecialidade: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 26,
    color: '#000',
  },
  textoSelecionado: {
    color: '#FFF',
  },
  footerContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 20,
    gap: 12,
  },
  textoLegal: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 15,
    lineHeight: 18,
  },
  linkLegal: {
    color: BLUE_COLOR,
    textDecorationLine: 'underline',
  }
});