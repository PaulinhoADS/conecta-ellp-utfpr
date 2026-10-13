// src/App.jsx

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Quiz from './pages/Quiz';
import Login from './pages/Login';
import Header from './components/Header';
import Footer from './components/Footer';

// Componente principal do aplicativo
function App() {
  return (
    <BrowserRouter>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/login" element={<Login />} />
          </Routes>
          <Footer />
        </main>
    </BrowserRouter>
  );
}

export default App;