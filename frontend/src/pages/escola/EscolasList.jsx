import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { aprovarEscola, getEscolas } from "../../services/escolasService";
import { useAuth } from "../../contexts/AuthContext";
import "./EscolasList.css";

const obterClasseBadgeStatus = (escola) => {
  if (!escola.ativa || escola.status === "inativa") {
    return "badge badge--inativa";
  }
  if (escola.status === "pendente") {
    return "badge badge--pendente";
  }
  return "badge badge--ativa";
};

const obterTextoStatus = (escola) => {
  if (!escola.ativa || escola.status === "inativa") {
    return "Inativa";
  }
  if (escola.status === "pendente") {
    return "Pendente";
  }
  return "Aprovada";
};

const EscolasList = () => {
  const [escolas, setEscolas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todas");
  const [exibirInativas, setExibirInativas] = useState(false);
  const { hasRole } = useAuth();
  const permissao = hasRole(["admin", "superadmin"]);

  useEffect(() => {
    let ativo = true;

    getEscolas()
      .then((dados) => {
        if (ativo) {
          setEscolas(dados);
          setCarregando(false);
        }
      })
      .catch(() => {
        if (ativo) {
          setErro("Não foi possível carregar as escolas parceiras.");
          setCarregando(false);
        }
      });

    return () => {
      ativo = false;
    };
  }, []);

  const handleAprovarRapido = async (id) => {
    try {
      const atualizada = await aprovarEscola(id);
      setEscolas((atual) =>
        atual.map((item) => (item.id === atualizada.id ? atualizada : item)),
      );
    } catch {
      setErro("Não foi possível aprovar a escola.");
    }
  };

  const metricas = useMemo(() => {
    const total = escolas.length;
    const aprovadas = escolas.filter(
      (e) => e.ativa && e.status === "aprovada",
    ).length;
    const pendentes = escolas.filter(
      (e) => e.ativa && e.status === "pendente",
    ).length;
    const inativas = escolas.filter(
      (e) => !e.ativa || e.status === "inativa",
    ).length;
    const totalAlunos = escolas.reduce(
      (acc, e) => acc + (e.alunos ? e.alunos.length : 0),
      0,
    );

    return { total, aprovadas, pendentes, inativas, totalAlunos };
  }, [escolas]);

  const escolasVisiveis = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return escolas.filter((escola) => {
      const isInativa = !escola.ativa || escola.status === "inativa";

      if (!exibirInativas && filtroStatus !== "inativa" && isInativa) {
        return false;
      }

      if (filtroStatus === "aprovada" && (isInativa || escola.status !== "aprovada")) {
        return false;
      }
      if (filtroStatus === "pendente" && (isInativa || escola.status !== "pendente")) {
        return false;
      }
      if (filtroStatus === "inativa" && !isInativa) {
        return false;
      }

      if (!termo) return true;

      return (
        escola.nome.toLowerCase().includes(termo) ||
        escola.cnpj.toLowerCase().includes(termo) ||
        (escola.responsavel && escola.responsavel.toLowerCase().includes(termo)) ||
        (escola.tipo && escola.tipo.toLowerCase().includes(termo))
      );
    });
  }, [escolas, busca, filtroStatus, exibirInativas]);

  return (
    <section className="page-gradient">
      <div className="my-container">
        <div className="escolas-page__header">
          <div>
            <h1 className="escolas-page__title">Escolas Parceiras</h1>
            <p className="escolas-page__subtitle">
              Painel de gestão, credenciamento e acompanhamento das instituições parceiras do ELLP.
            </p>
          </div>
          {permissao && (
            <Link to="/escolas/nova" className="btn-pill btn-pill--orange">
              Nova escola
            </Link>
          )}
        </div>

        {!carregando && !erro && (
          <div className="escolas-summary" aria-label="Resumo de escolas">
            <div className="escolas-summary__card">
              <span className="escolas-summary__label">Total cadastradas</span>
              <strong className="escolas-summary__value">{metricas.total}</strong>
            </div>
            <div className="escolas-summary__card escolas-summary__card--highlight">
              <span className="escolas-summary__label">Escolas aprovadas</span>
              <strong className="escolas-summary__value">{metricas.aprovadas}</strong>
            </div>
            <div className="escolas-summary__card escolas-summary__card--warning">
              <span className="escolas-summary__label">Aguardando aprovação</span>
              <strong className="escolas-summary__value">{metricas.pendentes}</strong>
            </div>
            <div className="escolas-summary__card">
              <span className="escolas-summary__label">Alunos vinculados</span>
              <strong className="escolas-summary__value">{metricas.totalAlunos}</strong>
            </div>
          </div>
        )}

        {carregando && (
          <p className="state-message state-message--on-dark">
            Carregando escolas parceiras...
          </p>
        )}

        {!carregando && erro && (
          <p className="state-message state-message--on-dark" role="alert">
            {erro}
          </p>
        )}

        {!carregando && !erro && (
          <>
            <div className="escolas-toolbar">
              <div className="escolas-toolbar__search">
                <input
                  type="search"
                  className="escolas-search__input"
                  placeholder="Buscar por nome, CNPJ, tipo ou responsável..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  aria-label="Buscar escolas"
                />
              </div>

              <div className="escolas-toolbar__controls">
                <select
                  className="escolas-select"
                  value={filtroStatus}
                  onChange={(e) => setFiltroStatus(e.target.value)}
                  aria-label="Filtrar por status"
                >
                  <option value="todas">Todos os status</option>
                  <option value="aprovada">Aprovadas</option>
                  <option value="pendente">Pendentes</option>
                  <option value="inativa">Inativas</option>
                </select>

                {permissao && (
                  <label className="escolas-filter">
                    <input
                      className="escolas-filter__input"
                      type="checkbox"
                      checked={exibirInativas}
                      onChange={(e) => setExibirInativas(e.target.checked)}
                    />
                    <span>
                      Exibir inativas
                      {metricas.inativas > 0 ? ` (${metricas.inativas})` : ""}
                    </span>
                  </label>
                )}

                <span className="escolas-toolbar__count">
                  {escolasVisiveis.length}{" "}
                  {escolasVisiveis.length === 1 ? "instituição" : "instituições"}
                </span>
              </div>
            </div>

            {escolasVisiveis.length === 0 ? (
              <div className="escolas-empty">
                <p className="state-message state-message--on-dark">
                  Nenhuma escola encontrada para os filtros selecionados.
                </p>
                {permissao && (
                  <Link to="/escolas/nova" className="btn-pill btn-pill--white">
                    Cadastrar nova escola
                  </Link>
                )}
              </div>
            ) : (
              <ul className="escolas-grid">
                {escolasVisiveis.map((escola) => {
                  const totalAlunosEscola = escola.alunos
                    ? escola.alunos.length
                    : 0;
                  const isInativa =
                    !escola.ativa || escola.status === "inativa";

                  return (
                    <li
                      key={escola.id}
                      className={
                        isInativa
                          ? "escola-item escola-item--inativa"
                          : escola.status === "pendente"
                            ? "escola-item escola-item--pendente"
                            : "escola-item"
                      }
                    >
                      <div className="escola-item__top">
                        <span className="escola-item__id">
                          #{String(escola.id).padStart(2, "0")}
                        </span>
                        <div className="escola-item__badges">
                          {escola.tipo && (
                            <span className="badge badge--tipo">
                              {escola.tipo}
                            </span>
                          )}
                          <span className={obterClasseBadgeStatus(escola)}>
                            {obterTextoStatus(escola)}
                          </span>
                        </div>
                      </div>

                      <h2 className="escola-item__title">{escola.nome}</h2>
                      <p className="escola-item__cnpj">CNPJ: {escola.cnpj}</p>

                      <div className="escola-item__info">
                        {escola.responsavel && (
                          <p>
                            <strong>Responsável:</strong> {escola.responsavel}
                          </p>
                        )}
                        <p>
                          <strong>Endereço:</strong> {escola.endereco}
                        </p>
                        {escola.telefone && (
                          <p>
                            <strong>Telefone:</strong> {escola.telefone}
                          </p>
                        )}
                      </div>

                      <div className="escola-item__metrics">
                        <span>
                          <strong>{totalAlunosEscola}</strong>{" "}
                          {totalAlunosEscola === 1
                            ? "aluno inscrito"
                            : "alunos inscritos"}
                        </span>
                        <span>•</span>
                        <span>
                          {escola.vagasSolicitadas || 0} vagas solicitadas
                        </span>
                      </div>

                      {escola.cartaConviteEmitidaEm && (
                        <p className="escola-item__convite">
                          ✓ Carta-convite emitida em {escola.cartaConviteEmitidaEm}
                        </p>
                      )}

                      <div className="escola-item__actions">
                        <Link
                          to={`/escolas/${escola.id}`}
                          className="btn-pill btn-pill--blue btn-pill--small"
                        >
                          Abrir painel
                        </Link>
                        {permissao && (
                          <Link
                            to={`/escolas/${escola.id}/editar`}
                            className="btn-pill btn-pill--outline-dark btn-pill--small"
                          >
                            Editar
                          </Link>
                        )}
                        {permissao &&
                          escola.status === "pendente" &&
                          escola.ativa && (
                            <button
                              type="button"
                              className="btn-pill btn-pill--orange btn-pill--small"
                              onClick={() => handleAprovarRapido(escola.id)}
                            >
                              Aprovar
                            </button>
                          )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default EscolasList;
