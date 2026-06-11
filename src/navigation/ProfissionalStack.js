import { createNativeStackNavigator } from "@react-navigation/native-stack";

import TelaPrincipalProfissional from "../screens/TelaPrincipalProfissional";
import TelaMenuProfissional from "../screens/TelaMenuProfissional";
import TelaAtividadesDetalhada from "../screens/TelaAtividades";

// ── Novas telas do fluxo de atendimento ──────────────────────────────────────
import TelaChatProfissional from "../screens/TelaChatProfissional";
import TelaAnotacaoOrcamento from "../screens/TelaAnotacaoOrcamento";
import TelaServicoFinalizado from "../screens/TelaServicoFinalizado";

const Stack = createNativeStackNavigator();

export function ProfissionalStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>

      <Stack.Screen name="TelaPrincipalProfissional" component={TelaPrincipalProfissional} />

      <Stack.Screen name="TelaMenuProfissional" component={TelaMenuProfissional} />

      <Stack.Screen name="TelaAtividades" component={TelaAtividadesDetalhada} />

      {/* Fluxo de atendimento ao cliente */}
      <Stack.Screen name="TelaChatProfissional" component={TelaChatProfissional} />

      <Stack.Screen name="TelaAnotacaoOrcamento" component={TelaAnotacaoOrcamento} />

      <Stack.Screen name="TelaServicoFinalizado" component={TelaServicoFinalizado} />

    </Stack.Navigator>
  );
}
