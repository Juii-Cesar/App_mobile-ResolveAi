import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, Modal, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const BLUE_COLOR = '#076BDE';
const BG_GRAY = '#DBDBDB'; 
const WHITE_COLOR = '#FFFFFF';
const MODAL_BG = '#F1F4F6';

export default function TelaInicial({ navigation }) {
  const [modalVisivel, setModalVisivel] = useState(false);
  
  const [ddd, setDdd] = useState('21'); 
  const [telefone, setTelefone] = useState('');

  const formatarTelefone = (texto) => {
    let num = texto.replace(/\D/g, '');

    if (num.length > 5) {
      num = num.replace(/^(\d{5})(\d)/, '$1-$2');
    }
    setTelefone(num);
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
            <View style={styles.phoneRow}>

              <View style={styles.dddBox}>

                <View style={styles.fakePickerUI} pointerEvents="none">
                  <Text style={styles.fakePickerText}>({ddd})</Text>
                  <Text style={styles.fakePickerIcon}>▼</Text>
                </View>

                <Picker
                  selectedValue={ddd}
                  onValueChange={(itemValue) => setDdd(itemValue)}
                  style={styles.invisiblePicker}
                  mode="dropdown"
                >
                  <Picker.Item label="(11)" value="11" />
                  <Picker.Item label="(21)" value="21" />
                  <Picker.Item label="(31)" value="31" />
                  <Picker.Item label="(41)" value="41" />
                  <Picker.Item label="(51)" value="51" />
                </Picker>
              </View>

              <TextInput 
                style={styles.phoneInput} 
                keyboardType="numeric"
                placeholder="99999-9999"
                value={telefone}
                onChangeText={formatarTelefone}
                maxLength={10}
              />
            </View>

            <TouchableOpacity 
              style={styles.modalButton}
              onPress={() => {
                setModalVisivel(false);
                navigation.navigate('Token');
              }}
            >
              <Text style={styles.modalButtonText}>ENTRAR</Text>
            </TouchableOpacity>

            <View style={styles.dividerRow}>
              <View style={styles.line} />
              <Text style={styles.ouText}>OU</Text>
              <View style={styles.line} />
            </View>

            <TouchableOpacity 
              style={styles.socialButton}
              activeOpacity={0.7}
              onPress={() => console.log('Botão Google clicado!')}
            >
              <Text style={styles.socialButtonText}>Continuar com o Google</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.socialButton}
              activeOpacity={0.7}
              onPress={() => console.log('Botão E-mail clicado!')}
            >
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
    marginTop: 100 },
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
    marginBottom: 20 
  },
  phoneRow: { 
    flexDirection: 'row', 
    width: '100%', 
    marginBottom: 15, 
    height: 55 
  },
  dddBox: {
    borderWidth: 1,
    borderColor: '#000',
    marginRight: 10,
    backgroundColor: WHITE_COLOR,
    width: 100, 
    height: 55,
    position: 'relative',
  },
  fakePickerUI: {
    position: 'absolute',
    top: 0, bottom: 0, left: 0, right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  fakePickerText: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 26, 
    color: '#000',
  },
  fakePickerIcon: {
    fontSize: 12, 
    marginLeft: 6,
    color: '#000',
  },
  invisiblePicker: {
    width: '100%',
    height: '100%',
    opacity: 0,
    zIndex: 2,
  },
  pickerStyle: {
    width: '100%',
    height: '100%',
    color: '#000',
    transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }],
    fontSize: 24, 
    fontFamily: 'Homenaje_400Regular',
  },
  phoneInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#000',
    paddingHorizontal: 15,
    backgroundColor: WHITE_COLOR,
    fontFamily: 'Homenaje_400Regular',
    fontSize: 24,
    letterSpacing: 1,
  },
  modalButton: { 
    width: '100%', 
    borderWidth: 1, 
    borderColor: '#000', 
    padding: 10, 
    alignItems: 'center', 
    backgroundColor: WHITE_COLOR, 
    marginBottom: 15, 
    height: 55, 
    justifyContent: 'center' 
  },
  modalButtonText: { 
    fontFamily: 'Homenaje_400Regular', 
    fontSize: 28, 
    textTransform: 'uppercase' 
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
    marginHorizontal: 10, 
    fontFamily: 'Homenaje_400Regular', 
    fontSize: 24, 
    textTransform: 'lowercase' 
  },
  socialButton: { 
    width: '100%', 
    borderWidth: 1, 
    borderColor: '#000', 
    padding: 10, 
    alignItems: 'center', 
    backgroundColor: WHITE_COLOR, 
    marginBottom: 10, 
    height: 55, 
    justifyContent: 'center' 
  },
  socialButtonText: { 
    fontFamily: 'Homenaje_400Regular', 
    fontSize: 24 
  },
});