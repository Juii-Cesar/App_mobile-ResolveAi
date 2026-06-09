import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../services/supabase';
// import { GoogleSignin } from '@react-native-google-signin/google-signin';

const BLUE_COLOR = '#076BDE';
const BG_GRAY = '#DBDBDB'; 
const WHITE_COLOR = '#FFFFFF';
const MODAL_BG = '#F1F4F6';

export default function TelaInicial({ navigation }) {
  const [modalVisivel, setModalVisivel] = useState(false);
  const [email, setEmail] = useState('');
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    // GoogleSignin.configure({
    //   webClientId: ' ', 
    // });
  }, []);

  const handleLoginEmail = async () => {
    const emailLimpo = email.toLowerCase().trim();

    if (!emailLimpo || !emailLimpo.includes('@')) {
      Alert.alert('E-mail inválido', 'Por favor, insira um endereço de e-mail válido.');
      return;
    }

    setCarregando(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailLimpo,
        password: '12345678',
      });

      if (error) throw error;

      console.log('Sessão validada com sucesso!', data.session);

      setModalVisivel(false);

      navigation.navigate('TelaTipoConta');

    } catch (error) {
      Alert.alert('Erro de Autenticação', error.message || 'Não foi possível fazer o login.');
    } finally {
      setCarregando(false);
    }
  };

  const handleLoginGoogle = async () => {
    Alert.alert('Aviso', 'Login do Google desativado temporariamente para uso no Expo Go.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        
        <View style={styles.textGroup}>
          <Text style={styles.blueText}>RESOL</Text>
          <Text style={styles.blueText}>VE</Text>
          <Text style={styles.whiteText}>AÍ</Text>
        </View>

        <TouchableOpacity 
          style={styles.button}
          onPress={() => setModalVisivel(true)}
        >
          <Text style={styles.buttonText}>ENTRAR</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisivel}
        onRequestClose={() => setModalVisivel(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setModalVisivel(false)}>
          <View style={styles.bottomSheet} onStartShouldSetResponder={() => true}>
            
            <View style={styles.dragHandle} />

            <View style={styles.emailRow}>
              <TextInput 
                style={styles.emailInput} 
                keyboardType="email-address"
                placeholder="Email"
                placeholderTextColor="#666"
                value={email}
                onChangeText={(texto) => setEmail(texto)}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <TouchableOpacity 
              style={styles.modalButton}
              onPress={handleLoginEmail}
              disabled={carregando}
            >
              {carregando ? (
                <ActivityIndicator color={WHITE_COLOR} size="small" />
              ) : (
                <Text style={styles.modalButtonText}>ENTRAR</Text>
              )}
            </TouchableOpacity>

            <View style={styles.dividerRow}>
              <View style={styles.line} />
              <Text style={styles.ouText}>ou</Text>
              <View style={styles.line} />
            </View>

            <TouchableOpacity 
              style={styles.socialButton}
              activeOpacity={0.7}
              onPress={handleLoginGoogle}
              disabled={carregando}
            >
              {carregando ? (
                <ActivityIndicator color="#000" size="small" />
              ) : (
                <Text style={styles.socialButtonText}>Continuar com o Google</Text>
              )}
            </TouchableOpacity>

          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: BG_GRAY 
  },
  content: { 
    flex: 1, 
    padding: 30, 
    justifyContent: 'space-between'
  },
  textGroup: { 
    marginTop: 100 
  },
  blueText: { 
    fontFamily: 'Homenaje_400Regular', 
    fontSize: 128, 
    color: BLUE_COLOR, 
    lineHeight: 115 
  },
  whiteText: { 
    fontFamily: 'Homenaje_400Regular', 
    fontSize: 128, 
    color: WHITE_COLOR, 
    lineHeight: 115 
  },
  button: { 
    backgroundColor: BLUE_COLOR, 
    borderRadius: 30, 
    paddingVertical: 20, 
    alignItems: 'center', 
    marginBottom: 40 
  },
  buttonText: { 
    fontFamily: 'Homenaje_400Regular', 
    color: WHITE_COLOR, 
    fontSize: 48, 
    textTransform: 'uppercase' 
  },
  modalOverlay: { 
    flex: 1, 
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.4)' 
  },
  bottomSheet: { 
    backgroundColor: MODAL_BG, 
    borderTopLeftRadius: 45, 
    borderTopRightRadius: 45, 
    paddingHorizontal: 35, 
    paddingTop: 15, 
    paddingBottom: 50, 
    alignItems: 'center',
    width: '100%'
  },
  dragHandle: { 
    width: 50, 
    height: 5, 
    backgroundColor: '#000', 
    borderRadius: 3, 
    marginBottom: 25 
  },
  emailRow: { 
    flexDirection: 'row', 
    width: '100%', 
    marginBottom: 20, 
    height: 55 
  },
  emailInput: { 
    flex: 1, 
    borderWidth: 1.5, 
    borderColor: '#BFC5C9', 
    borderRadius: 15, 
    paddingHorizontal: 20, 
    backgroundColor: '#EAEAEA', 
    fontFamily: 'Homenaje_400Regular', 
    fontSize: 26, 
    color: '#000' 
  },
  modalButton: { 
    width: '100%', 
    borderRadius: 30, 
    borderWidth: 2, 
    borderColor: '#000', 
    paddingVertical: 10, 
    alignItems: 'center', 
    backgroundColor: BLUE_COLOR, 
    marginBottom: 15, 
    height: 55, 
    justifyContent: 'center'
  },
  modalButtonText: { 
    fontFamily: 'Homenaje_400Regular', 
    fontSize: 34, 
    color: WHITE_COLOR 
  },
  dividerRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    width: '100%', 
    marginBottom: 15 
  },
  line: { 
    flex: 1, 
    height: 1, 
    backgroundColor: '#000' 
  },
  ouText: { 
    marginHorizontal: 15, 
    fontFamily: 'Homenaje_400Regular', 
    fontSize: 34, 
    color: '#000' 
  },
  socialButton: { 
    width: '85%', 
    borderWidth: 1.5, 
    borderColor: '#BFC5C9', 
    borderRadius: 12, 
    paddingVertical: 10, 
    alignItems: 'center', 
    backgroundColor: '#EAEAEA', 
    marginBottom: 10, 
    height: 50, 
    justifyContent: 'center'
  },
  socialButtonText: { 
    fontFamily: 'Homenaje_400Regular', 
    fontSize: 28, 
    color: '#000' 
  },
});