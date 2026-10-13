// src/pages/Login.jsx

import { useState } from 'react';
import './Login.css';

const Login = () => {
  const [credentials, setCredentials] = useState({ usuario: '', senha: '' });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <section className="login-page">
      <div className="login-card">
        <div className="login-card__header">Acesso restrito</div>
        <div className="login-card__body">
          <h1 className="login-card__title">Entrar</h1>
          <p className="login-card__subtitle">Acesse com seu usuário e senha.</p>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-field">
              <label className="login-field__label" htmlFor="usuario">
                Usuário
              </label>
              <input
                className="login-field__input"
                id="usuario"
                name="usuario"
                type="text"
                autoComplete="username"
                value={credentials.usuario}
                onChange={handleChange}
                required
              />
            </div>

            <div className="login-field">
              <label className="login-field__label" htmlFor="senha">
                Senha
              </label>
              <input
                className="login-field__input"
                id="senha"
                name="senha"
                type="password"
                autoComplete="current-password"
                value={credentials.senha}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn-pill btn-pill--blue login-form__submit">
              Entrar
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;