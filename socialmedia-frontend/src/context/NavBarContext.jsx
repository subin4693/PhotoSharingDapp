import { createContext, useContext, useState } from "react";

const navBarContext = createContext({
  isSignin: false,
  isConnected: false,
  isSkiped: false,
  setIsSignin: null,
  setIsSkiped: null,
  setIsConnected: null,
});

const NavBarContextProvider = ({ children }) => {
  const [isSignin, setIsSignin] = useState(false);
  const [isSkiped, setIsSkiped] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  return (
    <navBarContext.Provider
      value={{
        isSignin,
        setIsSignin,
        isSkiped,
        isConnected,
        setIsSkiped,
        setIsConnected,
      }}
    >
      {children}
    </navBarContext.Provider>
  );
};

const useNavBarContext = () => {
  const {
    isSignin,
    setIsSignin,
    isConnected,
    setIsConnected,
    isSkiped,
    setIsSkiped,
  } = useContext(navBarContext);
  return {
    isSignin,
    setIsSignin,
    isConnected,
    setIsConnected,
    isSkiped,
    setIsSkiped,
  };
};

export { NavBarContextProvider, useNavBarContext };
