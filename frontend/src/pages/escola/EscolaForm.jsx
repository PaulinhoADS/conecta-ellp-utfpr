import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  createEscola,
  getEscolaById,
  updateEscola,
} from "../../services/escolasService";
import "./EscolaForm.css";

const LIMITE_OBSERVACOES = 500;

const formularioInicial = {
  nome: "",
  cnpj: "",
  tipo: "Escola Pública",
  endereco: "",
  telefone: "",
  email: "",
  responsavel: "",
  vagasSolicitadas: "20",
  status: "pendente",
  observacoes: "",
  ativa: true,
};

const formatarCnpj = (valor) => {
  const digitos = String(valor || "")
    .replace(/\D/g, "")
    .slice(0, 14);

  if (digitos.length <= 2) return digitos;
  if (digitos.length <= 5) return `${digitos.slice(0, 2)}.${digitos.slice(2)}`;
  if (digitos.length <= 8) {
    return `${digitos.slice(0, 2)}.${digitos.slice(2, 5)}.${digitos.slice(5)}`;
  }
  if (digitos.length <= 12) {
    return `${digitos.slice(0, 2)}.${digitos.slice(2, 5)}.${digitos.slice(5, 8)}/${digitos.slice(8)}`;
  }
  return `${digitos.slice(0, 2)}.${digitos.slice(2, 5)}.${digitos.slice(5, 8)}/${digitos.slice(8, 12)}-${digitos.slice(12, 14)}`;
};

