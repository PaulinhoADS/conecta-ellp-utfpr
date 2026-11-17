// frontend/src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { loginRequest } from '../services/authService';
import './Login.css';

const Login = () => {
  const [credentials, setCredentials] = useState({ usuario: '', senha: '' });
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials((current) => ({ ...current, [name]: value }));
    setErro('');
  };

  const redirecionarPorRole = (user) => {
    if (user.role === 'superadmin' || user.role === 'admin') {
      navigate('/admin');
    } else if (user.role === 'escola') {
      navigate(`/escolas/${user.id}`);
    } else if (user.role === 'aluno') {
      navigate(`/escolas/${user.escolaId}/alunos/${user.id}`);
    } else {
      navigate('/');
    }
  };

  const realizarLoginNaApi = async (usuarioLogin, senhaLogin) => {
    try {
      setCarregando(true);
      setErro('');
      const dados = await loginRequest(usuarioLogin, senhaLogin);
      login(dados.token, dados.user);
      redirecionarPorRole(dados.user);
    } catch (err) {
      setErro(
        err.response?.data?.erro ||
          'Não foi possível autenticar. Verifique se o servidor Back-end está rodando na porta 3333.'
      );
    } finally {
      setCarregando(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await realizarLoginNaApi(credentials.usuario, credentials.senha);
  };

  const autenticarPerfilRapido = (perfil) => {
    const mapaCredenciais = {
      superadmin: { u: 'admin', s: 'ellp12345' },
      admin: { u: 'pauloleite@alunos.utfpr.edu.br', s: 'ellp12345' },
      escola: { u: 'direcao@monteirolobato.pr.gov.br', s: 'ellp12345' },
      aluno: { u: 'lucas.martins', s: 'ellp12345' },
    };
    const cred = mapaCredenciais[perfil];
    if (cred) realizarLoginNaApi(cred.u, cred.s);
  };

  return (
    <section className="login-page">
      <div className="login-card">
        <div className="login-card__header">Acesso ao Sistema (JWT)</div>
        <div className="login-card__body">
          <h1 className="login-card__title">Entrar</h1>
          <p className="login-card__subtitle">
            Acesse com seu usuário e senha cadastrados no banco de dados.
          </p>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-field">
              <label className="login-field__label" htmlFor="usuario">
                Usuário ou E-mail
              </label>
              <input
                className="login-field__input"
                id="usuario"
                name="usuario"
                type="text"
                placeholder="Ex.: admin ou lucas.martins"
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
                placeholder="Senha padrão: ellp12345"
                autoComplete="current-password"
                value={credentials.senha}
                onChange={handleChange}
                required
              />
            </div>

            {erro && (
              <p className="form-field__error" role="alert">
                {erro}
              </p>
            )}

            <button
              type="submit"
              className="btn-pill btn-pill--blue login-form__submit"
              disabled={carregando}
            >
              {carregando ? 'Autenticando...' : 'Entrar'}
            </button>
          </form>

          <div
            style={{
              marginTop: '24px',
              paddingTop: '18px',
              borderTop: '1px solid #AADCFF',
            }}
          >
            <p
              style={{
                margin: '0 0 10px',
                fontSize: '12px',
                fontWeight: 600,
                color: '#002960',
                textTransform: 'uppercase',
              }}
            >
              Login Rápido via API (Demonstração):
            </p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
              }}
            >
              <button
                type="button"
                className="btn-pill btn-pill--outline-dark btn-pill--small"
                onClick={() => autenticarPerfilRapido('superadmin')}
                disabled={carregando}
              >
                Coordenação
              </button>
              <button
                type="button"
                className="btn-pill btn-pill--outline-dark btn-pill--small"
                onClick={() => autenticarPerfilRapido('admin')}
                disabled={carregando}
              >
                Voluntário
              </button>
              <button
                type="button"
                className="btn-pill btn-pill--outline-dark btn-pill--small"
                onClick={() => autenticarPerfilRapido('escola')}
                disabled={carregando}
              >
                Escola Parceira
              </button>
              <button
                type="button"
                className="btn-pill btn-pill--outline-dark btn-pill--small"
                onClick={() => autenticarPerfilRapido('aluno')}
                disabled={carregando}
              >
                Estudante
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;