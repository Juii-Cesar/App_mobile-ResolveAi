import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import LogoIcon from '../assets/icons/LogoIcon';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TelaInicio({ navigation }) {

  const categorias = [
    "Encanador",
    "Transporte",
    "Limpador de piscina",
    "Montador de móveis",
    "Eletricista",
  ];

  function abrirBusca(categoria = '') {
    navigation.navigate('TelaInformarProblema', { categoria });
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>

      <View style={styles.header}>
        <LogoIcon width={50} height={50} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>


        <TouchableOpacity
          style={styles.search}
          onPress={() => abrirBusca()}
          activeOpacity={0.75}
        >
          <Ionicons name="search-outline" size={20} color="#555" />
          <Text style={styles.searchPlaceholder}>O que você precisa?</Text>
        </TouchableOpacity>

        <View style={styles.tagsContainer}>
          {categorias.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.tag}
              onPress={() => abrirBusca(item)}
            >
              <Text style={styles.tagText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

  
        {[1, 2, 3, 4, 5].map((item) => (
          <TouchableOpacity
            key={item}
            style={styles.card}
            onPress={() => abrirBusca()}
          >
            <View style={styles.userBox}>
              <Ionicons name="person-outline" size={28} />
            </View>

            <Text style={styles.cardText}>
              Profissional{"\n"}em destaque
            </Text>

            <Ionicons name="star" size={24} />
          </TouchableOpacity>
        ))}

      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D9D9D9",
  },

  header: {
    height: 82,
    borderBottomWidth: 1,
    borderBottomColor: '#9BA7B1',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 16,
    backgroundColor: '#D9D9D9',
  },

  search: {
    marginHorizontal: 15,
    marginTop: 20,
    height: 45,
    borderWidth: 2,
    borderRadius: 30,
    backgroundColor: "#EEE",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
  },

  searchPlaceholder: {
    marginLeft: 10,
    flex: 1,
    color: '#999',
    fontSize: 14,
    fontFamily: 'Homenaje_400Regular',
  },

  tagsContainer: {
    marginTop: 12,
    paddingHorizontal: 15,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  tag: {
    borderWidth: 1,
    borderColor: "#AAA",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#EEE",
  },

  tagText: {
    color: "#666",
    fontFamily: 'Homenaje_400Regular',
  },

  card: {
    width: "75%",
    height: 70,
    alignSelf: "center",
    marginTop: 18,
    borderWidth: 2,
    borderRadius: 27,
    backgroundColor: "#EEE",
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  userBox: {
    height: 55,
    width: 55,
    borderWidth: 2,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },

  cardText: {
    fontSize: 24,
    fontFamily: 'Homenaje_400Regular',
  },
});