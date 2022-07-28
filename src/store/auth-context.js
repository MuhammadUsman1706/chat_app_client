import React, { useState } from "react";

const AuthContext = React.createContext({
  isLoggedIn: false,
  loginHandler: () => {},
  logoutHandler: () => {},
});

export const AuthContextProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("jwt") ? true : false
  );

  const loginHandler = (token) => {
    localStorage.setItem("jwt", token);
    setIsLoggedIn(true);
  };

  const logoutHandler = () => {
    localStorage.removeItem("jwt");
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        loginHandler,
        logoutHandler,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
