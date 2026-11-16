// frontend/src/crud_voluntários/components/ListaVoluntario.jsx
import React, { useState } from 'react';

export default function ListaVoluntarios({ voluntarios, onEditar, onToggleStatus }) {
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('todos');

  const voluntariosFiltrados = voluntarios.filter((v) => {
    const atendeBusca =
      v.nome.toLowerCase().includes(busca.toLowerCase()) ||
      v.email.toLowerCase().includes(busca.toLowerCase()) ||
      (v.ra && v.ra.toLowerCase().includes(busca.toLowerCase()));

    if (filtroStatus === 'ativos') return atendeBusca && v.ativo;
    if (filtroStatus === 'inativos') return atendeBusca && !v.ativo;
    return atendeBusca;
  });

  return (
    <div className="card">
      <h3>Equipe Administrativa e Voluntários Cadastrados</h3>

      <div className="filter-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Buscar por Nome, E-mail ou RA..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <select
          className="filter-select"
          value={filtroStatus}
          onChange={(e) => setFiltroStatus(e.target.value)}
        >
          <option value="todos">Todos os Status</option>
          <option value="ativos">Apenas Ativos</option>
          <option value="inativos">Apenas Inativos</option>
        </select>
      </div>

      <div className="table-responsive">
        <table className="voluntarios-table">
          <thead>
            <tr>
              <th>Status</th>
              <th>Nome / Curso</th>
              <th>Perfil</th>
              <th>Registro (RA)</th>
              <th>Contato</th>
              <th>Oficina / Área</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {voluntariosFiltrados.length > 0 ? (
              voluntariosFiltrados.map((v) => (
                <tr key={v.id} style={{ opacity: v.ativo ? 1 : 0.65 }}>
                  <td>
                    <span className={`badge ${v.ativo ? 'ativo' : 'inativo'}`}>
                      {v.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td>
                    <strong>{v.nome}</strong>
                    <br />
                    <small>{v.curso}</small>
                  </td>
                  <td>
                    <span className="badge badge--tipo">
                      {v.tipoAcesso === 'superadmin' ? 'Professor (Superadmin)' : 'Voluntário (Admin)'}
                    </span>
                  </td>
                  <td>{v.ra}</td>
                  <td>
                    {v.email}
                    <br />
                    <small>{v.telefone}</small>
                  </td>
                  <td>{v.oficinaPref}</td>
                  <td className="actions-cell">
                    <button
                      className="btn btn-warning"
                      onClick={() => onEditar(v)}
                      title="Editar Membro"
                    >
                      Editar
                    </button>
                    {v.ativo ? (
                      <button
                        className="btn btn-danger"
                        onClick={() => onToggleStatus(v.id, false)}
                        title="Inativar (Soft Delete)"
                      >
                        Inativar
                      </button>
                    ) : (
                      <button
                        className="btn btn-success"
                        onClick={() => onToggleStatus(v.id, true)}
                        title="Reativar Membro"
                      >
                        Reativar
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                  Nenhum membro encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}