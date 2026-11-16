// frontend/src/crud_voluntários/VoluntariosPage.jsx
import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import FormVoluntario from './components/FormVoluntario';
import ListaVoluntarios from './components/ListaVoluntario';
import ToastNotification from './components/ToastNotification';
import './crud_voluntarios.css';

export const STORAGE_KEY_VOLUNTARIOS = 'conecta-ellp-voluntarios-v2';

const equipeInicial = [
  {
    id: '1',
    nome: 'Prof. Antonio Carlos Fernandes da Silva',
    email: 'antoniocarlos@utfpr.edu.br',
    telefone: '(43) 3520-4000',
    tipoAcesso: 'superadmin',
    ra: 'Docente Coordenador',
    curso: 'Coordenação do Programa ELLP',
    oficinaPref: 'Coordenação Geral',
    ativo: true,
  },
  {
    id: '2',
    nome: 'Paulo Cesar Leite',
    email: 'pauloleite@alunos.utfpr.edu.br',
    telefone: '(43) 99911-2026',
    tipoAcesso: 'admin',
    ra: 'a2706512',
    curso: 'Análise e Desenvolvimento de Sistemas',
    oficinaPref: 'Fábrica de Sites',
    ativo: true,
  },
  {
    id: '3',
    nome: 'Carlos Henrique de Andrade',
    email: 'carlosandrade@alunos.utfpr.edu.br',
    telefone: '(43) 99922-2026',
    tipoAcesso: 'admin',
    ra: 'a2654321',
    curso: 'Análise e Desenvolvimento de Sistemas',
    oficinaPref: 'Robótica com Arduino',
    ativo: true,
  },
  {
    id: '4',
    nome: 'Higor Claro da Silva',
    email: 'higorclaro@alunos.utfpr.edu.br',
    telefone: '(43) 99933-2026',
    tipoAcesso: 'admin',
    ra: 'a2654322',
    curso: 'Análise e Desenvolvimento de Sistemas',
    oficinaPref: 'Modelagem 3D',
    ativo: true,
  },
  {
    id: '5',
    nome: 'Victor Hugo Concolato Neves',
    email: 'victorneves@alunos.utfpr.edu.br',
    telefone: '(43) 99944-2026',
    tipoAcesso: 'admin',
    ra: 'a2654323',
    curso: 'Análise e Desenvolvimento de Sistemas',
    oficinaPref: 'Desenvolvimento de Jogos',
    ativo: true,
  },
];

export function readVoluntarios() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_VOLUNTARIOS);
    if (!saved) {
      localStorage.setItem(STORAGE_KEY_VOLUNTARIOS, JSON.stringify(equipeInicial));
      return equipeInicial;
    }
    return JSON.parse(saved);
  } catch (error) {
    console.error('Não foi possível carregar os membros salvos.', error);
    return equipeInicial;
  }
}

export default function VoluntariosPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [voluntarios, setVoluntarios] = useState(readVoluntarios);
  const [toast, setToast] = useState(null);

  const isNovo =
    location.pathname.endsWith('/novo') ||
    location.pathname === '/voluntarios' ||
    Boolean(new URLSearchParams(location.search).get('editar'));

  const isLista = !isNovo;

  const voluntarioEdicao = useMemo(() => {
    const idQuery = new URLSearchParams(location.search).get('editar');
    if (idQuery) {
      return voluntarios.find((item) => String(item.id) === String(idQuery)) || null;
    }
    const partes = location.pathname.split('/').filter(Boolean);
    const ultimo = partes[partes.length - 1];
    if (ultimo && !['administradores', 'voluntarios', 'lista', 'novo'].includes(ultimo)) {
      return voluntarios.find((item) => String(item.id) === String(ultimo)) || null;
    }
    return null;
  }, [location.pathname, location.search, voluntarios]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_VOLUNTARIOS, JSON.stringify(voluntarios));
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
      setVoluntarios((atual) =>
        atual.map((item) => (String(item.id) === String(dados.id) ? dados : item))
      );
      mostrarToast('Dados do membro atualizados com sucesso.');
    } else {
      const novoId = String(voluntarios.length + 1);
      setVoluntarios((atual) => [...atual, { ...dados, id: novoId }]);
      mostrarToast('Membro cadastrado na equipe com sucesso.');
    }
    navigate('/administradores');
  };

  const editarVoluntario = (voluntario) => {
    navigate(`/voluntarios?editar=${voluntario.id}`);
  };

  const alternarStatus = (id, ativo) => {
    setVoluntarios((atual) =>
      atual.map((item) => (String(item.id) === String(id) ? { ...item, ativo } : item))
    );
    mostrarToast(ativo ? 'Membro reativado.' : 'Membro inativado.', 'info');
  };

  return (
    <section className="voluntarios-page">
      <div className="crud-container">
        <header className="crud-hero">
          <div>
            <span className="crud-eyebrow">GESTÃO ELLP • EQUIPE ADMINISTRATIVA</span>
            <h1>Administradores e Voluntários</h1>
            <p>Gerencie os professores coordenadores (Superadmin) e voluntários (Admin) do projeto ELLP.</p>
          </div>
          <div className="crud-hero__icon" aria-hidden="true">✦</div>
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
            className={isLista && !voluntarioEdicao ? 'crud-tab crud-tab--active' : 'crud-tab'}
            to="/administradores"
          >
            <span aria-hidden="true">☷</span> Lista da Equipe
          </Link>
          <Link
            className={!isLista || voluntarioEdicao ? 'crud-tab crud-tab--active' : 'crud-tab'}
            to="/voluntarios"
          >
            <span aria-hidden="true">＋</span> {voluntarioEdicao ? 'Editar Membro' : 'Novo Cadastro'}
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