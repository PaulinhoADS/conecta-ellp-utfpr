// frontend/src/services/escolasService.js
import api from './api';

export const getEscolas = async () => {
  const response = await api.get('/escolas');
  return response.data;
};

export const getEscolaById = async (id) => {
  const response = await api.get(`/escolas/${id}`);
  return response.data;
};

export const createEscola = async (dados) => {
  const response = await api.post('/escolas', dados);
  return response.data;
};

export const updateEscola = async (id, dados) => {
  const response = await api.put(`/escolas/${id}`, dados);
  return response.data;
};

export const deleteEscola = async (id) => {
  await api.delete(`/escolas/${id}`);
  return true;
};

export const aprovarEscola = async (id) => {
  const response = await api.put(`/escolas/${id}`, {
    status: 'aprovada',
    ativa: true,
  });
  return response.data;
};

export const registrarCartaConvite = async (id) => {
  const dataHoje = new Date().toLocaleDateString('pt-BR');
  const response = await api.put(`/escolas/${id}`, {
    status: 'aprovada',
    ativa: true,
    cartaConviteEmitidaEm: dataHoje,
  });
  return response.data;
};