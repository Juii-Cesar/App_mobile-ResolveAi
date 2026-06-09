import React from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from '@react-navigation/native';
import { useUserType } from "../context/UserTypeContext";
import { Button } from "../components/Button";

const BLUE_COLOR = "#076BDE";

export const TelaQuaseLa = () => {
  const navigation = useNavigation();
  const { accountType } = useUserType();

  return (
    <SafeAreaView style={styles.container} edges={["bottom", "left", "right"]}>
      <View style={styles.header}>
        <SafeAreaView edges={["top"]} />
        <Text style={styles.quaseLaContainer}>Quase lá</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>
          Tire uma foto do seu{"\n"}documento de identidade{"\n"}(RG ou CNH)
        </Text>
        <Text style = {styles.subTitle}>O que fazer:</Text>
        <View style = { styles.infos}>
          <Text style={styles.instructions}>
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
        </View>
        <Text style={styles.securityWarning}>
          Seus dados são totalmente confidenciais. Eles serão{"\n"}utilizados
          exclusivamente para a verificação de segurança{"\n"}da plataforma e
          não serão expostos no seu perfil público.
        </Text>

        <Button
          title="Tirar foto"
          onPress={() =>{
            navigation.replace("Tabs")
            console.log('replace aq');
          }}
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
  quaseLaContainer: {
    marginTop: 40,
    fontSize: 50,
    fontFamily: "Homenaje_400Regular",
    color: "#fff",
  },
  content: {
    flex: 1,
    backgroundColor: "#DBDBDB",
    marginTop: -80,
    borderTopLeftRadius: 100,
    alignItems: "center",
    paddingTop: 24,
    gap: 12,
  },
  title: {
    fontFamily: "Homenaje_400Regular",
    fontSize: 24,
    color: BLUE_COLOR,
    textAlign: "left",
  },
  subTitle: {
    color: "#404040",
    fontFamily: "Homenaje_400Regular",
    fontSize: 16,
    alignSelf: "flex-start",
    marginLeft: "5%",
  },
  infos:{
    gap:8,
    alignItems:'center'
  },
  instructions: {
    color: "#404040",
    fontFamily: "Homenaje_400Regular",
    fontSize: 16,
  },
  securityWarning: {
    color: "#404040",
    fontFamily: "Homenaje_400Regular",
    fontSize:12,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 36,
    
  },
});