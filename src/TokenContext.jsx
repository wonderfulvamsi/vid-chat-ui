import React, { createContext, useContext, useState } from 'react';

// Create a context
const TokenContext = createContext();

// Create a provider component
export const TokenProvider = ({ children }) => {
  const [access, setAccess] = useState("");
  const [refresh, setRefresh] = useState("");
  return (
    <TokenContext.Provider value={{ access, setAccess, refresh, setRefresh }}>
      {children}
    </TokenContext.Provider>
  );
};

// Custom hook to use the context
export const useToken = () => {
  return useContext(TokenContext);
};