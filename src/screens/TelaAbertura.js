import React, { useEffect } from 'react';
import { StyleSheet, View, StatusBar, Image } from 'react-native';

const BACKGROUND_COLOR = '#076BDE'; 

export default function TelaAbertura({ navigation }) {
  
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Inicial'); 
    }, 3000); 

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={BACKGROUND_COLOR} translucent={true} />

      {/* falta a logo, depois edito, ou se você tiver ai o arquivo  */}

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
  logo: {
    width: 200,
    height: 200,
  },
});