const formatarTelefone = (valor) => {
  const digitos = String(valor || "")
    .replace(/\D/g, "")
    .slice(0, 11);

  if (digitos.length === 0) return "";
  if (digitos.length <= 2) return `(${digitos}`;
  if (digitos.length <= 6) {
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2)}`;
  }
  if (digitos.length <= 10) {
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 6)}-${digitos.slice(6)}`;
  }
  return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 7)}-${digitos.slice(7, 11)}`;
};

const validar = (valores) => {
  const erros = {};
  const cnpjDigitos = String(valores.cnpj || "").replace(/\D/g, "");
  const telDigitos = String(valores.telefone || "").replace(/\D/g, "");
  const vagas = Number(valores.vagasSolicitadas);

  if (!valores.nome.trim()) {
    erros.nome = "Informe o nome da instituição.";
  }
  if (cnpjDigitos.length !== 14) {
    erros.cnpj = "Informe um CNPJ válido com 14 dígitos.";
  }
  if (!valores.responsavel.trim()) {
    erros.responsavel = "Informe o nome do responsável ou diretor(a).";
  }
  if (telDigitos.length < 10) {
    erros.telefone = "Informe um telefone válido com DDD.";
  }
  if (
    !valores.email.trim() ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valores.email.trim())
  ) {
    erros.email = "Informe um e-mail institucional válido.";
  }
  if (!valores.endereco.trim()) {
    erros.endereco = "Informe o endereço completo da instituição.";
  }
  if (
    valores.vagasSolicitadas === "" ||
    !Number.isInteger(vagas) ||
    vagas < 1
  ) {
    erros.vagasSolicitadas = "Informe um número inteiro de vagas maior que zero.";
  }

  return erros;
};

const EscolaForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const modoEdicao = Boolean(id);

  const [valores, setValores] = useState(formularioInicial);
  const [tocados, setTocados] = useState({});
  const [submetido, setSubmetido] = useState(false);
  const [carregando, setCarregando] = useState(modoEdicao);
  const [salvando, setSalvando] = useState(false);
  const [erroCarga, setErroCarga] = useState("");
  const [erroEnvio, setErroEnvio] = useState("");

  useEffect(() => {
    if (!modoEdicao) {
      return undefined;
    }

    let ativo = true;

    getEscolaById(id)
      .then((dados) => {
        if (!ativo) return;

        setValores({
          nome: dados.nome ?? "",
          cnpj: dados.cnpj ?? "",
          tipo: dados.tipo ?? "Escola Pública",
          endereco: dados.endereco ?? "",
          telefone: dados.telefone ?? "",
          email: dados.email ?? "",
          responsavel: dados.responsavel ?? "",
          vagasSolicitadas:
            dados.vagasSolicitadas !== undefined
              ? String(dados.vagasSolicitadas)
              : "20",
          status: dados.status ?? "pendente",
          observacoes: dados.observacoes ?? "",
          ativa: dados.ativa ?? true,
        });
        setErroCarga("");
        setCarregando(false);
      })
      .catch(() => {
        if (ativo) {
          setErroCarga("Não foi possível carregar os dados da escola.");
          setCarregando(false);
        }
      });

    return () => {
      ativo = false;
    };
  }, [id, modoEdicao]);

  const erros = validar(valores);
  const mostrarErro = (campo) =>
    Boolean((tocados[campo] || submetido) && erros[campo]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    if (name === "cnpj") {
      setValores((atual) => ({ ...atual, cnpj: formatarCnpj(value) }));
      return;
    }

    if (name === "telefone") {
      setValores((atual) => ({ ...atual, telefone: formatarTelefone(value) }));
      return;
    }

    if (name === "ativa") {
      setValores((atual) => ({
        ...atual,
        ativa: checked,
        status: checked
          ? atual.status === "inativa"
            ? "aprovada"
            : atual.status
          : "inativa",
      }));
      return;
    }

    if (name === "status") {
      setValores((atual) => ({
        ...atual,
        status: value,
        ativa: value !== "inativa",
      }));
      return;
    }

    setValores((atual) => ({
      ...atual,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleBlur = (event) => {
    const { name } = event.target;
    setTocados((atual) => ({ ...atual, [name]: true }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmetido(true);
    setErroEnvio("");

    if (Object.keys(erros).length > 0) {
      return;
    }

    const payload = {
      nome: valores.nome.trim(),
      cnpj: valores.cnpj.trim(),
      tipo: valores.tipo,
      endereco: valores.endereco.trim(),
      telefone: valores.telefone.trim(),
      email: valores.email.trim(),
      responsavel: valores.responsavel.trim(),
      vagasSolicitadas: Number(valores.vagasSolicitadas),
      status: valores.ativa ? valores.status : "inativa",
      observacoes: valores.observacoes.trim(),
      ativa: valores.ativa,
    };

    try {
      setSalvando(true);
      if (modoEdicao) {
        await updateEscola(id, payload);
        navigate(`/escolas/${id}`);
      } else {
        const criada = await createEscola(payload);
        navigate(`/escolas/${criada.id}`);
      }
    } catch {
      setErroEnvio(
        "Não foi possível salvar os dados da escola. Tente novamente.",
      );
      setSalvando(false);
    }
  };

  if (carregando) {
    return (
      <section className="page-gradient">
        <div className="panel panel--wide">
          <div className="panel__body">
            <p className="state-message">Carregando escola...</p>
          </div>
        </div>
      </section>
    );
  }

  if (erroCarga) {
    return (
      <section className="page-gradient">
        <div className="panel panel--wide">
          <div className="panel__body">
            <p className="state-message" role="alert">
              {erroCarga}
            </p>
            <div className="escola-form__actions escola-form__actions--center">
              <Link to="/escolas" className="btn-pill btn-pill--blue">
                Voltar para as escolas
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="page-gradient">
      <div className="panel panel--wide">
        <div className="panel__header">
          {modoEdicao ? "Editar escola parceira" : "Nova escola parceira"}
        </div>
        <div className="panel__body">
          <h1 className="panel__title">
            {modoEdicao ? "Editar dados da escola" : "Cadastrar instituição"}
          </h1>
          <p className="panel__subtitle">
            {modoEdicao
              ? "Atualize os dados institucionais, contato e status da parceria com o ELLP."
              : "Preencha os dados institucionais para credenciar uma nova escola, ONG ou creche parceira."}
          </p>

          <form className="escola-form" onSubmit={handleSubmit} noValidate>
            <div className="form-field">
              <label className="form-field__label" htmlFor="nome">
                Nome da instituição
              </label>
              <input
                className="form-field__input"
                id="nome"
                name="nome"
                type="text"
                placeholder="Ex.: Colégio Estadual Monteiro Lobato"
                value={valores.nome}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={mostrarErro("nome")}
                aria-describedby={mostrarErro("nome") ? "erro-nome" : undefined}
              />
              {mostrarErro("nome") && (
                <p id="erro-nome" className="form-field__error">
                  {erros.nome}
                </p>
              )}
            </div>

            <div className="escola-form__row">
              <div className="form-field">
                <label className="form-field__label" htmlFor="cnpj">
                  CNPJ
                </label>
                <input
                  className="form-field__input"
                  id="cnpj"
                  name="cnpj"
                  type="text"
                  inputMode="numeric"
                  placeholder="00.000.000/0000-00"
                  value={valores.cnpj}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={mostrarErro("cnpj")}
                  aria-describedby={mostrarErro("cnpj") ? "erro-cnpj" : undefined}
                />
                {mostrarErro("cnpj") && (
                  <p id="erro-cnpj" className="form-field__error">
                    {erros.cnpj}
                  </p>
                )}
              </div>

              <div className="form-field">
                <label className="form-field__label" htmlFor="tipo">
                  Tipo de instituição
                </label>
                <select
                  className="form-field__input"
                  id="tipo"
                  name="tipo"
                  value={valores.tipo}
                  onChange={handleChange}
                >
                  <option value="Escola Pública">Escola Pública</option>
                  <option value="ONG">ONG</option>
                  <option value="Creche">Creche</option>
                  <option value="Instituição Parceira">
                    Instituição Parceira
                  </option>
                </select>
              </div>
            </div>

            <div className="escola-form__row">
              <div className="form-field">
                <label className="form-field__label" htmlFor="responsavel">
                  Responsável / Direção
                </label>
                <input
                  className="form-field__input"
                  id="responsavel"
                  name="responsavel"
                  type="text"
                  placeholder="Ex.: Prof.ª Márcia Helena Souza"
                  value={valores.responsavel}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={mostrarErro("responsavel")}
                  aria-describedby={
                    mostrarErro("responsavel") ? "erro-responsavel" : undefined
                  }
                />
                {mostrarErro("responsavel") && (
                  <p id="erro-responsavel" className="form-field__error">
                    {erros.responsavel}
                  </p>
                )}
              </div>

              <div className="form-field">
                <label className="form-field__label" htmlFor="telefone">
                  Telefone / WhatsApp
                </label>
                <input
                  className="form-field__input"
                  id="telefone"
                  name="telefone"
                  type="tel"
                  placeholder="(43) 3524-0000"
                  value={valores.telefone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={mostrarErro("telefone")}
                  aria-describedby={
                    mostrarErro("telefone") ? "erro-telefone" : undefined
                  }
                />
                {mostrarErro("telefone") && (
                  <p id="erro-telefone" className="form-field__error">
                    {erros.telefone}
                  </p>
                )}
              </div>
            </div>

            <div className="escola-form__row">
              <div className="form-field">
                <label className="form-field__label" htmlFor="email">
                  E-mail institucional
                </label>
                <input
                  className="form-field__input"
                  id="email"
                  name="email"
                  type="email"
                  placeholder="direcao@escola.pr.gov.br"
                  value={valores.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={mostrarErro("email")}
                  aria-describedby={
                    mostrarErro("email") ? "erro-email" : undefined
                  }
                />
                {mostrarErro("email") && (
                  <p id="erro-email" className="form-field__error">
                    {erros.email}
                  </p>
                )}
              </div>

              <div className="form-field">
                <label className="form-field__label" htmlFor="vagasSolicitadas">
                  Vagas solicitadas
                </label>
                <input
                  className="form-field__input"
                  id="vagasSolicitadas"
                  name="vagasSolicitadas"
                  type="number"
                  min="1"
                  step="1"
                  placeholder="Ex.: 20"
                  value={valores.vagasSolicitadas}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={mostrarErro("vagasSolicitadas")}
                  aria-describedby={
                    mostrarErro("vagasSolicitadas")
                      ? "erro-vagasSolicitadas"
                      : undefined
                  }
                />
                {mostrarErro("vagasSolicitadas") && (
                  <p id="erro-vagasSolicitadas" className="form-field__error">
                    {erros.vagasSolicitadas}
                  </p>
                )}
              </div>
            </div>

            <div className="form-field">
              <label className="form-field__label" htmlFor="endereco">
                Endereço completo
              </label>
              <input
                className="form-field__input"
                id="endereco"
                name="endereco"
                type="text"
                placeholder="Rua, número, bairro e cidade - UF"
                value={valores.endereco}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={mostrarErro("endereco")}
                aria-describedby={
                  mostrarErro("endereco") ? "erro-endereco" : undefined
                }
              />
              {mostrarErro("endereco") && (
                <p id="erro-endereco" className="form-field__error">
                  {erros.endereco}
                </p>
              )}
            </div>

            <div className="form-field">
              <label className="form-field__label" htmlFor="status">
                Status de credenciamento
              </label>
              <select
                className="form-field__input"
                id="status"
                name="status"
                value={valores.status}
                onChange={handleChange}
              >
                <option value="pendente">Pendente de aprovação</option>
                <option value="aprovada">Aprovada / Credenciada</option>
                <option value="inativa">Inativa</option>
              </select>
            </div>

            <div className="form-field">
              <label className="form-field__label" htmlFor="observacoes">
                Observações sobre a parceria
              </label>
              <textarea
                className="form-field__input form-field__input--textarea"
                id="observacoes"
                name="observacoes"
                rows="3"
                maxLength={LIMITE_OBSERVACOES}
                placeholder="Informações adicionais sobre turmas, horários ou demandas específicas da instituição..."
                value={valores.observacoes}
                onChange={handleChange}
              />
              <div className="form-field__meta">
                <span className="form-field__hint">
                  {valores.observacoes.length}/{LIMITE_OBSERVACOES} caracteres
                </span>
              </div>
            </div>

            {modoEdicao && (
              <div className="escola-form__status">
                <label className="switch">
                  <input
                    className="switch__input"
                    type="checkbox"
                    name="ativa"
                    checked={valores.ativa}
                    onChange={handleChange}
                  />
                  <span className="switch__track" aria-hidden="true"></span>
                  <span className="switch__label">
                    {valores.ativa ? "Escola ativa" : "Escola inativa"}
                  </span>
                </label>
                <p className="form-field__hint">
                  Inativar a escola preserva o histórico da instituição e de seus
                  alunos no sistema, podendo ser reativada a qualquer momento.
                </p>
              </div>
            )}

            {erroEnvio && (
              <p className="form-banner" role="alert">
                {erroEnvio}
              </p>
            )}

            <div className="escola-form__actions">
              <button
                type="submit"
                className="btn-pill btn-pill--blue"
                disabled={salvando}
              >
                {salvando
                  ? "Salvando..."
                  : modoEdicao
                    ? "Salvar alterações"
                    : "Cadastrar escola"}
              </button>
              <Link
                to={modoEdicao ? `/escolas/${id}` : "/escolas"}
                className="btn-pill btn-pill--outline-dark"
              >
                Cancelar
              </Link>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default EscolaForm;
