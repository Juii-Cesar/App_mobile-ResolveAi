import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView } from 'react-native';

const BLUE_COLOR = '#076BDE';
const BG_GRAY = '#DBDBDB'; 
const WHITE_COLOR = '#FFFFFF';

export default function TelaInicial({ navigation }) {
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
          onPress={() => console.log('Botão Entrar Clicado!')}
        >
          <Text style={styles.buttonText}>ENTRAR</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_GRAY,
  },
  content: {
    flex: 1,
    padding: 30, 
    justifyContent: 'space-between', 
  },
  textGroup: {
    marginTop: 100, 
  },
  blueText: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 128,
    color: BLUE_COLOR,
    lineHeight: 115,
  },
  whiteText: {
    fontFamily: 'Homenaje_400Regular',
    fontSize: 128,
    color: WHITE_COLOR,
    lineHeight: 115,
  },
  button: {
    backgroundColor: BLUE_COLOR,
    borderRadius: 30, 
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 40, 
  },
  buttonText: {
    color: WHITE_COLOR,
    fontSize: 20,
    fontWeight: 'bold',
  },
});