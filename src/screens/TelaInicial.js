import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, Modal, TextInput } from 'react-native';

const BLUE_COLOR = '#076BDE';
const BG_GRAY = '#DBDBDB'; 
const WHITE_COLOR = '#FFFFFF';
const MODAL_BG = '#F1F4F6';

export default function TelaInicial({ navigation }) {
  const [modalVisivel, setModalVisivel] = useState(false);

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
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setModalVisivel(false)}
        >
          <View style={styles.bottomSheet} onStartShouldSetResponder={() => true}>

            <View style={styles.dragHandle} />
            <View style={styles.phoneRow}>
              <View style={styles.dddBox}>
                <Text style={styles.inputText}>(  ) ▼</Text>
              </View>
              <TextInput 
                style={styles.phoneInput} 
                keyboardType="phone-pad" 
                placeholder="Número do celular"
              />
            </View>

            <TouchableOpacity style={styles.modalButton}>
              <Text style={styles.modalButtonText}>ENTRAR</Text>
            </TouchableOpacity>

            <View style={styles.dividerRow}>
              <View style={styles.line} />
              <Text style={styles.ouText}>OU</Text>
              <View style={styles.line} />
            </View>

            <TouchableOpacity style={styles.socialButton}>
              <Text style={styles.socialButtonText}>Continuar com o Google</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialButton}>
              <Text style={styles.socialButtonText}>Continuar por e-mail</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  bottomSheet: {
    backgroundColor: MODAL_BG,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  dragHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#CCC',
    borderRadius: 3,
    marginBottom: 20,
  },
  phoneRow: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 15,
  },
  dddBox: {
    borderWidth: 1,
    borderColor: '#000',
    padding: 10,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: WHITE_COLOR,
  },
  phoneInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#000',
    padding: 10,
    backgroundColor: WHITE_COLOR,
    fontFamily: 'Homenaje_400Regular',
    fontSize: 20,
  },
  inputText: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 20,
  },
  modalButton: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#000',
    padding: 10,
    alignItems: 'center',
    backgroundColor: WHITE_COLOR,
    marginBottom: 15,
  },
  modalButtonText: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 24,
    textTransform: 'uppercase',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#000',
  },
  ouText: {
    marginHorizontal: 10,
    fontFamily: 'Homenaje_400Regular',
    fontSize: 24,
    textTransform: 'lowercase',
  },
  socialButton: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#000',
    padding: 10,
    alignItems: 'center',
    backgroundColor: WHITE_COLOR,
    marginBottom: 10,
  },
  socialButtonText: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 20,
  },
});