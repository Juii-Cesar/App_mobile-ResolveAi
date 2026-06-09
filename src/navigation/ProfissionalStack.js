import { createNativeStackNavigator } from "@react-navigation/native-stack";

import TelaPrincipalProfissional from "../screens/TelaPrincipalProfissional";
import TelaMenuProfissional from "../screens/TelaMenuProfissional";
import TelaAtividadesDetalhada from "../screens/TelaAtividades";

const Stack = createNativeStackNavigator();

export function ProfissionalStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="TelaPrincipalProfissional"
        component={TelaPrincipalProfissional}
      />

      <Stack.Screen
        name="TelaMenuProfissional"
        component={TelaMenuProfissional}
      />

      <Stack.Screen name="TelaAtividades" component={TelaAtividadesDetalhada} />
    </Stack.Navigator>
  );
}
