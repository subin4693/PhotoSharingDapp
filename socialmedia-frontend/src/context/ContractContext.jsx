import React, { useState, createContext, useContext } from "react";

const contractContext = createContext({
  socialmediaContract: null,
  setSocialmediaContract: null,
});

const ContractContextProvider = ({ children }) => {
  const [socialmediaContract, setSocialmediaContract] = useState(null);
  return (
    <contractContext.Provider
      value={{ socialmediaContract, setSocialmediaContract }}
    >
      {children}
    </contractContext.Provider>
  );
};

const useContractContext = () => {
  const { socialmediaContract, setSocialmediaContract } =
    useContext(contractContext);

  return { socialmediaContract, setSocialmediaContract };
};
export { ContractContextProvider, useContractContext };
