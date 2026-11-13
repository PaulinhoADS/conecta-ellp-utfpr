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
import AlunoDetalhe from "./pages/escola/AlunoDetalhe";
import AlunoForm from "./pages/escola/AlunoForm";
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
            {/* Rotas públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/oficinas" element={<OficinasList />} />
            <Route path="/oficinas/:id" element={<OficinaDetalhe />} />

            {/* Rotas para admin, superadmin e pela própria escola dona do id */}
            <Route
              element={
                <ProtectedRoute
                  allowedRoles={["admin", "superadmin", "escola"]}
                  verifySchoolOwnership={true}
                />
              }
            >
              <Route path="/escolas/:id" element={<EscolaDetalhe />} />
              <Route path="/escolas/:id/editar" element={<EscolaForm />} />
            </Route>

            {/* Rotas para admin, superadmin, pela escola dona do aluno ou pelo próprio aluno da rota */}
            <Route
              element={
                <ProtectedRoute
                  allowedRoles={["admin", "superadmin", "escola", "aluno"]}
                  verifyStudentOwnership={true}
                />
              }
            >
              <Route
                path="/escolas/:escolaId/alunos/:id"
                element={<AlunoDetalhe />}
              />
              <Route
                path="/escolas/:escolaId/alunos/:id/editar"
                element={<AlunoForm />}
              />
            </Route>

            {/* Rotas para admin e superadmin */}
            <Route
              element={
                <ProtectedRoute allowedRoles={["admin", "superadmin"]} />
              }
            >
              <Route path="/escolas" element={<EscolasList />} />
              <Route path="/escolas/nova" element={<EscolaForm />} />
              <Route path="/oficinas/nova" element={<OficinaForm />} />
              <Route path="/oficinas/:id/editar" element={<OficinaForm />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/administradores" element={null} />
              <Route path="/voluntarios/*" element={<VoluntariosPage />} />
            </Route>

            {/* Rotas para superadmin */}
            <Route element={<ProtectedRoute allowedRoles={["superadmin"]} />}>
              <Route path="/administradores/novo" element={null} />
            </Route>

            {/* Rotas para superadmin ou pelo admin dono do id */}
            <Route
              element={
                <ProtectedRoute
                  allowedRoles={["superadmin", "admin"]}
                  verifyAdminOwnership={true}
                />
              }
            >
              <Route path="/administradores/:id" element={null} />
              <Route path="/administradores/:id/editar" element={null} />
            </Route>

            {/* Rotas para alunos */}
            <Route element={<ProtectedRoute allowedRoles={["aluno"]} />}>
              <Route path="/quiz" element={<Quiz />} />
            </Route>
          </Routes>
        </main>
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
