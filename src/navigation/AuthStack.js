import { createNativeStackNavigator } from "@react-navigation/native-stack";

import TelaInicial from "../screens/TelaInicial";
import TelaToken from "../screens/TelaToken";
import TelaTipoConta from "../screens/TelaTipoConta";
import TelaDadosPessoais from "../screens/TelaDadosPessoais";
import TelaEspecialidades from "../screens/TelaEspecialidades";
import TelaVerificacao from "../screens/TelaVerificacao";
import TelaFotoPerfil from "../screens/TelaFotoPerfil";
import TelaDocumento from "../screens/TelaDocumento";
import TelaResidencia from "../screens/TelaResidencia";
import TelaTermos from "../screens/TelaTermos";
import TelaCameraDocumento from '../screens/TelaCameraDocumento';
import TelaPortifolio from '../screens/TelaPortifolio';
import TelaTextoTermos from '../screens/TelaTextoTermos';
import { TelaQuaseLa } from "../screens/TelaQuaseLa";
import { ClienteTabs } from "./ClienteTabs";
import { ProfissionalStack } from "./ProfissionalStack";
import TelaInformarProblema from "../screens/TelaInformarProblema";
import TelaBuscarProfissional from "../screens/TelaBuscarProfissional";
import TelaChat from "../screens/TelaChat";
import TelaServicoFinalizado from "../screens/TelaServicoFinalizado";

const Stack = createNativeStackNavigator();

export function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Fluxo de autenticação e cadastro */}

      <Stack.Screen name="Inicial" component={TelaInicial} />

      <Stack.Screen name="Token" component={TelaToken} />

      <Stack.Screen name="TelaTipoConta" component={TelaTipoConta} />

      <Stack.Screen name="TelaDadosPessoais" component={TelaDadosPessoais} />

      <Stack.Screen name="TelaEspecialidades" component={TelaEspecialidades} />

      <Stack.Screen name="TelaVerificacao" component={TelaVerificacao} />

      <Stack.Screen name="TelaFotoPerfil" component={TelaFotoPerfil} />

      <Stack.Screen name="TelaDocumento" component={TelaDocumento} />

      <Stack.Screen name="TelaResidencia" component={TelaResidencia} />

      <Stack.Screen name="TelaTermos" component={TelaTermos} />

      <Stack.Screen name="TelaQuaseLa" component={TelaQuaseLa} />

      <Stack.Screen name="TelaPortifolio" component={TelaPortifolio} />

      <Stack.Screen name="TelaTextoTermos" component={TelaTextoTermos} />

      {/* Área do cliente */}
      <Stack.Screen name="Tabs" component={ClienteTabs} />

      {/* Área do profissional */}
      <Stack.Screen name="ProfissionalStack" component={ProfissionalStack} />
      {/* Área da Camera RG */}
      <Stack.Screen name="TelaCameraDocumento" component={TelaCameraDocumento} />

      {/* ── NOVAS TELAS DO FLUXO DE BUSCA AQUI JUI CEZA */}
      <Stack.Screen name="TelaInformarProblema" component={TelaInformarProblema} />

      <Stack.Screen name="TelaBuscarProfissional" component={TelaBuscarProfissional} />

      <Stack.Screen name="TelaChat" component={TelaChat} />
      
      <Stack.Screen name="TelaServicoFinalizado" component={TelaServicoFinalizado} />
    </Stack.Navigator>
  );
}
