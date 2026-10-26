// src/pages/Home.jsx
import { Link } from 'react-router-dom';
import './Home.css';

const oficinas = [
  {
    id: 'robotica-lego',
    numero: '01',
    titulo: 'Robótica LEGO',
    descricao: 'Utiliza kits LEGO Mindstorms para ensinar conceitos de física, engenharia e programação de forma lúdica.',
    publico: 'Para todas as idades. Construa e programe robôs interativos.',
  },
  {
    id: 'robotica-arduino',
    numero: '02',
    titulo: 'Robótica com Arduino',
    descricao: 'Foco em eletrônica básica e automação. Programe placas digitais conectando sensores, luzes e motores.',
    publico: 'A partir de 10 anos. Para quem gosta de criar circuitos e automações.',
  },
  {
    id: 'modelagem-3d',
    numero: '03',
    titulo: 'Modelagem 3D',
    descricao: 'Desenvolve a percepção espacial através da criação de objetos digitais tridimensionais.',
    publico: 'A partir de 12 anos. Simula a base para design e engenharia.',
  },
  {
    id: 'fabrica-sites',
    numero: '04',
    titulo: 'Fábrica de Sites',
    descricao: 'Introdução ao desenvolvimento web. Estruture e crie suas próprias páginas e portfólios na internet.',
    publico: 'A partir de 13 anos. Para quem quer dominar HTML, CSS e criar na web.',
  },
  {
    id: 'desenvolvimento-jogos',
    numero: '05',
    titulo: 'Desenvolvimento de Jogos',
    descricao: 'Criação de games, ensinando a lógica de programação por trás das mecânicas, personagens e cenários.',
    publico: 'Para todas as idades. Ideal para mentes criativas e lógicas.',
  }
];

const passosQuiz = [
  'Responda a perguntas rápidas sobre o seu perfil.',
  'Receba a oficina mais indicada para você.',
  'Seja encaminhado para uma turma com vagas disponíveis.',
];

const Home = () => {
  return (
    <>
      <section className="home-hero">
        <div className="home-hero__bubbles" aria-hidden="true">
          <span className="home-hero__bubble home-hero__bubble--1"></span>
          <span className="home-hero__bubble home-hero__bubble--2"></span>
          <span className="home-hero__bubble home-hero__bubble--3"></span>
          <span className="home-hero__bubble home-hero__bubble--4"></span>
          <span className="home-hero__bubble home-hero__bubble--5"></span>
          <span className="home-hero__bubble home-hero__bubble--6"></span>
        </div>

        <div className="my-container home-hero__content">
          <h1 className="home-hero__title">Bem-vindo ao Conecta ELLP</h1>
          <p className="home-hero__subtitle">
            A ponte digital entre a UTFPR e as Escolas da Comunidade.
          </p>
          <div className="home-hero__actions">
            <Link to="/quiz" className="btn-pill btn-pill--white">
              Fazer o Quiz Perfil Tech
            </Link>
            <a href="#oficinas" className="btn-pill btn-pill--outline">
              Conhecer as oficinas
            </a>
          </div>
        </div>

        <svg
          className="home-hero__wave"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M0,64 C240,120 480,0 720,48 C960,96 1200,120 1440,40 L1440,120 L0,120 Z" />
        </svg>
      </section>

      <section id="oficinas" className="home-oficinas">
        <div className="my-container">
          <h2 className="title">Nossas oficinas</h2>
          <p className="home-oficinas__intro">
            Cada oficina nasce de um jeito diferente de aprender tecnologia. Descubra qual combina
            mais com você.
          </p>

          <ul className="home-oficinas__grid">
            {oficinas.map((oficina) => (
              <li key={oficina.id} className="oficina-card">
                <span className="oficina-card__number">{oficina.numero}</span>
                <h3 className="oficina-card__title">{oficina.titulo}</h3>
                <p className="oficina-card__description">{oficina.descricao}</p>
                <p className="oficina-card__target">{oficina.publico}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="quiz" className="home-quiz">
        <div className="my-container">
          <div className="quiz-panel">
            <div className="quiz-panel__header">Quiz Perfil Tech</div>
            <div className="quiz-panel__body">
              <div className="quiz-panel__intro">
                <h2 className="quiz-panel__title">É aluno novo?</h2>
                <p className="quiz-panel__text">Descubra a oficina ideal para o seu perfil!</p>
                <Link to="/quiz" className="btn-pill btn-pill--orange">
                  Fazer o Quiz Perfil Tech
                </Link>
              </div>

              <ol className="quiz-panel__steps">
                {passosQuiz.map((passo, index) => (
                  <li key={passo} className="quiz-panel__step">
                    <span className="quiz-panel__step-number">{index + 1}</span>
                    <span className="quiz-panel__step-text">{passo}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;