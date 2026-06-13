import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TelaInicio from "../screens/TelaInicio";
import TelaInformarProblema from "../screens/TelaInformarProblema";
import TelaBuscarProfissional from "../screens/TelaBuscarProfissional";
import TelaChat from "../screens/TelaChat";
import TelaServicoFinalizado from "../screens/TelaServicoFinalizado";
import TelaPerfilProfissional from "../screens/TelaPerfilProfissional";

const Stack = createNativeStackNavigator();

export function ClienteStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="TelaInicio" component={TelaInicio} />

      <Stack.Screen name="TelaInformarProblema" component={TelaInformarProblema} />

      <Stack.Screen name="TelaBuscarProfissional" component={TelaBuscarProfissional} />

      <Stack.Screen name="TelaChat" component={TelaChat} />

      <Stack.Screen name="TelaServicoFinalizado" component={TelaServicoFinalizado} />

      <Stack.Screen name="TelaPerfilProfissional" component={TelaPerfilProfissional} />
    </Stack.Navigator>
  );
}