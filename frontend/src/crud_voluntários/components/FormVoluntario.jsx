// frontend/src/crud_voluntários/components/FormVoluntario.jsx
import { useState } from 'react';

export default function FormVoluntario({ voluntarioEdicao, onSalvar, onCancelar }) {
  const initialState = {
    nome: '',
    email: '',
    telefone: '',
    tipoAcesso: 'admin',
    ra: '',
    curso: 'Análise e Desenvolvimento de Sistemas',
    oficinaPref: 'Robótica LEGO',
    ativo: true,
  };

  const [formData, setFormData] = useState(voluntarioEdicao || initialState);
  const [erros, setErros] = useState({});

  const isProfessor = formData.tipoAcesso === 'superadmin';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (erros[name]) {
      setErros({ ...erros, [name]: '' });
    }
  };

  const validarCampos = () => {
    const novosErros = {};
    if (!formData.nome.trim()) novosErros.nome = 'O nome é obrigatório.';
    if (!formData.email.trim()) {
      novosErros.email = 'O e-mail é obrigatório.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      novosErros.email = 'Insira um e-mail válido.';
    }
    if (!isProfessor && !formData.ra.trim()) {
      novosErros.ra = 'O RA é obrigatório para estudantes voluntários.';
    }
    if (!formData.telefone.trim()) novosErros.telefone = 'O telefone é obrigatório.';

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validarCampos()) {
      const payload = isProfessor
        ? {
            ...formData,
            ra: formData.ra || 'Docente UTFPR',
            curso: 'Coordenação / Docente',
            oficinaPref: 'Coordenação Geral',
          }
        : formData;
      onSalvar(payload);
    }
  };

  return (
    <div className="card">
      <h2>{formData.id ? 'Editar Membro da Equipe' : 'Novo Cadastro de Administrador / Voluntário'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>Nível de Permissão*</label>
            <select name="tipoAcesso" value={formData.tipoAcesso || 'admin'} onChange={handleChange}>
              <option value="admin">Voluntário (Admin)</option>
              <option value="superadmin">Professor / Coordenador (Superadmin)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Nome Completo*</label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Ex: João da Silva"
            />
            {erros.nome && <span className="error-msg">{erros.nome}</span>}
          </div>

          <div className="form-group">
            <label>E-mail Institucional*</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="exemplo@utfpr.edu.br"
            />
            {erros.email && <span className="error-msg">{erros.email}</span>}
          </div>

          <div className="form-group">
            <label>Telefone/WhatsApp*</label>
            <input
              type="text"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              placeholder="(43) 99999-9999"
            />
            {erros.telefone && <span className="error-msg">{erros.telefone}</span>}
          </div>

          {!isProfessor && (
            <>
              <div className="form-group">
                <label>RA (UTFPR)*</label>
                <input
                  type="text"
                  name="ra"
                  value={formData.ra}
                  onChange={handleChange}
                  placeholder="a1234567"
                />
                {erros.ra && <span className="error-msg">{erros.ra}</span>}
              </div>

              <div className="form-group">
                <label>Curso</label>
                <select name="curso" value={formData.curso} onChange={handleChange}>
                  <option value="Análise e Desenvolvimento de Sistemas">Análise e Des. de Sistemas</option>
                  <option value="Engenharia de Software">Engenharia de Software</option>
                  <option value="Engenharia de Computação">Engenharia de Computação</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>

              <div className="form-group">
                <label>Oficina Preferencial</label>
                <select name="oficinaPref" value={formData.oficinaPref} onChange={handleChange}>
                  <option value="Robótica LEGO">Robótica LEGO</option>
                  <option value="Robótica com Arduino">Robótica com Arduino</option>
                  <option value="Modelagem 3D">Modelagem 3D</option>
                  <option value="Fábrica de Sites">Fábrica de Sites</option>
                  <option value="Desenvolvimento de Jogos">Desenvolvimento de Jogos</option>
                </select>
              </div>
            </>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {formData.id ? 'Atualizar Dados' : 'Cadastrar Membro'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancelar}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}