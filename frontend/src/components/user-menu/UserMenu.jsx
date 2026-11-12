// src/components/UserMenu.jsx

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./UserMenu.css";

const UserMenu = () => {
  const { isAuthenticated, user, logout, hasRole } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const route = hasRole(["superadmin", "admin"])
    ? `/administradores/${user.id}`
    : hasRole(["escola"])
      ? `/escolas/${user.id}`
      : `/alunos/${user.id}`;

  useEffect(() => {
    if (!open) return;

    const handleClickFora = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false);
    };
    const handleEsc = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClickFora);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickFora);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [open]);

  if (!isAuthenticated) {
    return (
      <Link to="/login" className="site-header__link user-menu__login">
        Entrar
      </Link>
    );
  }

  return (
    <div className="user-menu" ref={ref}>
      <button
        type="button"
        className="user-menu__button"
        aria-label="Menu do usuário"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
          <path
            d="M4 21c0-4 3.6-7 8-7s8 3 8 7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {open && (
        <div className="user-menu__dropdown" role="menu">
          {user?.nome && <p className="user-menu__name">{user.nome}</p>}
          <Link
            to={route}
            role="menuitem"
            className="user-menu__item"
            onClick={() => setOpen(false)}
          >
            Minhas informações
          </Link>
          <button
            type="button"
            role="menuitem"
            className="user-menu__item user-menu__item--danger"
            onClick={() => {
              setOpen(false);
              logout();
            }}
          >
            Sair
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
