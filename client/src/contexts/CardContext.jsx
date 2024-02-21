import React, { createContext, useContext } from "react";

const CardContext = createContext();

export const CardProvider = ({ children }) => {
  // Você pode adicionar o estado aqui, se necessário

  return <CardContext.Provider value={{}}>{children}</CardContext.Provider>;
};

export const useCard = () => {
  const context = useContext(CardContext);
  if (!context) {
    throw new Error("useCard must be used within a CardProvider");
  }
  return context;
};
