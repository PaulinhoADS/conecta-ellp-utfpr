// frontend/src/crud_voluntários/VoluntariosPage.jsx
import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import FormVoluntario from './components/FormVoluntario';
import ListaVoluntarios from './components/ListaVoluntario';
import ToastNotification from './components/ToastNotification';
import api from '../services/api';
import './crud_voluntarios.css';

export default function VoluntariosPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [voluntarios, setVoluntarios] = useState([]);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    api
      .get('/administradores')
      .then((res) => setVoluntarios(res.data))
      .catch(() => {
        setToast({
          mensagem: 'Não foi possível carregar a equipe da API.',
          tipo: 'error',
        });
      });
  }, []);

  const isNovo =
    location.pathname.endsWith('/novo') ||
    location.pathname === '/voluntarios' ||
    Boolean(new URLSearchParams(location.search).get('editar'));

  const isLista = !isNovo;

  const voluntarioEdicao = useMemo(() => {
    const idQuery = new URLSearchParams(location.search).get('editar');
    if (idQuery) {
      return (
        voluntarios.find((item) => String(item.id) === String(idQuery)) || null
      );
    }
    const partes = location.pathname.split('/').filter(Boolean);
    const ultimo = partes[partes.length - 1];
    if (
      ultimo &&
      !['administradores', 'voluntarios', 'lista', 'novo'].includes(ultimo)
    ) {
      return (
        voluntarios.find((item) => String(item.id) === String(ultimo)) || null
      );
    }
    return null;
  }, [location.pathname, location.search, voluntarios]);

  useEffect(() => {
    if (!toast) return undefined;
    const timeout = window.setTimeout(() => setToast(null), 3500);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const ativos = useMemo(
    () => voluntarios.filter((voluntario) => voluntario.ativo).length,
    [voluntarios]
  );

  const mostrarToast = (mensagem, tipo = 'success') =>
    setToast({ mensagem, tipo });

  const salvarVoluntario = async (dados) => {
    try {
      if (dados.id) {
        const res = await api.put(`/administradores/${dados.id}`, dados);
        setVoluntarios((atual) =>
          atual.map((item) =>
            String(item.id) === String(res.data.id) ? res.data : item
          )
        );
        mostrarToast('Dados do membro atualizados no PostgreSQL.');
      } else {
        const res = await api.post('/administradores', dados);
        setVoluntarios((atual) => [...atual, res.data]);
        mostrarToast('Membro cadastrado no PostgreSQL com sucesso.');
      }
      navigate('/administradores');
    } catch (err) {
      mostrarToast(
        err.response?.data?.erro || 'Erro ao salvar membro na API.',
        'error'
      );
    }
  };

  const editarVoluntario = (voluntario) => {
    navigate(`/voluntarios?editar=${voluntario.id}`);
  };

  const alternarStatus = async (id, ativo) => {
    try {
      const res = await api.put(`/administradores/${id}`, { ativo });
      setVoluntarios((atual) =>
        atual.map((item) =>
          String(item.id) === String(id) ? res.data : item
        )
      );
      mostrarToast(
        ativo ? 'Membro reativado.' : 'Membro inativado.',
        'info'
      );
    } catch {
      mostrarToast('Não foi possível alterar o status.', 'error');
    }
  };

  return (
    <section className="voluntarios-page">
      <div className="crud-container">
        <header className="crud-hero">
          <div>
            <span className="crud-eyebrow">
              GESTÃO ELLP • EQUIPE ADMINISTRATIVA
            </span>
            <h1>Administradores e Voluntários</h1>
            <p>
              Gerencie os professores coordenadores (Superadmin) e voluntários
              (Admin) do projeto ELLP.
            </p>
          </div>
          <div className="crud-hero__icon" aria-hidden="true">
            ✦
          </div>
        </header>

        <div className="crud-summary">
          <div className="summary-card">
            <span>Total na equipe</span>
            <strong>{voluntarios.length}</strong>
          </div>
          <div className="summary-card summary-card--accent">
            <span>Membros ativos</span>
            <strong>{ativos}</strong>
          </div>
          <div className="summary-card">
            <span>Oficinas regulares</span>
            <strong>05</strong>
          </div>
        </div>

        <nav className="crud-tabs" aria-label="Navegação da equipe">
          <Link
            className={
              isLista && !voluntarioEdicao
                ? 'crud-tab crud-tab--active'
                : 'crud-tab'
            }
            to="/administradores"
          >
            <span aria-hidden="true">☷</span> Lista da Equipe
          </Link>
          <Link
            className={
              !isLista || voluntarioEdicao
                ? 'crud-tab crud-tab--active'
                : 'crud-tab'
            }
            to="/voluntarios"
          >
            <span aria-hidden="true">＋</span>{' '}
            {voluntarioEdicao ? 'Editar Membro' : 'Novo Cadastro'}
          </Link>
        </nav>

        {isLista && !voluntarioEdicao ? (
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
            onCancelar={() => navigate('/administradores')}
          />
        )}
      </div>
      <ToastNotification toast={toast} />
    </section>
  );
}