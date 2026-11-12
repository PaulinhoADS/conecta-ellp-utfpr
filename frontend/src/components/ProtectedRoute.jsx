// src/components/ProtectedRoute.jsx

import { Navigate, Outlet, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({
  allowedRoles,
  verifyAdminOwnership,
  verifySchoolOwnership,
  verifyStudentOwnership,
}) => {
  const { isAuthenticated, hasRole, user } = useAuth();
  const { id, escolaId } = useParams();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !hasRole(allowedRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  const isAdmin = hasRole(["admin", "superadmin"]);
  const isSuperAdmin = hasRole("superadmin");

  if (verifyAdminOwnership && id && !isSuperAdmin) {
    if (String(user.id) !== String(id)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  if (verifySchoolOwnership && id && !isAdmin) {
    if (String(user.id) !== String(id)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  if (verifyStudentOwnership && !isAdmin) {
    const isAlunoLogado = hasRole("aluno");
    const isEscolaLogada = hasRole("escola");

    let autorizado = false;

    if (isAlunoLogado && id && String(user.id) === String(id)) {
      autorizado = true;
    }

    if (isEscolaLogada && escolaId && String(user.id) === String(escolaId)) {
      autorizado = true;
    }

    if (!autorizado) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
