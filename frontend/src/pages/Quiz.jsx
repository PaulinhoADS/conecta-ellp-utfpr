// frontend/src/pages/Quiz.jsx
import { useState } from 'react';
import './Quiz.css';

const perguntas = [
  {
    id: 'quebra-cabecas',
    enunciado: 'Você prefere resolver quebra-cabeças matemáticos ou desenhar personagens?',
    opcoes: [
      { texto: 'Resolver quebra-cabeças matemáticos', valor: 1 },
      { texto: 'Desenhar personagens', valor: 0 },
    ],
  },
  {
    id: 'brinquedo-quebrado',
    enunciado:
      'Quando um brinquedo quebra, você tenta entender as engrenagens ou foca em deixá-lo bonito de novo?',
    opcoes: [
      { texto: 'Tento entender as engrenagens', valor: 1 },
      { texto: 'Foco em deixá-lo bonito de novo', valor: 0 },
    ],
  },
  {
    id: 'regras-ou-liberdade',
    enunciado:
      'Você gosta de seguir regras estritas para chegar a um resultado ou prefere ter liberdade criativa?',
    opcoes: [
      { texto: 'Seguir regras estritas para chegar a um resultado', valor: 1 },
      { texto: 'Ter liberdade criativa', valor: 0 },
    ],
  },
];

const PONTOS_MINIMOS_LOGICA = 2;

const resultados = {
  logica: 'Oficina Recomendada: Lógica de Programação e Algoritmos (Python)',
  visual: 'Oficina Recomendada: Criação de Jogos e Web (Scratch / HTML)',
};

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

    if (!todasRespondidas) {
      return;
    }

    const pontosLogica = Object.values(respostas).reduce((soma, valor) => soma + valor, 0);

    setResultado(pontosLogica >= PONTOS_MINIMOS_LOGICA ? resultados.logica : resultados.visual);
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