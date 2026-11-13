import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  aprovarEscola,
  deleteEscola,
  getEscolaById,
  registrarCartaConvite,
} from "../../services/escolasService";
import {
  createAluno,
  deleteAluno,
  updateAluno,
} from "../../services/alunosService";
import { useAuth } from "../../contexts/AuthContext";
import { generatePassword } from "../../utils/utils";
import ModalRedefinirSenha from "../../components/modal-redefiinir-senha/ModalRedefinirSenha";
import "./EscolaDetalhe.css";

const OFICINAS_RECOMENDADAS = [
  "Aguardando Quiz Perfil Tech",
  "Robótica LEGO",
  "Robótica com Arduino",
  "Modelagem 3D",
  "Fábrica de Sites",
  "Desenvolvimento de Jogos",
];

const criarFormularioAlunoInicial = () => ({
  nome: "",
  username: "",
  idade: "",
  perfilLologico: "Aguardando Quiz Perfil Tech",
  senhaTemporaria: generatePassword(10),
});

const sugerirUsername = (nome = "") => {
  const partes = String(nome)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (partes.length === 0) return "";
  if (partes.length === 1) return partes[0];
  return `${partes[0]}.${partes[partes.length - 1]}`;
};

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
    return "Pendente de aprovação";
  }
  return "Aprovada";
};

