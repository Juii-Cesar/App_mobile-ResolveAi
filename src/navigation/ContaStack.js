import { createNativeStackNavigator } from "@react-navigation/native-stack";

import TelaConta from "../screens/TelaConta";
import TelaMinhaConta from "../screens/TelaMinhaConta";
import TelaCarteira from "../screens/TelaCarteira";
import TelaEnderecos from "../screens/TelaEnderecos";

const Stack = createNativeStackNavigator();

export function ContaStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="TelaConta" component={TelaConta} />

      <Stack.Screen name="TelaMinhaConta" component={TelaMinhaConta} />

      <Stack.Screen name="TelaCarteira" component={TelaCarteira} />

      <Stack.Screen name="TelaEnderecos" component={TelaEnderecos} />
    </Stack.Navigator>
  );
}
