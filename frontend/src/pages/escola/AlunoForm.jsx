import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getAlunoById, updateAluno } from "../../services/alunosService";
import { getEscolaById } from "../../services/escolasService";
import { useAuth } from "../../contexts/AuthContext";
import "./AlunoForm.css";

const OFICINAS_RECOMENDADAS = [
  "Aguardando Quiz Perfil Tech",
  "Robótica LEGO",
  "Robótica com Arduino",
  "Modelagem 3D",
  "Fábrica de Sites",
  "Desenvolvimento de Jogos",
];

const valoresIniciais = {
  nome: "",
  username: "",
  idade: "",
  perfilLologico: "Aguardando Quiz Perfil Tech",
};

const validar = (valores) => {
  const erros = {};
  const idade = Number(valores.idade);

  if (!valores.nome.trim()) {
    erros.nome = "Informe o nome completo do estudante.";
  }
  if (!valores.username.trim()) {
    erros.username = "Informe o nome de usuário (username).";
  }
  if (
    valores.idade === "" ||
    !Number.isInteger(idade) ||
    idade < 6 ||
    idade > 25
  ) {
    erros.idade = "Informe uma idade inteira válida (entre 6 e 25 anos).";
  }

  return erros;
};

const AlunoForm = () => {
  const { escolaId, id } = useParams();
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const podeAlterarOficina = hasRole(["admin", "superadmin", "escola"]);

  const [valores, setValores] = useState(valoresIniciais);
  const [nomeEscola, setNomeEscola] = useState("");
  const [tocados, setTocados] = useState({});
  const [submetido, setSubmetido] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erroCarga, setErroCarga] = useState("");
  const [erroEnvio, setErroEnvio] = useState("");

  useEffect(() => {
    let ativo = true;

    Promise.all([getAlunoById(id), getEscolaById(escolaId)])
      .then(([dadosAluno, dadosEscola]) => {
        if (!ativo) return;

        if (Number(dadosAluno.escolaId) !== Number(escolaId)) {
          setErroCarga("Este estudante não pertence à escola informada.");
          setCarregando(false);
          return;
        }

        setValores({
          nome: dadosAluno.nome ?? "",
          username: dadosAluno.username ?? "",
          idade:
            dadosAluno.idade !== undefined ? String(dadosAluno.idade) : "",
          perfilLologico:
            dadosAluno.perfilLologico ?? "Aguardando Quiz Perfil Tech",
        });
        setNomeEscola(dadosEscola.nome ?? "");
        setErroCarga("");
        setCarregando(false);
      })
      .catch(() => {
        if (ativo) {
          setErroCarga("Não foi possível carregar os dados do estudante.");
          setCarregando(false);
        }
      });

    return () => {
      ativo = false;
    };
  }, [escolaId, id]);

  const erros = validar(valores);
  const mostrarErro = (campo) =>
    Boolean((tocados[campo] || submetido) && erros[campo]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "username") {
      setValores((atual) => ({
        ...atual,
        username: value.toLowerCase().replace(/\s+/g, ""),
      }));
      return;
    }

    setValores((atual) => ({
      ...atual,
      [name]: value,
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

    try {
      setSalvando(true);
      await updateAluno(escolaId, id, {
        nome: valores.nome.trim(),
        username: valores.username.trim(),
        idade: Number(valores.idade),
        perfilLologico: valores.perfilLologico,
      });
      navigate(`/escolas/${escolaId}/alunos/${id}`);
    } catch (erroReq) {
      if (erroReq?.response?.status === 409) {
        setErroEnvio(
          "Este nome de usuário já está em uso por outro estudante.",
        );
      } else {
        setErroEnvio(
          "Não foi possível salvar as alterações. Tente novamente.",
        );
      }
      setSalvando(false);
    }
  };

  if (carregando) {
    return (
      <section className="page-gradient">
        <div className="panel panel--wide">
          <div className="panel__body">
            <p className="state-message">Carregando dados do estudante...</p>
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
            <div className="aluno-form__actions aluno-form__actions--center">
              <Link
                to={`/escolas/${escolaId}`}
                className="btn-pill btn-pill--blue"
              >
                Voltar para a escola
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
        <div className="panel__header">Editar informações do estudante</div>
        <div className="panel__body">
          <h1 className="panel__title">Atualizar cadastro</h1>
          <p className="panel__subtitle">
            {nomeEscola
              ? `Estudante vinculado à instituição ${nomeEscola}.`
              : "Atualize as informações cadastrais e credenciais de acesso do estudante."}
          </p>

          <form className="aluno-form" onSubmit={handleSubmit} noValidate>
            <div className="form-field">
              <label className="form-field__label" htmlFor="nome">
                Nome completo
              </label>
              <input
                className="form-field__input"
                id="nome"
                name="nome"
                type="text"
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

            <div className="aluno-form__row">
              <div className="form-field">
                <label className="form-field__label" htmlFor="username">
                  Nome de usuário (username)
                </label>
                <input
                  className="form-field__input"
                  id="username"
                  name="username"
                  type="text"
                  value={valores.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={mostrarErro("username")}
                  aria-describedby={
                    mostrarErro("username") ? "erro-username" : undefined
                  }
                />
                {mostrarErro("username") && (
                  <p id="erro-username" className="form-field__error">
                    {erros.username}
                  </p>
                )}
              </div>

              <div className="form-field">
                <label className="form-field__label" htmlFor="idade">
                  Idade
                </label>
                <input
                  className="form-field__input"
                  id="idade"
                  name="idade"
                  type="number"
                  min="6"
                  max="25"
                  value={valores.idade}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={mostrarErro("idade")}
                  aria-describedby={
                    mostrarErro("idade") ? "erro-idade" : undefined
                  }
                />
                {mostrarErro("idade") && (
                  <p id="erro-idade" className="form-field__error">
                    {erros.idade}
                  </p>
                )}
              </div>
            </div>

            <div className="form-field">
              <label className="form-field__label" htmlFor="perfilLologico">
                Oficina recomendada (Quiz Perfil Tech)
              </label>
              <select
                className="form-field__input"
                id="perfilLologico"
                name="perfilLologico"
                value={valores.perfilLologico}
                onChange={handleChange}
                disabled={!podeAlterarOficina}
              >
                {OFICINAS_RECOMENDADAS.map((oficina) => (
                  <option key={oficina} value={oficina}>
                    {oficina}
                  </option>
                ))}
              </select>
              {!podeAlterarOficina && (
                <p className="form-field__hint">
                  A oficina recomendada é atualizada automaticamente ao realizar
                  o Quiz Perfil Tech.
                </p>
              )}
            </div>

            {erroEnvio && (
              <p className="form-banner" role="alert">
                {erroEnvio}
              </p>
            )}

            <div className="aluno-form__actions">
              <button
                type="submit"
                className="btn-pill btn-pill--blue"
                disabled={salvando}
              >
                {salvando ? "Salvando..." : "Salvar alterações"}
              </button>
              <Link
                to={`/escolas/${escolaId}/alunos/${id}`}
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

export default AlunoForm;
