import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState({ nome: '', sobrenome: '', email: '' });

  async function carregarUsuario(session) {
    if (!session?.user) {
      setUsuario({ nome: '', sobrenome: '', email: '' });
      return;
    }

    const { data, error } = await supabase
      .from('usuarios')
      .select('nome, sobrenome')
      .eq('id', session.user.id)
      .single();

    if (!error && data) {
      setUsuario({
        nome:      data.nome      ?? '',
        sobrenome: data.sobrenome ?? '',
        email:     session.user.email ?? '',
      });
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      carregarUsuario(session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      carregarUsuario(session);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, setUsuario }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}