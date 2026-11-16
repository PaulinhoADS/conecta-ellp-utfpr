// frontend/src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getAlunos } from '../services/alunosService';
import { getEscolas } from '../services/escolasService';
import './Login.css';

const Login = () => {
  const [credentials, setCredentials] = useState({ usuario: '', senha: '' });
  const [erro, setErro] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials((current) => ({ ...current, [name]: value }));
    setErro('');
  };

  const autenticarPerfilRapido = (perfil) => {
    if (perfil === 'superadmin') {
      login('token-superadmin-ellp', {
        id: 1,
        nome: 'Prof. Antonio Carlos (Coordenação)',
        usuario: 'admin',
        role: 'superadmin',
      });
      navigate('/admin');
    } else if (perfil === 'admin') {
      login('token-admin-voluntario', {
        id: 2,
        nome: 'Voluntário ELLP (UTFPR)',
        usuario: 'voluntario',
        role: 'admin',
      });
      navigate('/admin');
    } else if (perfil === 'escola') {
      login('token-escola-parceira', {
        id: 1,
        nome: 'Colégio Estadual Monteiro Lobato',
        usuario: 'monteiro.lobato',
        role: 'escola',
      });
      navigate('/escolas/1');
    } else if (perfil === 'aluno') {
      login('token-aluno-ellp', {
        id: 1,
        escolaId: 1,
        nome: 'Lucas Gabriel Martins',
        usuario: 'lucas.martins',
        role: 'aluno',
      });
      navigate('/escolas/1/alunos/1');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const userDigitado = credentials.usuario.trim().toLowerCase();

    if (userDigitado === 'admin' || userDigitado === 'antonio' || userDigitado === 'professor') {
      autenticarPerfilRapido('superadmin');
      return;
    }

    if (userDigitado === 'voluntario') {
      autenticarPerfilRapido('admin');
      return;
    }

    const alunos = await getAlunos();
    const alunoEncontrado = alunos.find(
      (a) => String(a.username || '').toLowerCase() === userDigitado
    );
    if (alunoEncontrado) {
      login('token-aluno-ellp', {
        id: alunoEncontrado.id,
        escolaId: alunoEncontrado.escolaId,
        nome: alunoEncontrado.nome,
        usuario: alunoEncontrado.username,
        role: 'aluno',
      });
      navigate(`/escolas/${alunoEncontrado.escolaId}/alunos/${alunoEncontrado.id}`);
      return;
    }

    const escolas = await getEscolas();
    const escolaEncontrada = escolas.find(
      (e) =>
        e.email?.toLowerCase() === userDigitado ||
        e.nome.toLowerCase().includes(userDigitado)
    );
    if (escolaEncontrada) {
      login('token-escola-parceira', {
        id: escolaEncontrada.id,
        nome: escolaEncontrada.nome,
        usuario: escolaEncontrada.email,
        role: 'escola',
      });
      navigate(`/escolas/${escolaEncontrada.id}`);
      return;
    }

    setErro('Usuário não encontrado. Utilize um dos acessos abaixo ou digite "admin" ou "lucas.martins".');
  };

  return (
    <section className="login-page">
      <div className="login-card">
        <div className="login-card__header">Acesso ao Sistema</div>
        <div className="login-card__body">
          <h1 className="login-card__title">Entrar</h1>
          <p className="login-card__subtitle">Acesse com seu usuário ou selecione um perfil de demonstração abaixo.</p>

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
                placeholder="••••••••"
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

            <button type="submit" className="btn-pill btn-pill--blue login-form__submit">
              Entrar
            </button>
          </form>

          <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px solid #AADCFF' }}>
            <p style={{ margin: '0 0 10px', fontSize: '12px', fontWeight: 600, color: '#002960', textTransform: 'uppercase' }}>
              Acesso Rápido (Avaliação / Demonstração):
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                className="btn-pill btn-pill--outline-dark btn-pill--small"
                onClick={() => autenticarPerfilRapido('superadmin')}
              >
                Coordenação
              </button>
              <button
                type="button"
                className="btn-pill btn-pill--outline-dark btn-pill--small"
                onClick={() => autenticarPerfilRapido('admin')}
              >
                Voluntário
              </button>
              <button
                type="button"
                className="btn-pill btn-pill--outline-dark btn-pill--small"
                onClick={() => autenticarPerfilRapido('escola')}
              >
                Escola Parceira
              </button>
              <button
                type="button"
                className="btn-pill btn-pill--outline-dark btn-pill--small"
                onClick={() => autenticarPerfilRapido('aluno')}
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