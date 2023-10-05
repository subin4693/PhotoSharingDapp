import { createContext, useContext, useState } from "react";

const userContext = createContext({
  userId: 0,
  userName: null,
  profileImageUrl: null,
});

const UserContextProvider = ({ children }) => {
  const [userDetail, setUserDetail] = useState({
    userId: 0,
    userName: null,
    profileImageUrl: null,
  });
  return (
    <userContext.Provider value={{ userDetail, setUserDetail }}>
      {children}
    </userContext.Provider>
  );
};

const useUserContext = () => {
  const { userDetail, setUserDetail } = useContext(userContext);
  return { userDetail, setUserDetail };
};

export { UserContextProvider, useUserContext };
