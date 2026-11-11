import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import FormVoluntario from './components/FormVoluntario';
import ListaVoluntarios from './components/ListaVoluntario';
import ToastNotification from './components/ToastNotification';
import './crud_voluntarios.css';

const STORAGE_KEY = 'conecta-ellp-voluntarios';

function readVoluntarios() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Não foi possível carregar os voluntários salvos.', error);
    return [];
  }
}

export default function VoluntariosPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [voluntarios, setVoluntarios] = useState(readVoluntarios);
  const [toast, setToast] = useState(null);
  const isLista = location.pathname.endsWith('/lista');
  const voluntarioEdicao = useMemo(() => {
    const id = new URLSearchParams(location.search).get('editar');
    return voluntarios.find((item) => String(item.id) === id) || null;
  }, [location.search, voluntarios]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(voluntarios));
  }, [voluntarios]);

  useEffect(() => {
    if (!toast) return undefined;
    const timeout = window.setTimeout(() => setToast(null), 3500);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const ativos = useMemo(
    () => voluntarios.filter((voluntario) => voluntario.ativo).length,
    [voluntarios],
  );

  const mostrarToast = (mensagem, tipo = 'success') => setToast({ mensagem, tipo });

  const salvarVoluntario = (dados) => {
    if (dados.id) {
      setVoluntarios((atual) => atual.map((item) => (item.id === dados.id ? dados : item)));
      mostrarToast('Dados do voluntário atualizados.');
    } else {
      setVoluntarios((atual) => [...atual, { ...dados, id: crypto.randomUUID() }]);
      mostrarToast('Voluntário cadastrado com sucesso.');
    }
    navigate('/voluntarios/lista');
  };

  const editarVoluntario = (voluntario) => {
    navigate(`/voluntarios?editar=${voluntario.id}`);
  };

  const alternarStatus = (id, ativo) => {
    setVoluntarios((atual) => atual.map((item) => (
      item.id === id ? { ...item, ativo } : item
    )));
    mostrarToast(ativo ? 'Voluntário reativado.' : 'Voluntário inativado.', 'info');
  };

  return (
    <section className="voluntarios-page">
      <div className="crud-container">
        <header className="crud-hero">
          <div>
            <span className="crud-eyebrow">GESTÃO ELLP</span>
            <h1>Voluntários</h1>
            <p>Organize a equipe que transforma o ensino de tecnologia.</p>
          </div>
          <div className="crud-hero__icon" aria-hidden="true">✦</div>
        </header>

        <div className="crud-summary">
          <div className="summary-card">
            <span>Total cadastrados</span>
            <strong>{voluntarios.length}</strong>
          </div>
          <div className="summary-card summary-card--accent">
            <span>Voluntários ativos</span>
            <strong>{ativos}</strong>
          </div>
          <div className="summary-card">
            <span>Oficinas disponíveis</span>
            <strong>05</strong>
          </div>
        </div>

        <nav className="crud-tabs" aria-label="Navegação de voluntários">
          <Link className={!isLista ? 'crud-tab crud-tab--active' : 'crud-tab'} to="/voluntarios">
            <span aria-hidden="true">＋</span> Novo cadastro
          </Link>
          <Link className={isLista ? 'crud-tab crud-tab--active' : 'crud-tab'} to="/voluntarios/lista">
            <span aria-hidden="true">☷</span> Lista de voluntários
          </Link>
        </nav>

        {isLista ? (
          <ListaVoluntarios
            voluntarios={voluntarios}
            onEditar={editarVoluntario}
            onToggleStatus={alternarStatus}
          />
        ) : (
          <FormVoluntario
            key={voluntarioEdicao?.id || 'novo'}
            voluntarioEdicao={voluntarioEdicao}
            onSalvar={salvarVoluntario}
            onCancelar={() => navigate('/voluntarios')}
          />
        )}
      </div>
      <ToastNotification toast={toast} />
    </section>
  );
}
