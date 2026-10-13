// src/pages/Home.jsx
import { Link } from 'react-router-dom';
import './Home.css';

const oficinas = [
  {
    id: 'programacao-visual',
    numero: '01',
    titulo: 'Programação Visual',
    descricao:
      'Monte soluções arrastando blocos e elementos visuais e veja o resultado ganhar vida na tela, sem precisar decorar comandos.',
    publico: 'Para quem gosta de criar, desenhar e ver resultado rápido.',
  },
  {
    id: 'logica-programacao',
    numero: '02',
    titulo: 'Lógica de Programação',
    descricao:
      'Exercite raciocínio, algoritmos e resolução de problemas. É a base que sustenta qualquer linguagem que você aprender depois.',
    publico: 'Para quem curte desafios, enigmas e quebra-cabeças.',
  },
  {
    id: 'desenvolvimento-web',
    numero: '03',
    titulo: 'Desenvolvimento Web',
    descricao:
      'Dê os primeiros passos construindo páginas com HTML, CSS e JavaScript e publique algo que qualquer pessoa pode acessar.',
    publico: 'Para quem quer construir sites e aplicativos.',
  },
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