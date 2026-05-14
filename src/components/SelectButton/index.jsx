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

    backgroundColor: "#FFF",

    justifyContent: "center",
    alignItems: "center",
  },
  selectButtonActive: {
    backgroundColor: "#076BDE",
  },
  selectButtonText: {
    fontSize: 26,
    color: "#000",
  },

  selectButtonTextActive: {
    color: "#FFF",
  },
});
