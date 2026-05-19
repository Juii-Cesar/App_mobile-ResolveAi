import React, { createContext, useState, useContext } from 'react';

const UserType = createContext({});
export  const UserTypeProvider= ({children})=>{
const [accountType, setAccountType] = useState('cliente');
    return(
        <UserType.Provider value={{accountType,setAccountType}}>
        {children}
        </UserType.Provider>
    );
};
export const useUserType = ()=>useContext(UserType);