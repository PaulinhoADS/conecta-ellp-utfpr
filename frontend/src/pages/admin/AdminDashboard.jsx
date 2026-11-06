import { Link } from "react-router-dom";
import "./AdminDashboard.css";

const PREVIA_SOLICITACOES = 3;

const resumo = {
  administradores: 3,
  oficinas: 5,
  escolas: 8,
  alunos: 214,
};

const pendentes = [
  {
    id: 3,
    nome: "Escola Rural Exemplo",
    cidade: "Cornélio Procópio",
    responsavel: "Carla Exemplo",
    createdAt: "2026-10-28T15:00:00.000Z",
  },
  {
    id: 4,
    nome: "Escola Municipal Modelo",
    cidade: "Cornélio Procópio",
    responsavel: "Diego Exemplo",
    createdAt: "2026-10-30T15:00:00.000Z",
  },
  {
    id: 5,
    nome: "Colégio Modelo",
    cidade: "Cornélio Procópio",
    responsavel: "Elisa Exemplo",
    createdAt: "2026-11-02T15:00:00.000Z",
  },
  {
    id: 6,
    nome: "Escola Estadual Modelo",
    cidade: "Cornélio Procópio",
    responsavel: "Fábio Exemplo",
    createdAt: "2026-11-03T15:00:00.000Z",
  },
];

const indicadores = [
  { chave: "administradores", rotulo: "Administradores ativos" },
  { chave: "oficinas", rotulo: "Oficinas ativas" },
  { chave: "escolas", rotulo: "Escolas ativas" },
  { chave: "alunos", rotulo: "Alunos ativos" },
];

const atalhos = [
  {
    id: "oficinas",
    titulo: "Oficinas",
    descricao: "Consulte as oficinas existentes ou cadastre uma nova.",
    listagem: "/oficinas",
    nomeListagem: "Ver lista de oficinas",
    criacao: "/oficinas/nova",
    nomeCriacao: "Cadastrar oficina",
  },
  {
    id: "administradores",
    titulo: "Administradores",
    descricao:
      "Veja quem tem acesso ao painel ou cadastre outro administrador.",
    listagem: "/admin/administradores",
    nomeListagem: "Ver lista de administradores",
    criacao: "/admin/administradores/novo",
    nomeCriacao: "Cadastrar administrador",
  },
];

const AdminDashboard = () => {
  const restantes = pendentes.length - PREVIA_SOLICITACOES;

  return (
    <section className="page-gradient">
      <div className="my-container">
        <div className="page-header">
          <div>
            <h1 className="page-header__title">Painel administrativo</h1>
            <p className="page-header__subtitle">
              Acompanhe o projeto ELLP e gerencie o sistema.
            </p>
          </div>
        </div>

        <ul className="admin-stats">
          {indicadores.map((indicador) => (
            <li key={indicador.chave} className="admin-stat">
              <span className="admin-stat__value">
                {resumo[indicador.chave]}
              </span>
              <span className="admin-stat__label">{indicador.rotulo}</span>
            </li>
          ))}
        </ul>

        <section className="panel panel--fluid admin-pending">
          <div className="panel__header admin-pending__header">
            <span>Solicitações de escolas</span>
            <span className="admin-pending__badge">
              {pendentes.length}{" "}
              {pendentes.length === 1 ? "pendente" : "pendentes"}
            </span>
          </div>
          <div className="panel__body">
            {pendentes.length === 0 ? (
              <p className="state-message">Nenhuma solicitação pendente.</p>
            ) : (
              <>
                <ul className="admin-pending__list">
                  {pendentes.slice(0, PREVIA_SOLICITACOES).map((escola) => (
                    <li key={escola.id} className="admin-pending__item">
                      <div>
                        <p className="admin-pending__name">{escola.nome}</p>
                        <p className="admin-pending__meta">
                          {escola.cidade} · Responsável: {escola.responsavel}
                        </p>
                      </div>
                      <time
                        className="admin-pending__date"
                        dateTime={escola.createdAt}
                      >
                        {new Date(escola.createdAt).toLocaleDateString("pt-BR")}
                      </time>
                    </li>
                  ))}
                </ul>
                {restantes > 0 && (
                  <p className="admin-pending__more">
                    e mais {restantes}{" "}
                    {restantes === 1 ? "solicitação" : "solicitações"}
                  </p>
                )}
                <Link
                  to="/admin/solicitacoes"
                  className="btn-pill btn-pill--blue"
                >
                  Analisar solicitações
                </Link>
              </>
            )}
          </div>
        </section>

        <h2 className="admin-section-title">Acesso rápido</h2>
        <div className="admin-shortcuts">
          {atalhos.map((atalho) => (
            <article key={atalho.id} className="admin-shortcut">
              <h3 className="admin-shortcut__title">{atalho.titulo}</h3>
              <p className="admin-shortcut__text">{atalho.descricao}</p>
              <div className="admin-shortcut__actions">
                <Link
                  to={atalho.listagem}
                  className="btn-pill btn-pill--blue btn-pill--small"
                  aria-label={atalho.nomeListagem}
                >
                  Ver lista
                </Link>
                <Link
                  to={atalho.criacao}
                  className="btn-pill btn-pill--outline-dark btn-pill--small"
                  aria-label={atalho.nomeCriacao}
                >
                  Cadastrar
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdminDashboard;
