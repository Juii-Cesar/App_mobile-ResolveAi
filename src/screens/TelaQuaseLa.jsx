import React, { use } from "react";
import { StyleSheet, View, Text, Image} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LogoIcon from "../assets/icons/LogoIcon";
import { Button } from "../components/Button";
import { useUserType } from "../context/UserTypeContext";

const BLUE_COLOR = "#076BDE";

export const TelaQuaseLa = () => {
  return (
    <SafeAreaView style={styles.container} edges={["bottom", "left", "right"]}>
      <View style={styles.header}>
        <SafeAreaView edges={["top"]} />
        <Text style={styles.logoContainer}>Quase lá</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>
          Tire uma foto do seu{"\n"}documento de identidade{"\n"}(RG ou CNH)
        </Text>
        <Text>O que fazer:</Text>
        <Text>
          1: Retire o documento do plástico e{"\n"}posicione-o em uma superfície
          plana e{"\n"}bem iluminada.{"\n"}
          {"\n"}2: Certifique-se de que todos os dados,{"\n"}especialmente o CPF
          e a foto, estejam{"\n"}nítidos e sem reflexos de luz.{"\n"}
          {"\n"}3: Não envie fotos de fotocópias,{"\n"}documentos escaneados ou
          fotos de{"\n"}outras telas.{"\n"}
          {"\n"}4: Não corte as bordas do documento e{"\n"}evite cobrir as
          informações com os dedos.
        </Text>
        <Image source={require("../assets/img/exIdentidade.png")} />
        <Text>
          Seus dados são totalmente confidenciais. Eles serão{"\n"}utilizados
          exclusivamente para a verificação de segurança{"\n"}da plataforma e
          não serão expostos no seu perfil público.
        </Text>

        <Button
          title="Tirar foto"
          onPress={() =>
            accountType === "cliente" ? navigation.navigate("Token") : null
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DBDBDB",
  },
  header: {
    backgroundColor: BLUE_COLOR,
    height: 220,
    alignItems: "center",
},
logoContainer: {
    marginTop: 40,
    fontSize: 50,
    fontFamily: "Homenaje_400Regular",
    color:'#fff'
  },
  content: {
    flex: 1,
    backgroundColor: "#DBDBDB",
    marginTop: -80,
    borderTopLeftRadius: 100,
    alignItems: "center",
    paddingTop: 24,
  },
  title: {
    fontFamily: "Homenaje_400Regular",
    fontSize: 24,
    color: BLUE_COLOR,
    textAlign: "left",
  },
  inputGroup: {
    width: "100%",
    gap: 15,
    marginBottom: 40,
  },
  input: {
    backgroundColor: "#EAEAEA",
    height: 55,
    borderRadius: 10,
    paddingHorizontal: 20,
    fontSize: 18,
    fontFamily: "Homenaje_400Regular",
    color: "#000",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 36,
    fontFamily: "Homenaje_400Regular",
  },
});
