import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getOficinas } from "../../services/oficinasService";
import "./OficinasList.css";

const OficinasList = () => {
  const [oficinas, setOficinas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [exibirInativas, setExibirInativas] = useState(false);

  useEffect(() => {
    let ativo = true;

    getOficinas()
      .then((dados) => {
        if (ativo) {
          setOficinas(dados);
          setCarregando(false);
        }
      })
      .catch(() => {
        if (ativo) {
          setErro("Não foi possível carregar as oficinas.");
          setCarregando(false);
        }
      });

    return () => {
      ativo = false;
    };
  }, []);

  const totalInativas = oficinas.filter((oficina) => !oficina.ativa).length;
  const oficinasVisiveis = exibirInativas
    ? oficinas
    : oficinas.filter((oficina) => oficina.ativa);

  return (
    <section className="page-gradient">
      <div className="my-container">
        <div className="oficinas-page__header">
          <div>
            <h1 className="oficinas-page__title">Oficinas</h1>
            <p className="oficinas-page__subtitle">
              Conheça as oficinas do projeto ELLP.
            </p>
          </div>
          <Link to="/oficinas/nova" className="btn-pill btn-pill--orange">
            Nova oficina
          </Link>
        </div>

        {carregando && (
          <p className="state-message state-message--on-dark">
            Carregando oficinas...
          </p>
        )}

        {!carregando && erro && (
          <p className="state-message state-message--on-dark" role="alert">
            {erro}
          </p>
        )}

        {!carregando && !erro && (
          <>
            <div className="oficinas-toolbar">
              <label className="oficinas-filter">
                <input
                  className="oficinas-filter__input"
                  type="checkbox"
                  checked={exibirInativas}
                  onChange={(e) => setExibirInativas(e.target.checked)}
                />
                <span>
                  Exibir oficinas inativas
                  {totalInativas > 0 ? ` (${totalInativas})` : ""}
                </span>
              </label>
              <span className="oficinas-toolbar__count">
                {oficinasVisiveis.length}{" "}
                {oficinasVisiveis.length === 1 ? "oficina" : "oficinas"}
              </span>
            </div>

            {oficinasVisiveis.length === 0 ? (
              <div className="oficinas-empty">
                <p className="state-message state-message--on-dark">
                  Nenhuma oficina para exibir.
                </p>
                <Link to="/oficinas/nova" className="btn-pill btn-pill--white">
                  Cadastrar a primeira oficina
                </Link>
              </div>
            ) : (
              <ul className="oficinas-grid">
                {oficinasVisiveis.map((oficina) => (
                  <li
                    key={oficina.id}
                    className={
                      oficina.ativa
                        ? "oficina-item"
                        : "oficina-item oficina-item--inativa"
                    }
                  >
                    <div className="oficina-item__top">
                      <span className="oficina-item__id">
                        #{String(oficina.id).padStart(2, "0")}
                      </span>
                      <span
                        className={
                          oficina.ativa
                            ? "badge badge--ativa"
                            : "badge badge--inativa"
                        }
                      >
                        {oficina.ativa ? "Ativa" : "Inativa"}
                      </span>
                    </div>

                    <h2 className="oficina-item__title">{oficina.nome}</h2>
                    <p className="oficina-item__theme">{oficina.tema}</p>
                    <p className="oficina-item__description">
                      {oficina.descricao}
                    </p>
                    <p className="oficina-item__vagas">
                      {oficina.vagas} {oficina.vagas === 1 ? "vaga" : "vagas"}
                    </p>

                    <div className="oficina-item__actions">
                      <Link
                        to={`/oficinas/${oficina.id}`}
                        className="btn-pill btn-pill--blue btn-pill--small"
                      >
                        Ver detalhes
                      </Link>
                      <Link
                        to={`/oficinas/${oficina.id}/editar`}
                        className="btn-pill btn-pill--outline-dark btn-pill--small"
                      >
                        Editar
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default OficinasList;
