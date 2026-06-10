import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import LogoIcon from '../assets/icons/LogoIcon';
import { Button } from '../components/Button';
import { useRegistration } from "../context/RegistrationContext";
import { supabase } from '../services/supabase';
import { File } from 'expo-file-system';
import { decode } from 'base64-arraybuffer';

const BLUE_COLOR = '#076BDE';
const GRAY_LINE = '#CCCCCC';

export default function TelaVerificacao({ navigation, route }) {
  const { formData } = useRegistration();

  const [etapasExtras, setEtapasExtras] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const novasEtapas = [...etapasExtras];
    if (route.params?.residenciaConcluido && !novasEtapas.includes('residencia')) novasEtapas.push('residencia');
    if (route.params?.termosConcluidos && !novasEtapas.includes('termos')) novasEtapas.push('termos');
    if (route.params?.documentoConcluido && !novasEtapas.includes('documento')) novasEtapas.push('documento');
    if (route.params?.fotoConcluida && !novasEtapas.includes('foto')) novasEtapas.push('foto');

    if (novasEtapas.length > etapasExtras.length) {
      setEtapasExtras(novasEtapas);
    }
  }, [route.params]);

  const etapasConcluidas = [
    ...(formData.fotoPerfil ? ['foto'] : []),
    ...(formData.docFrente && formData.docVerso ? ['documento'] : []),
    ...(formData.comprovanteResidencia ? ['residencia'] : []),
    ...(formData.portfolio && formData.portfolio.length > 0 ? ['portfolio'] : []),
    ...(formData.termosAceitos ? ['termos'] : []),
    ...etapasExtras
  ];

  const primeiroNome = formData.nome ? formData.nome.split(' ')[0] : 'Visitante';

  const etapas = [
    { id: 'foto', titulo: 'Foto de perfil', sub: 'Em um app de serviço, ver o rosto do profissional gera muita confiança para o cliente.', rota: 'TelaFotoPerfil', obrigatoria: true },
    { id: 'documento', titulo: 'Documento de Identidade (RG ou CNH)', sub: 'Obrigatório para validar quem é você.', rota: 'TelaDocumento', obrigatoria: true },
    { id: 'residencia', titulo: 'Comprovante de Residência', sub: 'Para confirmar sua área de atuação local.', rota: 'TelaResidencia', obrigatoria: true },
    { id: 'portfolio', titulo: 'Fotos de Serviços Anteriores (Opcional)', sub: 'Monte seu portfólio para se destacar.', rota: 'TelaPortifolio', obrigatoria: false },
    { id: 'termos', titulo: 'Termos de Uso e Regras da Comunidade', sub: 'Leia e aceite para continuar.', rota: 'TelaTermos', obrigatoria: true },
    { id: 'antecedentes', titulo: 'Análise de Antecedentes', sub: 'Aguardando o envio dos documentos acima.', rota: '', obrigatoria: false },
  ];

  const todasObrigatoriasConcluidas = etapas
    .filter(e => e.obrigatoria)
    .every(e => etapasConcluidas.includes(e.id));

  const concluidasCount = etapasConcluidas.length;

  const handleFinalizarCadastro = async () => {
    setIsLoading(true);
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error("Usuário não autenticado. Faça login novamente.");

      const nomeCompleto = formData.nome ? `${formData.nome} ${formData.sobrenome || ''}`.trim() : 'Profissional';
      
      const { error: erroUsuario } = await supabase
        .from('usuarios')
        .upsert({
          id: user.id,
          nome: nomeCompleto,
          cpf: formData.cpf,
          tipo: 'profissional',
          statuscadastro: 'pendente'
        });

      if (erroUsuario) {
        throw new Error("Erro ao criar usuário no banco: " + erroUsuario.message);
      }

      const uploadFile = async (uri, bucket, prefix) => {
        if (!uri) return null;

        const localFile = new File(uri);
        const base64 = await localFile.base64();

        const fileExt = uri.split('.').pop() || 'jpg';
        const fileName = `${user.id}/${prefix}_${Date.now()}.${fileExt}`;
        const contentType = fileExt === 'png' ? 'image/png' : 'image/jpeg';

        const { data, error } = await supabase.storage
          .from(bucket)
          .upload(fileName, decode(base64), { 
            contentType: contentType,
            upsert: true 
          });
          
        if (error) throw error;

        if (bucket === 'perfis_e_portfolios') {
          const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(fileName);
          return publicData.publicUrl;
        }
        return data.path;
      };

      const fotoPerfilUrl = await uploadFile(formData.fotoPerfil, 'perfis_e_portfolios', 'perfil');
      const docFrenteUrl = await uploadFile(formData.docFrente, 'documentos-sigilosos', 'doc_frente');
      const docVersoUrl = await uploadFile(formData.docVerso, 'documentos-sigilosos', 'doc_verso');
      const compResidenciaUrl = await uploadFile(formData.comprovanteResidencia, 'documentos-sigilosos', 'residencia');

      let portfolioUrls = [];
      if (formData.portfolio && formData.portfolio.length > 0) {
        for (let i = 0; i < formData.portfolio.length; i++) {
          const url = await uploadFile(formData.portfolio[i], 'perfis_e_portfolios', `portfolio_${i}`);
          portfolioUrls.push(url);
        }
      }

      const { error: dbError } = await supabase
        .from('documentos_profissional')
        .insert({
          idprofissional: user.id,
          fotoperfilurl: fotoPerfilUrl,
          docfrenteurl: docFrenteUrl,
          docversourl: docVersoUrl,
          comprovanteresidenciaurl: compResidenciaUrl,
          portfoliourls: portfolioUrls.length > 0 ? portfolioUrls : null,
          termosaceitos: formData.termosAceitos || true
        });

      if (dbError) {
        console.log("ERRO COMPLETO DO BANCO:", dbError);
        throw new Error("Erro DB: " + dbError.message);
      }

      navigation.navigate("ProfissionalStack");

    } catch (error) {
      console.error("Erro no upload: ", error);
      Alert.alert("Erro", "Ocorreu um problema ao finalizar seu cadastro. " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} disabled={isLoading}>
          <Ionicons name="arrow-back" size={32} color={isLoading ? "#888" : "#000"} />
        </TouchableOpacity>
        <LogoIcon width={45} height={45} fill={BLUE_COLOR} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.mainTitle}>Como se cadastrar para</Text>
        <View style={styles.subtitleRow}>
          <Text style={styles.highlightText}>Campo grande • Serviços • </Text>
          <MaterialCommunityIcons name="wrench" size={28} color="#000" />
        </View>

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
                disabled={item.id === 'antecedentes' || isLoading}
                onPress={() => {
                  if (item.rota) {
                    navigation.navigate(item.rota);
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
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={BLUE_COLOR} />
            <Text style={styles.loadingText}>Enviando documentos...</Text>
          </View>
        ) : (
          <Button 
            title="Continuar" 
            onPress={handleFinalizarCadastro} 
            disabled={!todasObrigatoriasConcluidas} 
          />
        )}
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
    paddingTop: 15 
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
    borderColor: GRAY_LINE 
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
  },
  loadingContainer: { 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingVertical: 10 
  },
  loadingText: { 
    fontFamily: 'Homenaje_400Regular', 
    fontSize: 18, 
    color: BLUE_COLOR, 
    marginTop: 10 
  }
});