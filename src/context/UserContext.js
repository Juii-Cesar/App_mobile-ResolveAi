import React, { createContext, useState, useContext } from 'react';

export const UserContext = createContext();
export function UserProvider({ children }) {
    const [tipoConta, setTipoConta] = useState('');

    return (
        <UserContext.Provider value={{ tipoConta, setTipoConta }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}