import React, { Fragment, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const PrivateRoute: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  useEffect(() => {
    if (!authContext) {
      navigate("/signin");
      return;
    }

    const { state } = authContext;

    if (!state.token) {
      navigate("/*");
    } else if (!state.user?.userConfirm) {
      navigate("/signup-confirm");
    }
  }, [authContext, navigate]);

  return <Fragment>{children}</Fragment>;
};

export default PrivateRoute;
