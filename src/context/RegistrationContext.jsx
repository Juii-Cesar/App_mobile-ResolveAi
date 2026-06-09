import React, { createContext, useState, useContext } from 'react';

const RegistrationContext = createContext();

export function RegistrationProvider({ children }) {
  const [formData, setFormData] = useState({});

  const updateFormData = (newData) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  return (
    <RegistrationContext.Provider value={{ formData, updateFormData }}>
      {children}
    </RegistrationContext.Provider>
  );
}

export const useRegistration = () => useContext(RegistrationContext);