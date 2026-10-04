// src/pages/Home.jsx
import React from 'react';

const Home = () => {
  return (
    <div style={{ textAlign: 'center', padding: '50px', fontFamily: 'sans-serif' }}>
      <h1>Bem-vindo ao Conecta ELLP</h1>
      <p>A ponte digital entre a UTFPR e as Escolas da Comunidade.</p>
      
      {/* Aqui depois vamos colocar o componente com CSS, por enquanto é só o esqueleto */}
      <div style={{ marginTop: '30px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>É aluno novo?</h2>
        <p>Descubra a oficina ideal para o seu perfil!</p>
        <button style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}>
          Fazer o Quiz Perfil Tech
        </button>
      </div>
    </div>
  );
};

export default Home;