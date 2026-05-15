import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView } from 'react-native';

import SetaVoltar from '../assets/icons/SetaVoltar';
import Logo from '../assets/icons/LogoIcon';
import { Ionicons, Feather } from '@expo/vector-icons';

const BG_GRAY = '#DBDBDB'; 
const BLUE_COLOR = '#076BDE';
const KEYPAD_BG = '#F1F4F6';

export default function TelaToken({ navigation }) {
  const [codigo, setCodigo] = useState('');

  const handlePressNumero = (num) => {
    if (codigo.length < 4) {
      setCodigo(codigo + num);
    }
  };

  const handleApagar = () => {
    if (codigo.length > 0) {
      setCodigo(codigo.slice(0, -1));
    }
  };

  const renderizarQuadrados = () => {
    let quadrados = [];
    for (let i = 0; i < 4; i++) {
      quadrados.push(
        <View key={i} style={styles.quadrado}>
          <Text style={styles.textoQuadrado}>
            {codigo[i] ? codigo[i] : '—'} 
          </Text>
        </View>
      );
    }
    return quadrados;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.goBack()}>
          <SetaVoltar width={45} height={45} />
        </TouchableOpacity>
        <View style={styles.iconContainer}>
          <Logo width={45} height={45} />
        </View>
      </View>

      <View style={styles.codigoContainer}>
        {renderizarQuadrados()}
      </View>

      <View style={styles.avancarContainer}>
        <TouchableOpacity 
          style={styles.circleButtonAvancar}
          onPress={() => navigation.navigate('TipoConta')}
        >
          <Ionicons name="arrow-forward" size={30} color={BLUE_COLOR} />
        </TouchableOpacity>
      </View>

      <View style={styles.keypadContainer}>
        <View style={styles.dragHandle} />
        <View style={styles.keypadRow}>
          {[1, 2, 3].map((num) => (
            <TouchableOpacity key={num} style={styles.keyButton} onPress={() => handlePressNumero(num.toString())}>
              <Text style={styles.keyText}>{num}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.keypadRow}>
          {[4, 5, 6].map((num) => (
            <TouchableOpacity key={num} style={styles.keyButton} onPress={() => handlePressNumero(num.toString())}>
              <Text style={styles.keyText}>{num}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.keypadRow}>
          {[7, 8, 9].map((num) => (
            <TouchableOpacity key={num} style={styles.keyButton} onPress={() => handlePressNumero(num.toString())}>
              <Text style={styles.keyText}>{num}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.keypadRow}>
          <View style={styles.keyButtonVazio} /> 
          <TouchableOpacity style={styles.keyButton} onPress={() => handlePressNumero('0')}>
            <Text style={styles.keyText}>0</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.keyButtonAcao} onPress={handleApagar}>
            <Feather name="delete" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: BG_GRAY 
    },
    header: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        padding: 20, 
        marginTop: 20 
    },
    iconContainer: {
        width: 45,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center'
    },
    codigoContainer: { 
        flexDirection: 'row', 
        justifyContent: 'center', 
        marginTop: 60, 
        gap: 15 
    },
    quadrado: { 
        width: 60, 
        height: 60, 
        borderWidth: 1.5, 
        borderColor: '#000', 
        borderRadius: 10, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: 'transparent' 
    },
    textoQuadrado: { 
        fontSize: 30, 
        fontFamily: 'Homenaje_400Regular' 
    },
    avancarContainer: { 
        alignItems: 'center', 
        marginTop: 80, 
        flex: 1 
    },
    circleButtonAvancar: { 
        width: 60, 
        height: 60, 
        borderRadius: 30, 
        borderWidth: 1.5, 
        borderColor: BLUE_COLOR, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    keypadContainer: { 
        backgroundColor: KEYPAD_BG, 
        borderTopLeftRadius: 30, 
        borderTopRightRadius: 30, 
        padding: 20, 
        paddingBottom: 40, 
        alignItems: 'center' 
    },
    dragHandle: { 
        width: 40, 
        height: 5, 
        backgroundColor: '#000', 
        borderRadius: 3, 
        marginBottom: 30 
    },
    keypadRow: { 
        flexDirection: 'row', 
        justifyContent: 'center', 
        width: '100%', 
        marginBottom: 15, 
        gap: 15 
    },
    keyButton: { 
        flex: 1, 
        height: 50, 
        backgroundColor: '#D9DFE3', 
        borderRadius: 5, 
        justifyContent: 'center', 
        alignItems: 'center', 
        maxWidth: 100 
    },
    keyButtonVazio: { 
        flex: 1, 
        maxWidth: 100 
    },
    keyButtonAcao: { 
        flex: 1, 
        height: 50, 
        justifyContent: 'center', 
        alignItems: 'center', 
        maxWidth: 100 },
    keyText: { 
        fontFamily: 'Homenaje_400Regular', 
        fontSize: 24, 
        color: '#000' 
    },
  });