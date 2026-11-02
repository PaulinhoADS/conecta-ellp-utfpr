import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  updateOficina,
  getOficinaById,
  createOficina,
} from "../../services/oficinasService";
import "./OficinaForm.css";

const LIMITE_DESCRICAO = 500;

const formularioInicial = {
  nome: "",
  tema: "",
  vagas: "",
  descricao: "",
  ativa: true,
};

const validar = (valores) => {
  const erros = {};
  const vagas = Number(valores.vagas);

  if (!valores.nome.trim()) {
    erros.nome = "Informe o nome da oficina.";
  }
  if (!valores.tema.trim()) {
    erros.tema = "Informe o tema da oficina.";
  }
  if (valores.vagas === "" || !Number.isInteger(vagas) || vagas < 1) {
    erros.vagas = "Informe um número inteiro de vagas maior que zero.";
  }
  if (!valores.descricao.trim()) {
    erros.descricao = "Informe a descrição da oficina.";
  }

  return erros;
};

const OficinaForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const modoEdicao = Boolean(id);

  const [valores, setValores] = useState(formularioInicial);
  const [erros, setErros] = useState({});
  const [carregando, setCarregando] = useState(modoEdicao);
  const [erroCarregamento, setErroCarregamento] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [erroEnvio, setErroEnvio] = useState("");

  useEffect(() => {
    setErros({});
    setErroEnvio("");
    setErroCarregamento("");

    if (!modoEdicao) {
      setValores(formularioInicial);
      setCarregando(false);
      return undefined;
    }

    let ativo = true;
    setCarregando(true);

    getOficinaById(id)
      .then((oficina) => {
        if (ativo) {
          setValores({
            nome: oficina.nome,
            tema: oficina.tema,
            vagas: String(oficina.vagas),
            descricao: oficina.descricao,
            ativa: oficina.ativa,
          });
          setCarregando(false);
        }
      })
      .catch((erroRequisicao) => {
        if (ativo) {
          setErroCarregamento(
            erroRequisicao.response?.status === 404
              ? "Oficina não encontrada."
              : "Não foi possível carregar a oficina.",
          );
          setCarregando(false);
        }
      });

    return () => {
      ativo = false;
    };
  }, [id, modoEdicao]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setValores((atual) => ({
      ...atual,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErros((atual) => ({ ...atual, [name]: undefined }));
  };

  const propsErro = (campo) => ({
    "aria-invalid": Boolean(erros[campo]),
    "aria-describedby": erros[campo] ? `${campo}-erro` : undefined,
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    const errosEncontrados = validar(valores);
    setErros(errosEncontrados);

    if (Object.keys(errosEncontrados).length > 0) {
      return;
    }

    setSalvando(true);
    setErroEnvio("");

    const dados = {
      nome: valores.nome.trim(),
      tema: valores.tema.trim(),
      vagas: Number(valores.vagas),
      descricao: valores.descricao.trim(),
      ativa: valores.ativa,
    };

    try {
      const salva = modoEdicao
        ? await updateOficina(id, dados)
        : await createOficina(dados);
      navigate(`/oficinas/${salva.id}`);
    } catch (erroRequisicao) {
      setErroEnvio(
        erroRequisicao.response?.status === 404
          ? "Oficina não encontrada."
          : "Não foi possível salvar a oficina. Tente novamente.",
      );
      setSalvando(false);
    }
  };

  if (carregando) {
    return (
      <section className="page-gradient">
        <div className="panel">
          <div className="panel__body">
            <p className="state-message">Carregando oficina...</p>
          </div>
        </div>
      </section>
    );
  }

  if (erroCarregamento) {
    return (
      <section className="page-gradient">
        <div className="panel">
          <div className="panel__body">
            <p className="state-message" role="alert">
              {erroCarregamento}
            </p>
            <div className="oficina-form__actions oficina-form__actions--center">
              <Link to="/oficinas" className="btn-pill btn-pill--blue">
                Voltar para as oficinas
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="page-gradient">
      <div className="panel">
        <div className="panel__header">
          {modoEdicao ? "Editar oficina" : "Nova oficina"}
        </div>
        <div className="panel__body">
          <h1 className="panel__title">
            {modoEdicao ? "Editar oficina" : "Cadastrar oficina"}
          </h1>
          <p className="panel__subtitle">
            {modoEdicao
              ? "Atualize os dados ou desative a oficina."
              : "Preencha os dados para criar uma nova oficina."}
          </p>

          <form className="oficina-form" onSubmit={handleSubmit} noValidate>
            <div className="form-field">
              <label className="form-field__label" htmlFor="nome">
                Nome da oficina
              </label>
              <input
                className="form-field__input"
                id="nome"
                name="nome"
                type="text"
                maxLength={80}
                value={valores.nome}
                onChange={handleChange}
                {...propsErro("nome")}
              />
              {erros.nome && (
                <p className="form-field__error" id="nome-erro">
                  {erros.nome}
                </p>
              )}
            </div>

            <div className="form-field">
              <label className="form-field__label" htmlFor="tema">
                Tema
              </label>
              <input
                className="form-field__input"
                id="tema"
                name="tema"
                type="text"
                maxLength={80}
                value={valores.tema}
                onChange={handleChange}
                {...propsErro("tema")}
              />
              {erros.tema && (
                <p className="form-field__error" id="tema-erro">
                  {erros.tema}
                </p>
              )}
            </div>

            <div className="oficina-form__row">
              {modoEdicao && (
                <div className="form-field">
                  <label className="form-field__label" htmlFor="codigo">
                    Código
                  </label>
                  <input
                    className="form-field__input"
                    id="codigo"
                    type="text"
                    value={`#${String(id).padStart(2, "0")}`}
                    disabled
                  />
                </div>
              )}

              <div className="form-field">
                <label className="form-field__label" htmlFor="vagas">
                  Vagas
                </label>
                <input
                  className="form-field__input"
                  id="vagas"
                  name="vagas"
                  type="number"
                  inputMode="numeric"
                  min="1"
                  step="1"
                  value={valores.vagas}
                  onChange={handleChange}
                  {...propsErro("vagas")}
                />
                {erros.vagas && (
                  <p className="form-field__error" id="vagas-erro">
                    {erros.vagas}
                  </p>
                )}
              </div>
            </div>

            <div className="form-field">
              <label className="form-field__label" htmlFor="descricao">
                Descrição
              </label>
              <textarea
                className="form-field__input form-field__input--textarea"
                id="descricao"
                name="descricao"
                maxLength={LIMITE_DESCRICAO}
                value={valores.descricao}
                onChange={handleChange}
                {...propsErro("descricao")}
              ></textarea>
              <div className="form-field__meta">
                {erros.descricao ? (
                  <p className="form-field__error" id="descricao-erro">
                    {erros.descricao}
                  </p>
                ) : (
                  <span></span>
                )}
                <span className="form-field__hint">
                  {valores.descricao.length}/{LIMITE_DESCRICAO}
                </span>
              </div>
            </div>

            {modoEdicao && (
              <div className="oficina-form__status">
                <label className="switch" htmlFor="ativa">
                  <input
                    className="switch__input"
                    id="ativa"
                    name="ativa"
                    type="checkbox"
                    checked={valores.ativa}
                    onChange={handleChange}
                  />
                  <span className="switch__track" aria-hidden="true"></span>
                  <span className="switch__label">
                    {valores.ativa ? "Oficina ativa" : "Oficina inativa"}
                  </span>
                </label>
                <p className="form-field__hint">
                  Desativar mantém todos os dados da oficina no sistema. Você
                  pode reativá-la quando quiser.
                </p>
              </div>
            )}

            {erroEnvio && (
              <p className="form-banner" role="alert">
                {erroEnvio}
              </p>
            )}

            <div className="oficina-form__actions">
              <button
                type="submit"
                className="btn-pill btn-pill--blue"
                disabled={salvando}
              >
                {salvando
                  ? "Salvando..."
                  : modoEdicao
                    ? "Salvar alterações"
                    : "Cadastrar oficina"}
              </button>
              <Link
                to={modoEdicao ? `/oficinas/${id}` : "/oficinas"}
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

export default OficinaForm;
