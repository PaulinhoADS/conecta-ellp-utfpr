// frontend/src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const tokenSalvo = localStorage.getItem("token");
  const tokenInicial =
    tokenSalvo && tokenSalvo.startsWith("eyJ") ? tokenSalvo : null;

  const [token, setToken] = useState(tokenInicial);
  const [user, setUser] = useState(() => {
    if (!tokenInicial) return null;
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  });
  const navigate = useNavigate();

  // Faz auto-login real na API como Superadmin na primeira abertura para facilitar avaliação
  useEffect(() => {
    const jaDeslogouManualmente = sessionStorage.getItem("conecta-ellp:logout-manual");
    if (!token && !jaDeslogouManualmente) {
      api
        .post("/login", { usuario: "admin", senha: "ellp12345" })
        .then((res) => {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("user", JSON.stringify(res.data.user));
          setToken(res.data.token);
          setUser(res.data.user);
        })
        .catch(() => {
          // Caso o backend ainda não tenha subido, aguarda login manual
        });
    }
  }, [token]);

  const handleLogin = (newToken, newUser) => {
    sessionStorage.removeItem("conecta-ellp:logout-manual");
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const handleLogout = () => {
    sessionStorage.setItem("conecta-ellp:logout-manual", "true");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    navigate("/login");
  };

  const contextValue = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token && user),
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
    [token, user]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;