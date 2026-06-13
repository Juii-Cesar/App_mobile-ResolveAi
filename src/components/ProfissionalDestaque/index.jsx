import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const ProfissionalDestaque = ({ nome, foto, onPress, item }) => {
  return (
    <TouchableOpacity style={styles.card} key={item} onPress={onPress}>
      <View style={styles.userBox}>
        {foto ? (
          <Image source={{ uri: foto }} style={styles.userImage} />
        ) : (
          <Ionicons name="person-outline" size={28} />
        )}
      </View>

      <Text style={styles.cardText}>{nome}</Text>

      <Ionicons name="star" size={24} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
    overflow: "hidden",
  },

  userImage: {
    width: "100%",
    height: "100%",
  },

  cardText: {
    flex: 1,
    marginHorizontal: 15,
    fontSize: 24,
    fontFamily: "Homenaje_400Regular",
  },
});
