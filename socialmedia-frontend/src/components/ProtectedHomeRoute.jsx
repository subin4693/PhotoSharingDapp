import React from "react";
import { Navigate } from "react-router-dom";
import { useNavBarContext } from "../context/NavBarContext";

const ProtectedHomeRoute = ({ children }) => {
  const { isSkiped, isSignin } = useNavBarContext();
  if (isSkiped || isSignin) {
    return children;
  } else return <Navigate to="/" />;
};

export default ProtectedHomeRoute;
