import { Pressable, StyleSheet, Text } from "react-native";

export const SelectButton = ({ title, selected, onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.selectButton, selected && styles.selectButtonActive]}
    >
      <Text
        style={[
          styles.selectButtonText,
          selected && styles.selectButtonTextActive,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  selectButton: {
    width: "48%",
    paddingVertical: 4,

    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#000",

    backgroundColor: "#ffffff00",

    justifyContent: "center",
    alignItems: "center",
  },
  selectButtonActive: {
    backgroundColor: "#076BDE",
  },
  selectButtonText: {
    fontSize: 30,
    color: "#000",
    fontFamily: "Homenaje_400Regular",
  },

  selectButtonTextActive: {
    color: "#FFF",
  },
});
