import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getAlunoById } from "../../services/alunosService";
import { getEscolaById } from "../../services/escolasService";
import { useAuth } from "../../contexts/AuthContext";
import ModalRedefinirSenha from "../../components/modal-redefiinir-senha/ModalRedefinirSenha";
import "./AlunoDetalhe.css";

const AlunoDetalhe = () => {
  const { escolaId, id } = useParams();
  const { hasRole, user } = useAuth();

  const [aluno, setAluno] = useState(null);
  const [escola, setEscola] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [modalSenhaAberto, setModalSenhaAberto] = useState(false);

  const podeVoltarEscola = hasRole(["admin", "superadmin", "escola"]);
  const ehAlunoLogado = hasRole(["aluno"]);
  const podeRedefinirSenha =
    (ehAlunoLogado && String(user?.id) === String(id)) ||
    hasRole(["admin", "superadmin"]);

  useEffect(() => {
    let ativo = true;

    Promise.all([getAlunoById(id), getEscolaById(escolaId)])
      .then(([dadosAluno, dadosEscola]) => {
        if (!ativo) return;

        if (Number(dadosAluno.escolaId) !== Number(escolaId)) {
          setErro("Este estudante não pertence à escola informada.");
          setCarregando(false);
          return;
        }

        setAluno(dadosAluno);
        setEscola(dadosEscola);
        setErro("");
        setCarregando(false);
      })
      .catch(() => {
        if (ativo) {
          setErro("Não foi possível carregar os dados do estudante.");
          setCarregando(false);
        }
      });

    return () => {
      ativo = false;
    };
  }, [escolaId, id]);

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

  if (erro || !aluno) {
    return (
      <section className="page-gradient">
        <div className="panel panel--wide">
          <div className="panel__body">
            <p className="state-message" role="alert">
              {erro || "Estudante não encontrado."}
            </p>
            <div className="aluno-detail__actions aluno-detail__actions--center">
              {podeVoltarEscola ? (
                <Link
                  to={`/escolas/${escolaId}`}
                  className="btn-pill btn-pill--blue"
                >
                  Voltar para a escola
                </Link>
              ) : (
                <Link to="/" className="btn-pill btn-pill--blue">
                  Voltar ao início
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  const aguardandoQuiz =
    !aluno.perfilLologico ||
    aluno.perfilLologico === "Aguardando Quiz Perfil Tech";

  return (
    <section className="page-gradient">
      <article className="panel panel--wide">
        <div className="panel__header">Detalhes do estudante</div>
        <div className="panel__body">
          <div className="aluno-detail__top">
            <div>
              <div className="aluno-detail__badges">
                <span className="aluno-detail__code">
                  #{String(aluno.id).padStart(2, "0")}
                </span>
                <span
                  className={
                    aguardandoQuiz
                      ? "badge badge--pendente"
                      : "badge badge--ativa"
                  }
                >
                  {aguardandoQuiz ? "Quiz pendente" : "Perfil avaliado"}
                </span>
              </div>
              <h1 className="aluno-detail__title">{aluno.nome}</h1>
              <p className="aluno-detail__username">@{aluno.username}</p>
            </div>

            {podeRedefinirSenha && (
              <button
                type="button"
                className="btn-pill btn-pill--outline-dark btn-pill--small"
                onClick={() => setModalSenhaAberto(true)}
              >
                Redefinir senha
              </button>
            )}
          </div>

          <dl className="aluno-detail__facts">
            <div className="aluno-detail__fact">
              <dt className="aluno-detail__fact-label">Idade</dt>
              <dd className="aluno-detail__fact-value">{aluno.idade} anos</dd>
            </div>
            <div className="aluno-detail__fact">
              <dt className="aluno-detail__fact-label">Usuário de acesso</dt>
              <dd className="aluno-detail__fact-value aluno-detail__fact-value--sm">
                @{aluno.username}
              </dd>
            </div>
            <div className="aluno-detail__fact">
              <dt className="aluno-detail__fact-label">
                Oficina recomendada (Quiz)
              </dt>
              <dd className="aluno-detail__fact-value aluno-detail__fact-value--sm">
                {aluno.perfilLologico || "Aguardando Quiz Perfil Tech"}
              </dd>
            </div>
          </dl>

          {escola && (
            <div className="aluno-detail__school-box">
              <h2 className="aluno-detail__section-title">
                Instituição de ensino vinculada
              </h2>
              <p className="aluno-detail__school-name">{escola.nome}</p>
              <p className="aluno-detail__school-meta">
                {escola.endereco}
                {escola.responsavel
                  ? ` • Responsável: ${escola.responsavel}`
                  : ""}
              </p>
            </div>
          )}

          <div className="aluno-detail__actions">
            <Link
              to={`/escolas/${escolaId}/alunos/${aluno.id}/editar`}
              className="btn-pill btn-pill--blue"
            >
              Editar informações
            </Link>
            {ehAlunoLogado && (
              <Link to="/quiz" className="btn-pill btn-pill--orange">
                Fazer o Quiz Perfil Tech
              </Link>
            )}
            {podeVoltarEscola && (
              <Link
                to={`/escolas/${escolaId}`}
                className="btn-pill btn-pill--outline-dark"
              >
                Voltar para o painel da escola
              </Link>
            )}
          </div>
        </div>
      </article>

      <ModalRedefinirSenha
        aberto={modalSenhaAberto}
        onFechar={() => setModalSenhaAberto(false)}
      />
    </section>
  );
};

export default AlunoDetalhe;
