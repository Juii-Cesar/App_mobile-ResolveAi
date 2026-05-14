import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../components/Button";
import { SelectButton } from "../components/SelectButton";
export default function TelaTipoConta() {
  const [accountType, setAccountType] = useState("profissional");

  const content = {
    profissional: {
      title: "Profissional",
      description:
        "Quero divulgar meu trabalho, \nconectar-me\ncom clientes da minha \nregião e aumentar minha\nrenda.",
    },

    cliente: {
      title: "Cliente",
      description:
        "Quero contratar profissionais de confiança perto de mim para resolver imprevistos e realizar serviços no dia a dia.",
    },
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Selecione seu tipo de {"\n"}conta.</Text>
        <View style={styles.buttonsContainer}>
          <SelectButton
            title="Profissional"
            selected={accountType === "profissional"}
            onPress={() => setAccountType("profissional")}
          />

          <SelectButton
            title="Cliente"
            selected={accountType === "cliente"}
            onPress={() => setAccountType("cliente")}
          />
        </View>

        <View style={styles.imagePlaceholder} />

        <Text style={styles.description}>
          {content[accountType].description}
        </Text>

        <Button title="Continuar" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",

    alignItems: "center",
  },

  card: {
    width: "80%",
    alignItems: "center",
    gap: 20,
  },

  title: {
    textAlign: "left",
    fontSize: 33,
    color: "#076BDE",
  },

  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },

  description: {
    textAlign: "center",
    fontSize: 22,
  },
});
