import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const AuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    return null;
  }

  const { state } = authContext;

  return state.token ? <Navigate to="/balance" /> : <>{children}</>;
};

export default AuthRoute;
