import React, { createContext, useReducer, ReactNode, Dispatch } from "react";

export type User = {
  email: string;
  userConfirm?: boolean;
};

export type AuthState = {
  token: string | null;
  user: User | null;
};

export type AuthAction =
  | {
      type: "LOGIN";
      payload: { token: string; email: string; userConfirm?: boolean };
    }
  | { type: "LOGOUT" }
  | { type: "UPDATE_USER"; payload: { email: string; userConfirm?: boolean } }
  | { type: "CONFIRM_USER"; payload: { userConfirm: boolean } };

export type AuthContextProps = {
  state: AuthState;
  dispatch: Dispatch<AuthAction>;
};

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const initialState: AuthState = {
  token: null,
  user: null,
};

const authReducer: React.Reducer<AuthState, AuthAction> = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        token: action.payload.token,
        user: {
          email: action.payload.email,
          userConfirm: action.payload.userConfirm,
        },
      };
    case "LOGOUT":
      return {
        ...state,
        token: null,
        user: null,
      };
    case "UPDATE_USER":
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    case "CONFIRM_USER":
      return {
        ...state,
        user: state.user
          ? { ...state.user, userConfirm: action.payload.userConfirm }
          : null,
      };
    default:
      return state;
  }
};

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
