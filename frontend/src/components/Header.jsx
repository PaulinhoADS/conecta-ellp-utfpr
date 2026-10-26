// src/components/Header.jsx

import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const getLinkClass = ({ isActive }) =>
    isActive ? 'site-header__link site-header__link--active' : 'site-header__link';

  return (
    <header className="site-header">
      <div className="my-container site-header__container">
        <Link to="/" className="site-header__brand" onClick={closeMenu}>
          <span className="site-header__brand-mark" aria-hidden="true"></span>
          Conecta ELLP
        </Link>

        <button
          type="button"
          className={menuOpen ? 'site-header__toggle site-header__toggle--open' : 'site-header__toggle'}
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuOpen}
          aria-controls="menu-principal"
          onClick={() => setMenuOpen((current) => !current)}
        >
          <span className="site-header__toggle-bar"></span>
          <span className="site-header__toggle-bar"></span>
          <span className="site-header__toggle-bar"></span>
        </button>

        <nav
          id="menu-principal"
          className={menuOpen ? 'site-header__nav site-header__nav--open' : 'site-header__nav'}
          aria-label="Navegação principal"
        >
          <ul className="site-header__list">
            <li className="site-header__item">
              <NavLink to="/" end className={getLinkClass} onClick={closeMenu}>
                Início
              </NavLink>
            </li>
            <li className="site-header__item">
              <a href="/#sobre" className="site-header__link" onClick={closeMenu}>
                O Projeto ELLP
              </a>
            </li>
            <li className="site-header__item">
              <NavLink to="/quiz" className={getLinkClass} onClick={closeMenu}>
                Quiz Perfil Tech
              </NavLink>
            </li>
            <li className="site-header__item">
              <NavLink to="/login" className={getLinkClass} onClick={closeMenu}>
                Entrar
              </NavLink>
            </li>
          </ul>
        </nav>

        {menuOpen && <div className="site-header__overlay" onClick={closeMenu}></div>}
      </div>
    </header>
  );
};

export default Header;