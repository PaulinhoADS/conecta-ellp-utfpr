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
import OficinaForm from "./pages/oficina/OficinaForm";
import OficinaDetalhe from "./pages/oficina/OficinaDetalhe";
import OficinasList from "./pages/oficina/OficinasList";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import AdminDashboard from "./pages/admin/AdminDashboard";
import VoluntariosPage from "./crud_voluntários/VoluntariosPage";

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
            <Route path="/oficinas" element={<OficinasList />} />
            <Route path="/oficinas/:id" element={<OficinaDetalhe />} />

            <Route
              element={
                <ProtectedRoute allowedRoles={["admin", "superadmin"]} />
              }
            >
              <Route path="/escolas/nova" element={<EscolaForm />} />
              <Route path="/escolas/:id/editar" element={<EscolaForm />} />

              <Route path="/oficinas/nova" element={<OficinaForm />} />
              <Route path="/oficinas/:id/editar" element={<OficinaForm />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>
            <Route path="/voluntarios/*" element={<VoluntariosPage />} />
          </Routes>
        </main>
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
