// src/App.jsx

import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthProvider from "./contexts/AuthContext";
import Home from "./pages/Home";
import Quiz from "./pages/Quiz";
import Login from "./pages/Login";
import Unauthorized from "./pages/Unauthorized";
import EscolasList from "./pages/escola/EscolasList";
import EscolaDetalhe from "./pages/escola/EscolaDetalhe";
import EscolaForm from "./pages/escola/EscolaForm";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

// Componente principal do aplicativo
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/escolas" element={<EscolasList />} />
            <Route path="/escolas/:id" element={<EscolaDetalhe />} />

            <Route
              element={
                <ProtectedRoute allowedRoles={["admin", "superadmin"]} />
              }
            >
              <Route path="/escolas/nova" element={<EscolaForm />} />
              <Route path="/escolas/:id/editar" element={<EscolaForm />} />
            </Route>
          </Routes>
          <Footer />
        </main>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
