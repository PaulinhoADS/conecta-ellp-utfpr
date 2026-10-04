// frontend/src/pages/Quiz.jsx
import React, { useState } from 'react';

const Quiz = () => {
  const [pontosLogica, setPontosLogica] = useState(0);
  const [etapa, setEtapa] = useState(1);
  const [resultado, setResultado] = useState('');

  // Carlos implementou aqui o Algoritmo de Árvore de Decisão Simples
  const responder = (valor) => {
    const novaPontuacao = pontosLogica + valor;
    setPontosLogica(novaPontuacao);
    
    if (etapa === 3) {
      // Lógica Booleana: Se pontuação >= 2, Lógica Pura (Python/C). Senão, Visual (Web/Scratch)
      if (novaPontuacao >= 2) {
        setResultado('Oficina Recomendada: Lógica de Programação e Algoritmos (Python)');
      } else {
        setResultado('Oficina Recomendada: Criação de Jogos e Web (Scratch / HTML)');
      }
    } else {
      setEtapa(etapa + 1);
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', backgroundColor: '#f4f7f6', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', maxWidth: '500px', width: '100%', textAlign: 'center' }}>
        <h2 style={{ color: '#2c3e50' }}>🧩 Quiz Perfil Tech</h2>
        
        {!resultado ? (
          <>
            <p style={{ color: '#7f8c8d', marginBottom: '30px' }}>Pergunta {etapa} de 3</p>
            {etapa === 1 && <p style={{ fontSize: '18px' }}>Você prefere resolver quebra-cabeças matemáticos ou desenhar personagens?</p>}
            {etapa === 2 && <p style={{ fontSize: '18px' }}>Quando um brinquedo quebra, você tenta entender as engrenagens ou foca em deixá-lo bonito de novo?</p>}
            {etapa === 3 && <p style={{ fontSize: '18px' }}>Você gosta de seguir regras estritas para chegar a um resultado ou prefere ter liberdade criativa?</p>}
            
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
              <button onClick={() => responder(1)} style={{ padding: '10px 20px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                Lógica e Engrenagens
              </button>
              <button onClick={() => responder(0)} style={{ padding: '10px 20px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                Criatividade e Visual
              </button>
            </div>
          </>
        ) : (
          <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#dff9fb', borderRadius: '8px', color: '#130f40' }}>
            <h3>Resultado do Algoritmo:</h3>
            <p style={{ fontWeight: 'bold', fontSize: '18px' }}>{resultado}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;