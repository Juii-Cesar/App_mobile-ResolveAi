import React, { createContext, useContext, useState } from 'react';

const ServicoContext = createContext(null);

export function ServicoProvider({ children }) {
  const [servicoAtivo, setServicoAtivo] = useState(null);

  function iniciarServico(dados) {
    setServicoAtivo({ ...dados, iniciadoEm: new Date() });
  }

  function cancelarServico() {
    setServicoAtivo(null);
  }

  return (
    <ServicoContext.Provider value={{ servicoAtivo, iniciarServico, cancelarServico }}>
      {children}
    </ServicoContext.Provider>
  );
}

export function useServico() {
  const ctx = useContext(ServicoContext);
  if (!ctx) throw new Error('useServico deve ser usado dentro de ServicoProvider');
  return ctx;
}