import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import LogoIcon from '../assets/icons/LogoIcon';
import { Button } from '../components/Button';

const BLUE_COLOR = '#076BDE';

const TEXTOS_LEGAIS = {
  uso: {
    titulo: 'Termos de Uso do Profissional',
    texto: '1. Aceitação dos Termos\nAo se cadastrar como profissional, você concorda em cumprir todas as diretrizes de intermediação de serviços locais no bairro de Campo Grande e adjacências.\n\n2. Cadastro e Perfil\nO profissional obriga-se a fornecer informações verídicas, incluindo documentos de identificação (RG/CNNH) e comprovante de residência válidos. Perfis fakes ou com dados de terceiros serão banidos imediatamente.\n\n3. Prestação do Serviço\nToda a negociação, execução e garantia do serviço prestado é de responsabilidade exclusiva do profissional. A plataforma atua apenas como facilitadora de contato entre o cliente e o prestador.'
  },
  privacidade: {
    titulo: 'Política de Privacidade e Dados',
    texto: '1. Coleta de Dados\nColetamos seus dados cadastrais (Nome, CPF, Especialidades) e arquivos de mídia (Foto de perfil, Documento de Identidade, Comprovante de Residência) para fins estritos de segurança e validação de antecedentes.\n\n2. Uso das Informações\nSeus documentos confidenciais nunca serão exibidos publicamente no seu perfil. Apenas seu primeiro nome, especialidades e portfólio de fotos serão visíveis para os clientes do aplicativo.\n\n3. Segurança (LGPD)\nTratamos seus dados em total conformidade com a Lei Geral de Proteção de Dados (LGPD), utilizando armazenamento criptografado no banco de dados.'
  },
  conduta: {
    titulo: 'Código de Conduta e Segurança',
    texto: '1. Respeito Mútuo\nNão toleramos qualquer tipo de discriminação, grosseria ou conduta inapropriada com os clientes da plataforma.\n\n2. Segurança em Atendimentos\nPor se tratar de serviços residenciais (eletricista, encanador, pintor, mecânico, pedreiro), o profissional deve prezar pela máxima segurança e integridade física no local de trabalho.\n\n3. Penalidades\nAvisos de atrasos constantes, cobranças indevidas fora do combinado ou avaliações severamente baixas resultarão na suspensão temporária ou exclusão permanente do prestador.'
  }
};

export default function TelaTextoTermos({ navigation, route }) {
  const { id } = route.params || {};
  const documento = TEXTOS_LEGAIS[id] || { titulo: 'Documento', texto: 'Texto não encontrado.' };

  const handleEntendido = () => {
    navigation.navigate({
      name: 'TelaTermos',
      params: { documentoLidoId: id },
      merge: true,
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={32} color="#000" />
        </TouchableOpacity>
        <LogoIcon width={45} height={45} fill={BLUE_COLOR} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{documento.titulo}</Text>
        
        <View style={styles.textBox}>
          <ScrollView showsVerticalScrollIndicator={true}>
            <Text style={styles.text}>{documento.texto}</Text>
          </ScrollView>
        </View>

        <View style={styles.footer}>
          <Button title="Li e entendi" onPress={handleEntendido} />
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
  headerRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 25, 
    paddingTop: 15 
},
  content: { 
    flex: 1, 
    paddingHorizontal: 25, 
    paddingTop: 20 
},
  title: { 
    fontFamily: 'Homenaje_400Regular', 
    fontSize: 30, 
    color: '#000', 
    marginBottom: 20 
},
  textBox: { 
    flex: 1, 
    backgroundColor: '#FFF', 
    borderRadius: 10, 
    padding: 15, 
    marginBottom: 20, 
    borderWidth: 1, 
    borderColor: '#CCC' 
},
  text: { 
    fontFamily: 'Homenaje_400Regular', 
    fontSize: 18, 
    color: '#333', 
    lineHeight: 24 
},
  footer: { 
    paddingVertical: 10, 
    alignItems: 'center' 
}
});