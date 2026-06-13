import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useRegistration } from "../context/RegistrationContext";
import LogoIcon from '../assets/icons/LogoIcon';
import { supabase } from '../services/supabase';

const BLUE_COLOR = '#076BDE';

export default function TelaEspecialidades({ navigation }) {
  const { updateFormData } = useRegistration();
  const [selecionados, setSelecionados] = useState([]);
  const [idsProfissoes, setIdsProfissoes] = useState({});

  const opcoes = [
    { nome: 'Eletricista', icon: 'flashlight', family: 'MaterialCommunityIcons' },
    { nome: 'Encanador', icon: 'pipe', family: 'MaterialCommunityIcons' },
    { nome: 'Pintor', icon: 'paint-roller', family: 'FontAwesome5' },
    { nome: 'Mecânico', icon: 'wrench', family: 'FontAwesome5' },
    { nome: 'Pedreiro', icon: 'wall', family: 'MaterialCommunityIcons' },
  ];

  useEffect(() => {
    async function carregarIds() {
      const nomes = opcoes.map(o => o.nome);
      const { data, error } = await supabase
        .from('profissoes')
        .select('id, nome')
        .in('nome', nomes);

      if (data && !error) {
        const mapa = {};
        data.forEach(item => {
          mapa[item.nome] = item.id;
        });
        setIdsProfissoes(mapa);
      }
    }
    carregarIds();
  }, []);

  const toggleSelecao = (itemNome) => {
    if (selecionados.includes(itemNome)) {
      setSelecionados(selecionados.filter(s => s !== itemNome));
    } else {
      if (selecionados.length < 3) {
        setSelecionados([...selecionados, itemNome]);
      } else {
        Alert.alert('Limite atingido', 'Você pode escolher no máximo 3 especialidades.');
      }
    }
  };

  const handleContinuar = () => {
    if (selecionados.length === 0) {
      Alert.alert('Atenção', 'Selecione pelo menos uma especialidade.');
      return;
    }

    const especialidadesMapeadas = selecionados.map(nome => ({
      profissao: nome,
      idprofissao: idsProfissoes[nome] || null
    }));

    updateFormData({ especialidades: especialidadesMapeadas });
    navigation.navigate('TelaVerificacao'); 
  };

  const renderIcon = (item) => {
    if (item.family === 'FontAwesome5') {
      return <FontAwesome5 name={item.icon} size={24} color="#000" />;
    }
    return <MaterialCommunityIcons name={item.icon} size={28} color="#000" />;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>

      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <LogoIcon width={70} height={70} fill="#FFFFFF" />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.title}>Selecione as suas{"\n"}especialidades</Text>
          <Text style={styles.subtitle}>Escolha até 3 opções principais</Text>
          
          <View style={styles.opcoesContainer}>
            {opcoes.map((item) => {
              const isSelected = selecionados.includes(item.nome);
              return (
                <TouchableOpacity 
                  key={item.nome}
                  style={[styles.btnOption, isSelected && styles.btnOptionAtivo]}
                  onPress={() => toggleSelecao(item.nome)}
                  activeOpacity={0.7}
                >
                  <View style={styles.iconContainer}>
                    {renderIcon(item)}
                  </View>
                  <Text style={styles.btnText}>
                    {item.nome}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity style={styles.btnContinuar} onPress={handleContinuar} activeOpacity={0.8}>
            <Text style={styles.btnContinuarText}>Continuar</Text>
          </TouchableOpacity>

          <Text style={styles.termosText}>
            Ao continuar, você concorda com os nossos <Text style={styles.linkText}>Termos de{"\n"}Serviço</Text> e <Text style={styles.linkText}>Política de Privacidade</Text>.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: BLUE_COLOR
  },
  header: { 
    backgroundColor: BLUE_COLOR, 
    height: 120, 
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: -20,
  },
  contentContainer: {
    flexGrow: 1,
  },
  content: { 
    flex: 1, 
    backgroundColor: '#DBDBDB',
    borderTopLeftRadius: 100,
    paddingHorizontal: 30, 
    alignItems: 'center',
    paddingTop: 40, 
    paddingBottom: 30,
  },
  title: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 42, 
    color: BLUE_COLOR,
    textAlign: 'center',
    marginBottom: 5,
    lineHeight: 45,
  },
  subtitle: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 22,
    color: '#666',
    marginBottom: 25,
  },
  opcoesContainer: { 
    width: '100%',
    gap: 12,
    marginBottom: 30,
  },
  btnOption: { 
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF', 
    borderWidth: 1.5, 
    borderColor: '#000',
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  btnOptionAtivo: {
    backgroundColor: '#E6F0FA',
    borderColor: BLUE_COLOR,
  },
  iconContainer: {
    width: 40,
    alignItems: 'center',
    marginRight: 15,
  },
  btnText: { 
    fontFamily: 'Homenaje_400Regular',
    fontSize: 26, 
    color: '#000' 
  },
  btnContinuar: { 
    backgroundColor: BLUE_COLOR, 
    width: '90%',
    paddingVertical: 15, 
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 15,
  },
  btnContinuarText: { 
    fontFamily: 'Homenaje_400Regular',
    color: '#FFF', 
    fontSize: 28, 
  },
  termosText: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  linkText: {
    color: BLUE_COLOR,
    textDecorationLine: 'underline',
  }
});