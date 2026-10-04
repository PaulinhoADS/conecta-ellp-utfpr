
// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';

// Componente gerenciador de rotas
// Higor deixando a base pronta, depois o Victor vem conectando o resto das telas
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Futuras rotas vão entrar aqui (ex: /quiz, /login, /dashboard) */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;