import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getOficinaById } from '../services/oficinasService';
import './OficinaDetalhe.css';

const OficinaDetalhe = () => {
  const { id } = useParams();
  const [oficina, setOficina] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    let ativo = true;
    setCarregando(true);
    setErro('');

    getOficinaById(id)
      .then((dados) => {
        if (!ativo) {
          return;
        }
        if (dados) {
          setOficina(dados);
        } else {
          setErro('Oficina não encontrada.');
        }
        setCarregando(false);
      })
      .catch(() => {
        if (ativo) {
          setErro('Não foi possível carregar a oficina.');
          setCarregando(false);
        }
      });

    return () => {
      ativo = false;
    };
  }, [id]);

  if (carregando) {
    return (
      <section className="page-gradient">
        <div className="panel panel--wide">
          <div className="panel__body">
            <p className="state-message">Carregando oficina...</p>
          </div>
        </div>
      </section>
    );
  }

  if (erro) {
    return (
      <section className="page-gradient">
        <div className="panel panel--wide">
          <div className="panel__body">
            <p className="state-message" role="alert">
              {erro}
            </p>
            <div className="oficina-detail__actions oficina-detail__actions--center">
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
      <article className="panel panel--wide">
        <div className="panel__header">Detalhes da oficina</div>
        <div className="panel__body">
          <div className="oficina-detail__top">
            <h1 className="oficina-detail__title">{oficina.nome}</h1>
            <span className={oficina.ativa ? 'badge badge--ativa' : 'badge badge--inativa'}>
              {oficina.ativa ? 'Ativa' : 'Inativa'}
            </span>
          </div>
          <p className="oficina-detail__theme">{oficina.tema}</p>

          <dl className="oficina-detail__facts">
            <div className="oficina-detail__fact">
              <dt className="oficina-detail__fact-label">Código</dt>
              <dd className="oficina-detail__fact-value">#{String(oficina.id).padStart(2, '0')}</dd>
            </div>
            <div className="oficina-detail__fact">
              <dt className="oficina-detail__fact-label">Vagas</dt>
              <dd className="oficina-detail__fact-value">{oficina.vagas}</dd>
            </div>
          </dl>

          <h2 className="oficina-detail__section-title">Sobre a oficina</h2>
          <p className="oficina-detail__description">{oficina.descricao}</p>

          <div className="oficina-detail__actions">
            <Link to={`/oficinas/${oficina.id}/editar`} className="btn-pill btn-pill--blue">
              Editar oficina
            </Link>
            <Link to="/oficinas" className="btn-pill btn-pill--outline-dark">
              Voltar para a lista
            </Link>
          </div>
        </div>
      </article>
    </section>
  );
};

export default OficinaDetalhe;