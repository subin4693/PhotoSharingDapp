import React from "react";
import { useNavBarContext } from "../context/NavBarContext";
import { Profile } from "../pages";
import { Navigate } from "react-router-dom";

const ProtectedProfileRoute = ({ children }) => {
  const { isSignin, isSkiped } = useNavBarContext();
  if (isSignin || isSkiped) return children;
  else return <Navigate to="/home" />;
};

export default ProtectedProfileRoute;
