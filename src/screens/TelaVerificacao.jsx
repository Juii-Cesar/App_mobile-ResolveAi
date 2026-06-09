import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import LogoIcon from '../assets/icons/LogoIcon';
import { Button } from '../components/Button';
import { useRegistration } from "../context/RegistrationContext";

const BLUE_COLOR = '#076BDE';
const GRAY_LINE = '#CCCCCC';

export default function TelaVerificacao({ navigation, route }) {
  const { formData } = useRegistration(); // 1. Acessando a mochila global

  // Mantemos este state temporário apenas para as etapas que você AINDA NÃO 
  // migrou para a mochila (como residência e termos), para não quebrar seu app.
  const [etapasExtras, setEtapasExtras] = useState([]);

  useEffect(() => {
    const novasEtapas = [...etapasExtras];
    // Se ainda usar parâmetros de navegação para as outras telas, ele salva aqui:
    if (route.params?.residenciaConcluido && !novasEtapas.includes('residencia')) novasEtapas.push('residencia');
    if (route.params?.termosConcluidos && !novasEtapas.includes('termos')) novasEtapas.push('termos');
    
    // Fallback caso você pule a câmera e vá direto pelo botão antigo
    if (route.params?.documentoConcluido && !novasEtapas.includes('documento')) novasEtapas.push('documento');
    if (route.params?.fotoConcluida && !novasEtapas.includes('foto')) novasEtapas.push('foto');

    if (novasEtapas.length > etapasExtras.length) {
      setEtapasExtras(novasEtapas);
    }
  }, [route.params]);

  // 2. A MÁGICA: Junta o que está na mochila com o que está no state temporário.
  // Se "fotoPerfil" existir na mochila, a etapa 'foto' já conta como concluída.
  // Se 'docFrente' e 'docVerso' existirem, a etapa 'documento' conta como concluída.
  const etapasConcluidas = [
    ...(formData.fotoPerfil ? ['foto'] : []),
    ...(formData.docFrente && formData.docVerso ? ['documento'] : []),
    ...etapasExtras
  ];

  // 3. Pega o primeiro nome para dar boas vindas
  const primeiroNome = formData.nome ? formData.nome.split(' ')[0] : 'Visitante';

  const etapas = [
    { id: 'foto', titulo: 'Foto de perfil', sub: 'Em um app de serviço, ver o rosto do profissional gera muita confiança para o cliente.', rota: 'TelaFotoPerfil' },
    { id: 'documento', titulo: 'Documento de Identidade (RG ou CNH)', sub: 'Obrigatório para validar quem é você.', rota: 'TelaDocumento' },
    { id: 'residencia', titulo: 'Comprovante de Residência', sub: 'Para confirmar sua área de atuação local.', rota: 'TelaResidencia' },
    { id: 'portfolio', titulo: 'Fotos de Serviços Anteriores (Opcional)', sub: 'Monte seu portfólio para se destacar.', rota: '' },
    { id: 'termos', titulo: 'Termos de Uso e Regras da Comunidade', sub: 'Leia e aceite para continuar.', rota: 'TelaTermos' },
    { id: 'antecedentes', titulo: 'Análise de Antecedentes', sub: 'Aguardando o envio dos documentos acima.', rota: '' },
  ];

  const totalEtapas = etapas.length;
  const concluidasCount = etapasConcluidas.length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={32} color="#000" />
        </TouchableOpacity>
        <LogoIcon width={45} height={45} fill={BLUE_COLOR} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.mainTitle}>Como se cadastrar para</Text>
        <View style={styles.subtitleRow}>
          <Text style={styles.highlightText}>Campo grande • Serviços • </Text>
          <MaterialCommunityIcons name="wrench" size={28} color="#000" />
        </View>

        {/* Nome dinâmico aqui */}
        <Text style={styles.welcomeText}>Olá, {primeiroNome}</Text>
        
        <Text style={styles.instructionText}>
          Conclua as etapas abaixo para ativar seu perfil e começar a receber pedidos no seu bairro.
        </Text>

        <View style={styles.progressRow}>
          {etapas.map((_, index) => (
            <View 
              key={index} 
              style={[
                styles.progressBar, 
                index < concluidasCount ? styles.barActive : styles.barInactive
              ]} 
            />
          ))}
        </View>

        <View style={styles.checklistContainer}>
          {etapas.map((item) => {
            const isDone = etapasConcluidas.includes(item.id);
            return (
              <TouchableOpacity 
                key={item.id} 
                style={styles.stepItem}
                onPress={() => {
                  if (item.rota) {
                    navigation.navigate(item.rota);
                  } else {
                    console.log(`Rota para ${item.titulo} não configurada ainda.`);
                  }
                }}
              >
                <View style={styles.stepTextContainer}>
                  <Text style={[styles.stepTitle, isDone && styles.textDone]}>{item.titulo}</Text>
                  <Text style={styles.stepSubtitle}>{item.sub}</Text>
                </View>

                {isDone ? (
                  <Ionicons name="checkmark-circle" size={28} color={BLUE_COLOR} style={styles.checkIcon} />
                ) : (
                  <Ionicons name="chevron-forward" size={24} color="#888" style={styles.checkIcon} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Button 
          title="Continuar" 
          onPress={() => {
            console.log('Dados prontos para o banco:', formData);
            navigation.navigate("ProfissionalStack");
          }} 
          disabled={false} 
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#DBDBDB' },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingTop: 15,
  },
  scrollContent: { 
    paddingHorizontal: 25, 
    paddingTop: 20 
},
  mainTitle: { 
    fontFamily: 'Homenaje_400Regular', 
    fontSize: 32, 
    color: '#000' 
},
  subtitleRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: -5 
},
  highlightText: { 
    fontFamily: 'Homenaje_400Regular', 
    fontSize: 36, 
    color: '#000' 
},
  welcomeText: { 
    fontFamily: 'Homenaje_400Regular', 
    fontSize: 36, 
    color: '#000', 
    marginTop: 15 
},
  instructionText: { 
    fontFamily: 'Homenaje_400Regular', 
    fontSize: 18, 
    color: '#555', 
    marginBottom: 15 
},
  progressRow: { 
    flexDirection: 'row', 
    width: '100%', 
    gap: 6, 
    marginBottom: 20 
},
  progressBar: { 
    flex: 1, 
    height: 6, 
    borderRadius: 3 
},
  barActive: { 
    backgroundColor: BLUE_COLOR 
},
  barInactive: { 
    backgroundColor: '#FFF' 
},
  checklistContainer: { 
    borderTopWidth: 1, 
    borderColor: GRAY_LINE 
},
  stepItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: GRAY_LINE,
  },
  stepTextContainer: { 
    flex: 1, 
    paddingRight: 10 
},
  stepTitle: { 
    fontFamily: 'Homenaje_400Regular', 
    fontSize: 24, 
    color: '#333' 
},
  textDone: { 
    color: BLUE_COLOR 
},
  stepSubtitle: { 
    fontFamily: 'Homenaje_400Regular', 
    fontSize: 15, 
    color: BLUE_COLOR, 
    marginTop: 2 
},
  checkIcon: { 
    marginLeft: 10 
},
  footer: { 
    paddingHorizontal: 25, 
    paddingVertical: 20, 
    alignItems: 'center' 
}
});