// frontend/src/pages/Quiz.jsx
import { useState } from 'react';
import './Quiz.css';

const perguntas = [
  {
    id: 'idade',
    enunciado: 'Qual é a sua idade?',
    opcoes: [
      { texto: '9 anos ou menos', valor: 9 },
      { texto: '10 ou 11 anos', valor: 10 },
      { texto: '12 anos', valor: 12 },
      { texto: '13 anos ou mais', valor: 13 },
    ],
  },
  {
    id: 'interesse',
    enunciado: 'O que mais chama a sua atenção quando você pensa em tecnologia?',
    opcoes: [
      { texto: 'Montar peças, robôs e mexer com fios/luzes', valor: 'hardware' },
      { texto: 'Criar mundos, personagens e jogar', valor: 'jogos' },
      { texto: 'Criar sites, aplicativos e entender como a internet funciona', valor: 'software' },
      { texto: 'Desenhar objetos e planejar projetos visuais', valor: 'design' },
    ],
  },
  {
    id: 'estilo',
    enunciado: 'Como você prefere aprender e resolver problemas?',
    opcoes: [
      { texto: 'Seguindo a lógica, regras estritas e digitando códigos', valor: 'logica' },
      { texto: 'De forma visual, arrastando blocos e desenhando', valor: 'visual' },
      { texto: 'Construindo coisas com as próprias mãos', valor: 'pratico' },
    ],
  },
];

const Quiz = () => {
  const [respostas, setRespostas] = useState({});
  const [resultado, setResultado] = useState('');

  const totalRespondidas = Object.keys(respostas).length;
  const todasRespondidas = totalRespondidas === perguntas.length;

  const selecionarOpcao = (idPergunta, valor) => {
    setRespostas((atual) => ({ ...atual, [idPergunta]: valor }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!todasRespondidas) return;

    const { idade, interesse, estilo } = respostas;
    let oficinaRecomendada = '';

    // LÓGICA DE RECOMENDAÇÃO BASEADA EM IDADE E PERFIL (ÁRVORE DE DECISÃO)
    if (interesse === 'hardware' || estilo === 'pratico') {
      if (idade >= 10) {
        oficinaRecomendada = 'Robótica com Arduino (Idade: 10+)';
      } else {
        oficinaRecomendada = 'Robótica LEGO (Livre)';
      }
    } else if (interesse === 'software') {
      if (idade >= 13) {
        oficinaRecomendada = 'Fábrica de Sites (Idade: 13+)';
      } else {
        oficinaRecomendada = 'Informática Básica / App Inventor (Livre)';
      }
    } else if (interesse === 'design' || (interesse === 'jogos' && estilo === 'visual')) {
      if (idade >= 12) {
        oficinaRecomendada = 'Modelagem 3D (Idade: 12+)';
      } else {
        oficinaRecomendada = 'Desenvolvimento de Jogos (Livre)';
      }
    } else {
      // Fallback genérico para quem curte lógica e games
      oficinaRecomendada = 'Desenvolvimento de Jogos (Livre)';
    }

    setResultado(`Oficina Recomendada: ${oficinaRecomendada}`);
  };

  const reiniciar = () => {
    setRespostas({});
    setResultado('');
  };

  return (
    <section className="quiz-page">
      <div className="quiz-card">
        <div className="quiz-card__header">Quiz Perfil Tech</div>

        <div className="quiz-card__body">
          {!resultado ? (
            <form className="quiz-form" onSubmit={handleSubmit}>
              <h1 className="quiz-card__title">Descubra a sua oficina</h1>

              <div className="quiz-progress">
                <progress
                  className="quiz-progress__bar"
                  value={totalRespondidas}
                  max={perguntas.length}
                ></progress>
                <span className="quiz-progress__text">
                  {totalRespondidas} de {perguntas.length} respondidas
                </span>
              </div>

              {perguntas.map((pergunta, index) => (
                <fieldset key={pergunta.id} className="quiz-question">
                  <legend className="quiz-question__legend">
                    <span className="quiz-question__number">{index + 1}</span>
                    {pergunta.enunciado}
                  </legend>

                  <div className="quiz-question__options">
                    {pergunta.opcoes.map((opcao) => (
                      <label key={opcao.texto} className="quiz-option">
                        <input
                          className="quiz-option__input"
                          type="radio"
                          name={pergunta.id}
                          checked={respostas[pergunta.id] === opcao.valor}
                          onChange={() => selecionarOpcao(pergunta.id, opcao.valor)}
                        />
                        <span className="quiz-option__label">{opcao.texto}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              ))}

              <button
                type="submit"
                className="btn-pill btn-pill--blue quiz-form__submit"
                disabled={!todasRespondidas}
              >
                Ver resultado
              </button>
            </form>
          ) : (
            <div className="quiz-result">
              <h2 className="quiz-result__title">Resultado do Quiz</h2>
              <p className="quiz-result__text">{resultado}</p>
              <button type="button" className="btn-pill btn-pill--orange" onClick={reiniciar}>
                Refazer o quiz
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Quiz;