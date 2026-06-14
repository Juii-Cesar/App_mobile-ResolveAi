import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, ActivityIndicator, Easing, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

import { supabase } from '../services/supabase';

const BLUE_COLOR = '#076BDE';

const ESTADO = { BUSCANDO: 'buscando', ENCONTRADO: 'encontrado', CHAT_NOTIF: 'chat_notif' };

export default function TelaBuscarProfissional({ navigation, route }) {
  const insets = useSafeAreaInsets();
  
  // CORREÇÃO: Recebendo "endereco" corretamente da TelaInformarProblema
  const { descricao, prioridade, categoria, endereco, latDigitada, lngDigitada } = route?.params ?? {};

  const [estado, setEstado] = useState(ESTADO.BUSCANDO);
  const [notifChat, setNotifChat] = useState(0);
  const [location, setLocation] = useState(null);
  
  const [servicoId, setServicoId] = useState(null);
  const [dadosProfissional, setDadosProfissional] = useState(null);
  
  const [modalAlerta, setModalAlerta] = useState(null);
  const [taxaAplicada, setTaxaAplicada] = useState(0); 

  const pulsoAnim = useRef(new Animated.Value(1)).current;
  const gavelaAnim = useRef(new Animated.Value(0)).current;
  const mapRef = useRef(null);

  useEffect(() => {
    if (estado === ESTADO.BUSCANDO) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulsoAnim, { toValue: 1.15, duration: 700, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
          Animated.timing(pulsoAnim, { toValue: 1, duration: 700, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
        ])
      ).start();
    } else {
      pulsoAnim.stopAnimation();
      pulsoAnim.setValue(1);
    }
  }, [estado]);

  useEffect(() => {
    let channel;

    async function prepararEBuscar() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        let latFinal = latDigitada;
        let lngFinal = lngDigitada;
        let endFinal = endereco; // Usando o endereço que veio da tela anterior

        if (!latFinal || !lngFinal) {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            setModalAlerta({
              titulo: 'Permissão Negada',
              mensagem: 'Precisamos da sua localização para encontrar profissionais próximos.',
              tipo: 'aviso',
              onConfirm: () => navigation.goBack() 
            });
            return;
          }
          
          let loc = await Location.getCurrentPositionAsync({});
          latFinal = loc.coords.latitude;
          lngFinal = loc.coords.longitude;
          
          if (!endFinal) {
            let addressArr = await Location.reverseGeocodeAsync({ latitude: latFinal, longitude: lngFinal });
            if (addressArr && addressArr.length > 0) {
              const rua = addressArr[0].street || addressArr[0].name || '';
              const bairro = addressArr[0].district || addressArr[0].subregion || '';
              endFinal = `${rua}, ${bairro}`.trim();
            } else {
              endFinal = "Localização Atual (GPS)";
            }
          }
        }

        setLocation({ latitude: latFinal, longitude: lngFinal });

        const { data: profData } = await supabase.from('profissoes').select('id').ilike('nome', categoria).maybeSingle();
        const idProf = profData ? profData.id : null;

        let valorTaxa = 10; 
        if (prioridade === 'Urgente') valorTaxa = 20;
        else if (prioridade === 'Alta') valorTaxa = 15;
        else if (prioridade === 'Normal') valorTaxa = 10;
        
        setTaxaAplicada(valorTaxa);

        // TENTA INSERIR NO BANCO
        const { data: servicoData, error } = await supabase.from('servicos')
          .insert({
            idcliente: user.id,
            idprofissao: idProf,
            descricao: descricao,
            status: 'procurandoProfissional',
            latitude: latFinal,
            longitude: lngFinal,
            endereco: endFinal,
            taxa_prioridade: valorTaxa 
          })
          .select('id')
          .single();

        // SE DER ERRO, AGORA MOSTRA O MOTIVO EXATO NA TELA!
        if (error || !servicoData) {
          console.log("Erro ao criar serviço no Supabase:", error);
          setModalAlerta({
            titulo: 'Erro no Banco de Dados',
            mensagem: `Motivo: ${error?.message || 'Erro desconhecido. Verifique se a coluna taxa_prioridade existe.'}\nTire um print para o Júlio!`,
            tipo: 'erro',
            onConfirm: () => navigation.goBack()
          });
          return;
        }

        setServicoId(servicoData.id);

        channel = supabase.channel(`servico_${servicoData.id}`)
          .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'servicos', filter: `id=eq.${servicoData.id}` }, 
            async (payload) => {
              if (payload.new.status === 'servicoAceito' && payload.new.idprofissional) {
                const { data: profAceitou } = await supabase.from('usuarios').select('nome, avaliacaomedia').eq('id', payload.new.idprofissional).single();
                
                setDadosProfissional({
                  nome: profAceitou?.nome || 'Profissional Localizado',
                  avaliacao: profAceitou?.avaliacaomedia || '5.0'
                });
                
                setEstado(ESTADO.ENCONTRADO);
                Animated.spring(gavelaAnim, { toValue: 1, tension: 50, friction: 8, useNativeDriver: true }).start();
              }
            }
          ).subscribe();

      } catch (err) {
        console.log("Erro no bloco principal de busca:", err);
      }
    }

    prepararEBuscar();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (estado === ESTADO.ENCONTRADO) {
      const timer = setTimeout(() => {
        setEstado(ESTADO.CHAT_NOTIF);
        setNotifChat(1);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [estado]);

  async function handleCancelarBusca() {
    if (servicoId && estado === ESTADO.BUSCANDO) {
      await supabase.from('servicos').delete().eq('id', servicoId);
    }
    navigation.goBack();
  }

  function handleFecharAlerta() {
    const acaoConfirmar = modalAlerta?.onConfirm;
    setModalAlerta(null);
    if (acaoConfirmar) {
      acaoConfirmar();
    }
  }

  const gavelaTranslate = gavelaAnim.interpolate({ inputRange: [0, 1], outputRange: [250, 0] });
  const espacoExtraBotao = insets.bottom > 0 ? insets.bottom : 15;

  return (
    <View style={styles.container}>

      <Modal animationType="fade" transparent={true} visible={!!modalAlerta} onRequestClose={handleFecharAlerta}>
        <View style={styles.modalFundoOverlay}>
          <View style={styles.modalCard}>
            <Ionicons name={modalAlerta?.tipo === 'aviso' ? 'warning' : 'alert-circle'} size={80} color={modalAlerta?.tipo === 'aviso' ? '#F5A623' : '#D32F2F'} style={{ marginBottom: 10 }} />
            <Text style={[styles.modalTitle, { color: modalAlerta?.tipo === 'aviso' ? '#F5A623' : '#D32F2F' }]}>{modalAlerta?.titulo}</Text>
            <Text style={styles.modalText}>{modalAlerta?.mensagem}</Text>
            <TouchableOpacity style={[styles.modalBtnEntendi, { backgroundColor: modalAlerta?.tipo === 'aviso' ? '#F5A623' : '#D32F2F' }]} onPress={handleFecharAlerta} activeOpacity={0.8}>
              <Text style={styles.modalBtnEntendiText}>Entendi</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <MapView 
        ref={mapRef} 
        style={StyleSheet.absoluteFillObject} 
        region={{
          latitude: location ? location.latitude : -22.9022,
          longitude: location ? location.longitude : -43.5587,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation={true}
        showsCompass={false}
        showsMyLocationButton={false}
        toolbarEnabled={false}
      >
        {location && estado === ESTADO.ENCONTRADO && (
          <Marker coordinate={{ latitude: location.latitude + 0.005, longitude: location.longitude + 0.005 }} />
        )}
      </MapView>

      <View style={[styles.camadaSobreposicao, { paddingTop: insets.top + 10 }]} pointerEvents="box-none">
        
        <View style={styles.headerFlutuante} pointerEvents="box-none">
          <TouchableOpacity style={styles.btnVoltar} onPress={handleCancelarBusca} activeOpacity={0.8}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        {estado === ESTADO.BUSCANDO && (
          <View style={styles.buscandoContainer} pointerEvents="none">
            <Animated.View style={[styles.buscandoPulso, { transform: [{ scale: pulsoAnim }] }]}>
              <ActivityIndicator size="large" color={BLUE_COLOR} />
            </Animated.View>
            <Text style={styles.buscandoTexto}>Buscando profissional ...</Text>
            
            {taxaAplicada > 0 && (
              <View style={styles.taxaBadgeContainer}>
                <Ionicons name="cash-outline" size={20} color="#FFF" />
                <Text style={styles.taxaBadgeTexto}>+ Taxa {prioridade || 'Normal'}: R$ {taxaAplicada},00</Text>
              </View>
            )}

          </View>
        )}

        {estado !== ESTADO.BUSCANDO ? (
          <Animated.View style={[styles.gaveta, { transform: [{ translateY: gavelaTranslate }], paddingBottom: espacoExtraBotao + 10 }]}>
            <View style={styles.traco} />

            <View style={styles.profissionalCard}>
              <View style={styles.avatar}>
                <Ionicons name="person-outline" size={32} color="#444" />
              </View>

              <View style={styles.profissionalInfo}>
                <Text style={styles.profissionalNome}>{dadosProfissional?.nome || 'Profissional Localizado'}</Text>
                <Text style={styles.profissionalDetalhe}>Está a caminho</Text>
                <Text style={styles.textoTaxaGaveta}>Taxa adicional: R$ {taxaAplicada},00</Text>
              </View>

              <View style={styles.avaliacaoContainer}>
                <Ionicons name="star" size={18} color="#F5A623" />
                <Text style={styles.avaliacaoNota}>{dadosProfissional?.avaliacao || '5.0'}</Text>
                <Text style={styles.profissionalDetalhe}>{categoria || 'Serviços'}</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.btnChat} onPress={() => navigation.navigate('TelaChat', { profissionalNome: dadosProfissional?.nome || 'Profissional Localizado' })} activeOpacity={0.8}>
              <Ionicons name="chatbubble-outline" size={24} color="#FFF" />
              <Text style={styles.btnChatTexto}> Chat</Text>

              {estado === ESTADO.CHAT_NOTIF && notifChat > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeTexto}>{notifChat}</Text>
                </View>
              )}
            </TouchableOpacity>
          </Animated.View>
        ) : (
          <View style={{ flex: 1 }} pointerEvents="none" />
        )}

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#D9D9D9' },
  camadaSobreposicao: { flex: 1, justifyContent: 'space-between' },
  headerFlutuante: { paddingHorizontal: 20 },
  btnVoltar: { width: 44, height: 44, borderRadius: 22, backgroundColor: BLUE_COLOR, justifyContent: 'center', alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 3 },
  buscandoContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  buscandoPulso: { width: 70, height: 70, borderRadius: 35, backgroundColor: 'rgba(255,255,255,0.9)', justifyContent: 'center', alignItems: 'center', elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5 },
  buscandoTexto: { fontFamily: 'Homenaje_400Regular', fontSize: 32, color: '#111', marginTop: 20, textShadowColor: 'rgba(255, 255, 255, 0.8)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 },
  taxaBadgeContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#388E3C', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, marginTop: 15, elevation: 5 },
  taxaBadgeTexto: { fontFamily: 'Homenaje_400Regular', fontSize: 20, color: '#FFF', marginLeft: 6 },
  textoTaxaGaveta: { fontFamily: 'Homenaje_400Regular', fontSize: 16, color: '#388E3C', marginTop: 2 },
  gaveta: { backgroundColor: '#EAEAEA', borderTopLeftRadius: 40, borderTopRightRadius: 40, paddingHorizontal: 25, paddingTop: 15, elevation: 15, shadowColor: '#000', shadowOffset: { width: 0, height: -5 }, shadowOpacity: 0.2, shadowRadius: 10 },
  traco: { width: 50, height: 6, borderRadius: 3, backgroundColor: '#111', alignSelf: 'center', marginBottom: 20 },
  profissionalCard: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: '#A0A8B0', borderRadius: 20, backgroundColor: '#FFF', paddingVertical: 12, paddingHorizontal: 15, marginBottom: 15 },
  avatar: { width: 50, height: 50, borderRadius: 15, backgroundColor: '#D1D7DC', justifyContent: 'center', alignItems: 'center', marginRight: 15, borderWidth: 1, borderColor: '#7A8A9E' },
  profissionalInfo: { flex: 1 },
  profissionalNome: { fontFamily: 'Homenaje_400Regular', fontSize: 20, color: '#111' },
  profissionalDetalhe: { fontFamily: 'Homenaje_400Regular', fontSize: 16, color: '#7A8A9E' },
  avaliacaoContainer: { alignItems: 'center' },
  avaliacaoNota: { fontFamily: 'Homenaje_400Regular', fontSize: 18, color: '#111' },
  btnChat: { height: 55, backgroundColor: BLUE_COLOR, borderRadius: 20, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', elevation: 3, borderWidth: 1.5, borderColor: '#333' },
  btnChatTexto: { color: '#FFF', fontFamily: 'Homenaje_400Regular', fontSize: 26, marginLeft: 5 },
  badge: { position: 'absolute', top: -5, right: 10, width: 22, height: 22, borderRadius: 11, backgroundColor: '#D32F2F', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFF' },
  badgeTexto: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  modalFundoOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.6)', justifyContent: 'center', alignItems: 'center' },
  modalCard: { backgroundColor: '#EAEAEA', width: '85%', borderRadius: 30, padding: 30, alignItems: 'center', elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5 },
  modalTitle: { fontFamily: 'Homenaje_400Regular', fontSize: 28, textAlign: 'center', marginBottom: 10 },
  modalText: { fontFamily: 'Homenaje_400Regular', fontSize: 20, color: '#000', textAlign: 'center', marginBottom: 25, lineHeight: 22 },
  modalBtnEntendi: { width: '100%', height: 55, borderRadius: 28, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: '#000' },
  modalBtnEntendiText: { fontFamily: 'Homenaje_400Regular', fontSize: 26, color: '#FFF' },
});