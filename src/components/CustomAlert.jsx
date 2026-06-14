import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BLUE_COLOR = '#076BDE';

/**
 * CustomAlert — substitui Alert.alert no estilo do app
 *
 * Props:
 *   visible       boolean
 *   title         string (opcional)
 *   titleType     'default' | 'danger'
 *   message       string
 *   highlightText string (trecho do message destacado em azul, ex: nome do endereço)
 *   buttons       Array<{ text, variant, onPress }>
 *                   variant: 'primary' | 'outline' | 'danger' | 'neutral'
 *   showClose     boolean (exibe o X no canto, default true)
 *   onDismiss     função chamada ao clicar fora ou no X
 *
 * Uso básico:
 *   const [alert, setAlert] = useState({ visible: false });
 *   const hideAlert = () => setAlert({ visible: false });
 *
 *   setAlert({
 *     visible: true,
 *     title: 'Atenção',
 *     message: 'Preencha pelo menos o nome e a rua.',
 *     buttons: [{ text: 'Entendi', variant: 'primary', onPress: hideAlert }],
 *   });
 *
 *   <CustomAlert {...alert} onDismiss={hideAlert} />
 */
export function CustomAlert({
  visible,
  title,
  titleType = 'default',
  message,
  highlightText,
  buttons = [],
  showClose = true,
  onDismiss,
}) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <TouchableWithoutFeedback onPress={onDismiss}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.card}>

              {showClose && (
                <TouchableOpacity style={styles.btnClose} onPress={onDismiss}>
                  <Ionicons name="close" size={24} color="#999" />
                </TouchableOpacity>
              )}

              {title ? (
                <Text style={[
                  styles.title,
                  titleType === 'danger' && styles.titleDanger,
                ]}>
                  {title}:
                </Text>
              ) : null}

              <Text style={styles.message}>
                {highlightText ? (
                  <>
                    {message}{'\n'}
                    <Text style={styles.highlight}>{highlightText}</Text>
                  </>
                ) : message}
              </Text>

              <View style={[
                styles.buttons,
                buttons.length > 1 && styles.buttonsRow,
              ]}>
                {buttons.map((btn, i) => (
                  <TouchableOpacity
                    key={i}
                    style={[
                      styles.btn,
                      btn.variant === 'primary' && styles.btnPrimary,
                      btn.variant === 'outline' && styles.btnOutline,
                      btn.variant === 'danger'  && styles.btnDanger,
                      btn.variant === 'neutral' && styles.btnNeutral,
                    ]}
                    onPress={btn.onPress}
                  >
                    <Text style={[
                      styles.btnText,
                      btn.variant === 'outline' && { color: BLUE_COLOR },
                      btn.variant === 'neutral' && { color: '#fff' },
                    ]}>
                      {btn.text}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: 300,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    paddingBottom: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  btnClose: {
    position: 'absolute',
    top: 10,
    right: 14,
    padding: 5,
  },
  title: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 32,
    color: BLUE_COLOR,
    lineHeight: 34,
    marginBottom: 10,
    marginTop: 10,
  },
  titleDanger: {
    color: '#D32F2F',
  },
  message: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 22,
    color: '#111',
    lineHeight: 26,
    textAlign: 'center',
    marginBottom: 22,
  },
  highlight: {
    color: BLUE_COLOR,
    fontFamily: 'Homenaje_400Regular',
  },
  buttons: {
    gap: 10,
  },
  buttonsRow: {
    flexDirection: 'row',
  },
  btn: {
    flex: 1,
    height: 48,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 22,
    color: '#fff',
  },
  btnPrimary: {
    backgroundColor: BLUE_COLOR,
  },
  btnOutline: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: BLUE_COLOR,
  },
  btnDanger: {
    backgroundColor: '#D32F2F',
  },
  btnNeutral: {
    backgroundColor: '#A0A0A0',
    borderRadius: 22,
  },
});