const EscolaDetalhe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasRole, user } = useAuth();
  const permissaoAdmin = hasRole(["admin", "superadmin"]);
  const permissaoEscola = hasRole(["admin", "superadmin", "escola"]);

  const [escola, setEscola] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [mensagemSucesso, setMensagemSucesso] = useState("");

  // Estado do formulário de Aluno
  const [mostrarFormAluno, setMostrarFormAluno] = useState(false);
  const [alunoEditandoId, setAlunoEditandoId] = useState(null);
  const [usernameEditadoManualmente, setUsernameEditadoManualmente] =
    useState(false);
  const [formAluno, setFormAluno] = useState(criarFormularioAlunoInicial);
  const [erroAluno, setErroAluno] = useState("");
  const [credenciaisRecentes, setCredenciaisRecentes] = useState(null);
  const [copiado, setCopiado] = useState(false);

  // Estado dos modais
  const [modalCartaAberto, setModalCartaAberto] = useState(false);
  const [modalSenhaAberto, setModalSenhaAberto] = useState(false);
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false);

  useEffect(() => {
    let ativo = true;

    getEscolaById(id)
      .then((dados) => {
        if (!ativo) return;
        setEscola(dados);
        setErro("");
        setCarregando(false);
      })
      .catch(() => {
        if (ativo) {
          setErro("Não foi possível carregar o painel da escola.");
          setCarregando(false);
        }
      });

    return () => {
      ativo = false;
    };
  }, [id]);

  const exibirFeedback = (texto) => {
    setMensagemSucesso(texto);
    window.setTimeout(() => {
      setMensagemSucesso("");
    }, 4000);
  };

  const handleAprovarEscola = async () => {
    try {
      const atualizada = await aprovarEscola(escola.id);
      setEscola(atualizada);
      exibirFeedback(
        "Escola parceira aprovada com sucesso! Agora você já pode emitir a carta-convite.",
      );
    } catch {
      setErro("Não foi possível aprovar a escola.");
    }
  };

  const handleAbrirCartaConvite = async () => {
    try {
      const atualizada = await registrarCartaConvite(escola.id);
      setEscola(atualizada);
      setModalCartaAberto(true);
    } catch {
      setErro("Não foi possível gerar a carta-convite.");
    }
  };

  const handleImprimirCarta = () => {
    window.print();
  };

  const handleExcluirEscola = async () => {
    try {
      await deleteEscola(escola.id);
      navigate("/escolas");
    } catch {
      setErro("Não foi possível excluir a escola.");
    }
  };

  // Handlers de Alunos
  const handleAbrirNovoAluno = () => {
    setAlunoEditandoId(null);
    setUsernameEditadoManualmente(false);
    setFormAluno(criarFormularioAlunoInicial());
    setErroAluno("");
    setCredenciaisRecentes(null);
    setMostrarFormAluno(true);
  };

  const handleEditarAluno = (aluno) => {
    setAlunoEditandoId(aluno.id);
    setUsernameEditadoManualmente(true);
    setFormAluno({
      nome: aluno.nome,
      username: aluno.username || "",
      idade: String(aluno.idade),
      perfilLologico: aluno.perfilLologico || "Aguardando Quiz Perfil Tech",
      senhaTemporaria: "",
    });
    setErroAluno("");
    setMostrarFormAluno(true);
  };

  const handleCancelarAluno = () => {
    setMostrarFormAluno(false);
    setAlunoEditandoId(null);
    setUsernameEditadoManualmente(false);
    setFormAluno(criarFormularioAlunoInicial());
    setErroAluno("");
  };

  const handleNomeAlunoChange = (event) => {
    const novoNome = event.target.value;
    setFormAluno((atual) => ({
      ...atual,
      nome: novoNome,
      username: usernameEditadoManualmente
        ? atual.username
        : sugerirUsername(novoNome),
    }));
  };

  const handleUsernameAlunoChange = (event) => {
    const valor = event.target.value.toLowerCase().replace(/\s+/g, "");
    setUsernameEditadoManualmente(true);
    setFormAluno((atual) => ({
      ...atual,
      username: valor,
    }));
  };

  const handleRegerarSenhaTemporaria = () => {
    setFormAluno((atual) => ({
      ...atual,
      senhaTemporaria: generatePassword(10),
    }));
  };

  const handleCopiarCredenciais = async () => {
    if (!credenciaisRecentes) return;
    const texto = `Aluno: ${credenciaisRecentes.nome}\nUsuário: ${credenciaisRecentes.username}\nSenha temporária: ${credenciaisRecentes.senhaTemporaria}`;
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(true);
      window.setTimeout(() => setCopiado(false), 2500);
    } catch {
      setCopiado(false);
    }
  };

  const handleSalvarAluno = async (event) => {
    event.preventDefault();
    const idadeNum = Number(formAluno.idade);

    if (!formAluno.nome.trim()) {
      setErroAluno("Informe o nome completo do aluno.");
      return;
    }
    if (!formAluno.username.trim()) {
      setErroAluno("Defina um nome de usuário (username) para o aluno.");
      return;
    }
    if (!Number.isInteger(idadeNum) || idadeNum < 6 || idadeNum > 25) {
      setErroAluno("Informe uma idade válida (entre 6 e 25 anos).");
      return;
    }

    try {
      if (alunoEditandoId) {
        await updateAluno(escola.id, alunoEditandoId, formAluno);
        exibirFeedback("Dados do aluno atualizados com sucesso!");
      } else {
        const novoAluno = await createAluno(escola.id, formAluno);
        setCredenciaisRecentes({
          id: novoAluno.id,
          nome: novoAluno.nome,
          username: novoAluno.username,
          senhaTemporaria: novoAluno.senhaTemporaria,
        });
        exibirFeedback("Aluno cadastrado com sucesso! Repasse as credenciais temporárias abaixo ao estudante.");
      }
      const atualizada = await getEscolaById(escola.id);
      setEscola(atualizada);
      handleCancelarAluno();
    } catch (erroReq) {
      if (erroReq?.response?.status === 409) {
        setErroAluno("Este nome de usuário já está em uso. Escolha outro.");
      } else {
        setErroAluno("Não foi possível salvar os dados do aluno.");
      }
    }
  };

  const handleRemoverAluno = async (alunoId) => {
    try {
      await deleteAluno(escola.id, alunoId);
      const atualizada = await getEscolaById(escola.id);
      setEscola(atualizada);
      exibirFeedback("Aluno removido da lista da escola.");
    } catch {
      setErro("Não foi possível remover o aluno.");
    }
  };

  if (carregando) {
    return (
      <section className="page-gradient">
        <div className="panel panel--xl">
          <div className="panel__body">
            <p className="state-message">Carregando painel da escola...</p>
          </div>
        </div>
      </section>
    );
  }

  if (erro || !escola) {
    return (
      <section className="page-gradient">
        <div className="panel panel--xl">
          <div className="panel__body">
            <p className="state-message" role="alert">
              {erro || "Escola não encontrada."}
            </p>
            <div className="escola-detail__actions escola-detail__actions--center">
              <Link to="/escolas" className="btn-pill btn-pill--blue">
                Voltar para as escolas
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const totalAlunos = escola.alunos ? escola.alunos.length : 0;
  const ehPropriaEscola =
    hasRole("escola") && String(user?.id) === String(escola.id);

  return (
    <section className="page-gradient">
      <div className="escola-painel-wrapper">
        <article className="panel panel--xl">
          <div className="panel__header">
            Painel da Instituição Parceira • Gestão ELLP
          </div>
          <div className="panel__body">
            {mensagemSucesso && (
              <div className="escola-alert escola-alert--success" role="status">
                {mensagemSucesso}
              </div>
            )}

            <div className="escola-detail__top">
              <div>
                <div className="escola-detail__badges">
                  <span className="escola-detail__code">
                    #{String(escola.id).padStart(2, "0")}
                  </span>
                  {escola.tipo && (
                    <span className="badge badge--tipo">{escola.tipo}</span>
                  )}
                  <span className={obterClasseBadgeStatus(escola)}>
                    {obterTextoStatus(escola)}
                  </span>
                </div>
                <h1 className="escola-detail__title">{escola.nome}</h1>
                <p className="escola-detail__cnpj">CNPJ: {escola.cnpj}</p>
              </div>

              <div className="escola-detail__quick-actions">
                {permissaoAdmin &&
                  escola.status === "pendente" &&
                  escola.ativa && (
                    <button
                      type="button"
                      className="btn-pill btn-pill--orange btn-pill--small"
                      onClick={handleAprovarEscola}
                    >
                      ✓ Aprovar escola
                    </button>
                  )}
                {permissaoAdmin && (
                  <button
                    type="button"
                    className="btn-pill btn-pill--blue btn-pill--small"
                    onClick={handleAbrirCartaConvite}
                  >
                    ✉ Emitir carta-convite
                  </button>
                )}
                {ehPropriaEscola && (
                  <button
                    type="button"
                    className="btn-pill btn-pill--outline-dark btn-pill--small"
                    onClick={() => setModalSenhaAberto(true)}
                  >
                    Redefinir senha
                  </button>
                )}
              </div>
            </div>

            <dl className="escola-detail__facts">
              <div className="escola-detail__fact">
                <dt className="escola-detail__fact-label">Alunos inscritos</dt>
                <dd className="escola-detail__fact-value">
                  {totalAlunos}{" "}
                  <span className="escola-detail__fact-sub">
                    / {escola.vagasSolicitadas || 0} vagas
                  </span>
                </dd>
              </div>
              <div className="escola-detail__fact">
                <dt className="escola-detail__fact-label">Carta-convite</dt>
                <dd className="escola-detail__fact-value escola-detail__fact-value--sm">
                  {escola.cartaConviteEmitidaEm
                    ? `Emitida (${escola.cartaConviteEmitidaEm})`
                    : "Aguardando emissão"}
                </dd>
              </div>
              <div className="escola-detail__fact">
                <dt className="escola-detail__fact-label">Responsável</dt>
                <dd className="escola-detail__fact-value escola-detail__fact-value--sm">
                  {escola.responsavel || "Não informado"}
                </dd>
              </div>
            </dl>

            <div className="escola-detail__info-grid">
              <div>
                <h2 className="escola-detail__section-title">
                  Endereço institucional
                </h2>
                <p className="escola-detail__text">{escola.endereco}</p>
              </div>
              <div>
                <h2 className="escola-detail__section-title">
                  Canais de contato
                </h2>
                <p className="escola-detail__text">
                  <strong>Telefone:</strong> {escola.telefone || "Não informado"}
                  <br />
                  <strong>E-mail:</strong> {escola.email || "Não informado"}
                </p>
              </div>
            </div>

            {escola.observacoes && (
              <div className="escola-detail__notes">
                <h2 className="escola-detail__section-title">
                  Observações da parceria
                </h2>
                <p className="escola-detail__description">
                  {escola.observacoes}
                </p>
              </div>
            )}

            <hr className="escola-detail__divider" />

            {/* Seção de Gestão de Alunos da Escola */}
            <section
              className="escola-alunos"
              aria-labelledby="titulo-alunos-escola"
            >
              <div className="escola-alunos__header">
                <div>
                  <h2
                    id="titulo-alunos-escola"
                    className="escola-alunos__title"
                  >
                    Alunos vinculados à instituição
                  </h2>
                  <p className="escola-alunos__subtitle">
                    Cadastre os alunos encaminhados pela escola, gere suas
                    credenciais de acesso e acompanhe a oficina recomendada.
                  </p>
                </div>
                <div className="escola-alunos__header-actions">
                  {permissaoEscola && !mostrarFormAluno && (
                    <button
                      type="button"
                      className="btn-pill btn-pill--orange btn-pill--small"
                      onClick={handleAbrirNovoAluno}
                    >
                      + Cadastrar aluno
                    </button>
                  )}
                </div>
              </div>

              {credenciaisRecentes && (
                <div
                  className="escola-credenciais-card"
                  role="region"
                  aria-label="Credenciais temporárias do aluno recém-cadastrado"
                >
                  <div className="escola-credenciais-card__header">
                    <div>
                      <strong>
                        Credenciais de acesso geradas para{" "}
                        {credenciaisRecentes.nome}
                      </strong>
                      <p>
                        Anote ou copie os dados abaixo e repasse ao estudante.
                        Ele poderá alterar a senha temporária no primeiro
                        acesso.
                      </p>
                    </div>
                    <button
                      type="button"
                      className="escola-credenciais-card__close"
                      onClick={() => setCredenciaisRecentes(null)}
                      aria-label="Fechar aviso de credenciais"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="escola-credenciais-card__grid">
                    <div className="escola-credenciais-card__item">
                      <span>Usuário (username)</span>
                      <code>{credenciaisRecentes.username}</code>
                    </div>
                    <div className="escola-credenciais-card__item">
                      <span>Senha temporária</span>
                      <code>{credenciaisRecentes.senhaTemporaria}</code>
                    </div>
                  </div>

                  <div className="escola-credenciais-card__actions">
                    <button
                      type="button"
                      className="btn-pill btn-pill--blue btn-pill--small"
                      onClick={handleCopiarCredenciais}
                    >
                      {copiado ? "✓ Credenciais copiadas!" : "Copiar credenciais"}
                    </button>
                    <Link
                      to={`/escolas/${escola.id}/alunos/${credenciaisRecentes.id}`}
                      className="btn-pill btn-pill--outline-dark btn-pill--small"
                    >
                      Ver perfil do aluno
                    </Link>
                  </div>
                </div>
              )}

              {mostrarFormAluno && (
                <form
                  className="escola-aluno-form"
                  onSubmit={handleSalvarAluno}
                  noValidate
                >
                  <h3 className="escola-aluno-form__title">
                    {alunoEditandoId
                      ? "Editar dados do aluno"
                      : "Novo aluno da instituição"}
                  </h3>

                  <div className="escola-aluno-form__grid">
                    <div className="form-field">
                      <label className="form-field__label" htmlFor="aluno-nome">
                        Nome completo do aluno
                      </label>
                      <input
                        id="aluno-nome"
                        type="text"
                        className="form-field__input"
                        placeholder="Ex.: Lucas Gabriel Martins"
                        value={formAluno.nome}
                        onChange={handleNomeAlunoChange}
                      />
                    </div>

                    <div className="form-field">
                      <label
                        className="form-field__label"
                        htmlFor="aluno-username"
                      >
                        Nome de usuário (username)
                      </label>
                      <input
                        id="aluno-username"
                        type="text"
                        className="form-field__input"
                        placeholder="Ex.: lucas.martins"
                        value={formAluno.username}
                        onChange={handleUsernameAlunoChange}
                      />
                    </div>

                    <div className="form-field">
                      <label
                        className="form-field__label"
                        htmlFor="aluno-idade"
                      >
                        Idade
                      </label>
                      <input
                        id="aluno-idade"
                        type="number"
                        min="6"
                        max="25"
                        className="form-field__input"
                        placeholder="Ex.: 12"
                        value={formAluno.idade}
                        onChange={(e) =>
                          setFormAluno((atual) => ({
                            ...atual,
                            idade: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="form-field">
                      <label
                        className="form-field__label"
                        htmlFor="aluno-perfil"
                      >
                        Oficina / Perfil Tech (Quiz)
                      </label>
                      <select
                        id="aluno-perfil"
                        className="form-field__input"
                        value={formAluno.perfilLologico}
                        onChange={(e) =>
                          setFormAluno((atual) => ({
                            ...atual,
                            perfilLologico: e.target.value,
                          }))
                        }
                      >
                        {OFICINAS_RECOMENDADAS.map((oficina) => (
                          <option key={oficina} value={oficina}>
                            {oficina}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {!alunoEditandoId && (
                    <div className="escola-aluno-form__password-box">
                      <div>
                        <span className="escola-aluno-form__password-label">
                          Senha temporária gerada automaticamente:
                        </span>
                        <code className="escola-aluno-form__password-code">
                          {formAluno.senhaTemporaria}
                        </code>
                        <span className="form-field__hint">
                          Esta senha será exibida após o cadastro para que a
                          escola repasse ao estudante.
                        </span>
                      </div>
                      <button
                        type="button"
                        className="btn-pill btn-pill--outline-dark btn-pill--small"
                        onClick={handleRegerarSenhaTemporaria}
                      >
                        Gerar outra senha
                      </button>
                    </div>
                  )}

                  {erroAluno && (
                    <p className="form-field__error" role="alert">
                      {erroAluno}
                    </p>
                  )}

                  <div className="escola-aluno-form__actions">
                    <button
                      type="submit"
                      className="btn-pill btn-pill--blue btn-pill--small"
                    >
                      {alunoEditandoId ? "Salvar aluno" : "Adicionar aluno"}
                    </button>
                    <button
                      type="button"
                      className="btn-pill btn-pill--outline-dark btn-pill--small"
                      onClick={handleCancelarAluno}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              )}

              {totalAlunos === 0 ? (
                <div className="escola-alunos__empty">
                  <p>Nenhum aluno vinculado a esta escola até o momento.</p>
                </div>
              ) : (
                <div className="escola-alunos__table-wrap">
                  <table className="escola-alunos__table">
                    <thead>
                      <tr>
                        <th>Código</th>
                        <th>Nome do aluno</th>
                        <th>Usuário</th>
                        <th>Idade</th>
                        <th>Oficina Recomendada (Quiz)</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {escola.alunos.map((aluno) => (
                        <tr key={aluno.id}>
                          <td className="escola-alunos__id">
                            #{String(aluno.id).padStart(2, "0")}
                          </td>
                          <td className="escola-alunos__nome">{aluno.nome}</td>
                          <td className="escola-alunos__username">
                            @{aluno.username}
                          </td>
                          <td>{aluno.idade} anos</td>
                          <td>
                            <span
                              className={
                                aluno.perfilLologico ===
                                "Aguardando Quiz Perfil Tech"
                                  ? "badge badge--pendente"
                                  : "badge badge--ativa"
                              }
                            >
                              {aluno.perfilLologico}
                            </span>
                          </td>
                          <td className="escola-alunos__row-actions">
                            <Link
                              to={`/escolas/${escola.id}/alunos/${aluno.id}`}
                              className="escola-link-btn"
                            >
                              Ver detalhes
                            </Link>
                            {permissaoEscola && (
                              <>
                                <button
                                  type="button"
                                  className="escola-link-btn"
                                  onClick={() => handleEditarAluno(aluno)}
                                >
                                  Editar
                                </button>
                                <button
                                  type="button"
                                  className="escola-link-btn escola-link-btn--danger"
                                  onClick={() => handleRemoverAluno(aluno.id)}
                                >
                                  Remover
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <hr className="escola-detail__divider" />

            <div className="escola-detail__actions">
              {permissaoEscola && (
                <Link
                  to={`/escolas/${escola.id}/editar`}
                  className="btn-pill btn-pill--blue"
                >
                  Editar dados da escola
                </Link>
              )}
              {permissaoAdmin && (
                <>
                  {!confirmandoExclusao ? (
                    <button
                      type="button"
                      className="btn-pill btn-pill--danger"
                      onClick={() => setConfirmandoExclusao(true)}
                    >
                      Excluir escola
                    </button>
                  ) : (
                    <div className="escola-confirm-delete">
                      <span>Confirmar exclusão definitiva?</span>
                      <button
                        type="button"
                        className="btn-pill btn-pill--danger btn-pill--small"
                        onClick={handleExcluirEscola}
                      >
                        Sim, excluir
                      </button>
                      <button
                        type="button"
                        className="btn-pill btn-pill--outline-dark btn-pill--small"
                        onClick={() => setConfirmandoExclusao(false)}
                      >
                        Cancelar
                      </button>
                    </div>
                  )}
                </>
              )}
              {permissaoAdmin && (
                <Link to="/escolas" className="btn-pill btn-pill--outline-dark">
                  Voltar para a lista
                </Link>
              )}
            </div>
          </div>
        </article>
      </div>

      {/* Modal de Redefinição de Senha */}
      <ModalRedefinirSenha
        aberto={modalSenhaAberto}
        onFechar={() => setModalSenhaAberto(false)}
      />

      {/* Modal de Carta Convite */}
      {modalCartaAberto && (
        <div
          className="carta-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="carta-convite-titulo"
        >
          <div className="carta-modal">
            <div className="carta-modal__header">
              <h2 id="carta-convite-titulo">
                Carta-Convite Oficial • Conecta ELLP
              </h2>
              <button
                type="button"
                className="carta-modal__close"
                onClick={() => setModalCartaAberto(false)}
                aria-label="Fechar carta-convite"
              >
                ✕
              </button>
            </div>

            <div className="carta-modal__document">
              <div className="carta-doc__header">
                <strong>
                  UNIVERSIDADE TECNOLÓGICA FEDERAL DO PARANÁ — CÂMPUS CORNÉLIO
                  PROCÓPIO
                </strong>
                <span>
                  Programa de Extensão: Ensino Lúdico de Lógica e Programação
                  (ELLP)
                </span>
              </div>

              <p className="carta-doc__date">
                Cornélio Procópio - PR,{" "}
                {escola.cartaConviteEmitidaEm ||
                  new Date().toLocaleDateString("pt-BR")}
              </p>

              <div className="carta-doc__recipient">
                <p>
                  <strong>À Instituição:</strong> {escola.nome}
                </p>
                <p>
                  <strong>CNPJ:</strong> {escola.cnpj}
                </p>
                <p>
                  <strong>A/C Responsável:</strong>{" "}
                  {escola.responsavel || "Direção Pedagógica"}
                </p>
              </div>

              <h3 className="carta-doc__subject">
                ASSUNTO: Carta-Convite de Credenciamento e Participação nas
                Oficinas do Projeto ELLP
              </h3>

              <p>Prezada Direção / Coordenação,</p>
              <p>
                O grupo de extensão{" "}
                <strong>Ensino Lúdico de Lógica e Programação (ELLP)</strong> da
                UTFPR Câmpus Cornélio Procópio tem a satisfação de confirmar o
                credenciamento da instituição <strong>{escola.nome}</strong> em
                nossa plataforma <strong>Conecta ELLP</strong>.
              </p>
              <p>
                Por meio desta parceria, disponibilizamos{" "}
                <strong>{escola.vagasSolicitadas || 20} vagas</strong> para que
                os estudantes da instituição participem das oficinas gratuitas de
                Robótica, Programação, Desenvolvimento de Jogos, Modelagem 3D e
                Web aos sábados, precedidas pela triagem inteligente no{" "}
                <em>Quiz Perfil Tech</em>.
              </p>

              <div className="carta-doc__signature">
                <p>Atenciosamente,</p>
                <strong>Coordenação do Projeto de Extensão ELLP</strong>
                <span>UTFPR — Câmpus Cornélio Procópio</span>
              </div>
            </div>

            <div className="carta-modal__actions">
              <button
                type="button"
                className="btn-pill btn-pill--blue btn-pill--small"
                onClick={handleImprimirCarta}
              >
                Imprimir / Salvar em PDF
              </button>
              <button
                type="button"
                className="btn-pill btn-pill--outline-dark btn-pill--small"
                onClick={() => setModalCartaAberto(false)}
              >
                Fechar visualização
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default EscolaDetalhe;
