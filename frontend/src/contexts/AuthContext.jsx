import axios from "axios";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const CHAVE_SEED_SUPERUSER = "conecta-ellp:superuser-seeded";

const garantirSuperuserNoLocalStorage = () => {
  if (!localStorage.getItem(CHAVE_SEED_SUPERUSER)) {
    const superuserPadrao = {
      id: 1,
      nome: "Administrador ELLP",
      usuario: "admin",
      role: "superadmin",
    };
    localStorage.setItem("token", "dev-token-superuser-ellp");
    localStorage.setItem("user", JSON.stringify(superuserPadrao));
    localStorage.setItem(CHAVE_SEED_SUPERUSER, "true");
  }
};

const AuthProvider = ({ children }) => {
  garantirSuperuserNoLocalStorage();
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      localStorage.setItem("token", token);
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const handleLogin = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    navigate("/");
  };

  const contextValue = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: !!token,
      login: handleLogin,
      logout: handleLogout,
      hasRole: (allowedRoles) => {
        if (!user || !user.role) return false;
        const listaRoles = Array.isArray(allowedRoles)
          ? allowedRoles
          : [allowedRoles];
        return listaRoles.includes(user.role);
      },
    }),
    [token, user],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
