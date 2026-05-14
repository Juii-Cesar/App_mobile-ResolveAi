import { Pressable, StyleSheet, Text } from "react-native";

export const Button = ({ title, onPress, selected }) => {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.button, selected && styles.selectedButton]}
    >
      <Text style={[styles.text, selected && styles.selectedText]}>
        {title}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 6,
    paddingHorizontal: 52,

    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#000",

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#076BDE",
  },

  selectedButton: {
    backgroundColor: "#fff",
  },

  text: {
    color: "#fff",
    fontSize: 26,
  },

  selectedText: {
    color: "#000",
  },
});
