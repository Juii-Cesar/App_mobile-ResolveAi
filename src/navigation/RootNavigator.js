import React, { useEffect, useState } from "react";
import { AuthStack } from "./AuthStack";
import { ClienteTabs } from "./ClienteTabs";
import { ProfissionalStack } from "./ProfissionalStack";

import TelaAbertura from "../screens/TelaAbertura";

import { supabase } from "../services/supabase";

export function RootNavigator() {
  const [loading, setLoading] = useState(true);
  const [tipoUsuario, setTipoUsuario] = useState(null);
  const [session, setSession] = useState(null);

  useEffect(() => {
    verificarSessao();
  }, []);

  async function verificarSessao() {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setSession(session);

      if (session?.user?.id) {
        const { data } = await supabase
          .from("usuarios")
          .select("tipo")
          .eq("id", session.user.id)
          .single();

        if (data) {
          setTipoUsuario(data.tipo);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <TelaAbertura />;
  }

  if (!session) {
    return <AuthStack />;
  }

  if (tipoUsuario === "profissional") {
    return <ProfissionalStack />;
  }

  return <ClienteTabs />;
}
