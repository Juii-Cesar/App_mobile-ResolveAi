import React, { useEffect } from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import LogoIcon from '../assets/icons/LogoIcon';

const BACKGROUND_COLOR = '#076BDE'; 

export default function TelaAbertura() {
  

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={BACKGROUND_COLOR} translucent={true} />

      <LogoIcon width={150} height={150} fill="#FFFFFF" />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
});