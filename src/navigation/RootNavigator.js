import React, { useEffect, useState } from "react";

import { AuthStack } from "./AuthStack";
import { ClienteTabs } from "./ClienteTabs";
import { ProfissionalStack } from "./ProfissionalStack";

import TelaAbertura from "../screens/TelaAbertura";

import { supabase } from "../services/supabase";

export function RootNavigator() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [tipoUsuario, setTipoUsuario] = useState(null);

  useEffect(() => {
    verificarSessao();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("EVENTO:", event);
      console.log("SESSION:", session);

      setSession(session);

      if (session?.user?.id) {
        const { data, error } = await supabase
          .from("usuarios")
          .select("tipo")
          .eq("id", session.user.id)
          .single();

        if (error) {
          console.log(error);
          setTipoUsuario(null);
        } else {
          setTipoUsuario(data?.tipo ?? null);
        }
      } else {
        setTipoUsuario(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function verificarSessao() {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setSession(session);

      if (session?.user?.id) {
        const { data, error } = await supabase
          .from("usuarios")
          .select("tipo")
          .eq("id", session.user.id)
          .single();

        if (error) {
          console.log(error);
          setTipoUsuario(null);
        } else {
          setTipoUsuario(data?.tipo ?? null);
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

  if (!session || !tipoUsuario) {
    return <AuthStack />;
  }

  if (tipoUsuario === "profissional") {
    return <ProfissionalStack />;
  }

  if (tipoUsuario === "cliente") {
    return <ClienteTabs />;
  }

  return <AuthStack />;
}