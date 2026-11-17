// frontend/src/services/oficinasService.js
import api from './api';

export const getOficinas = async () => {
  const response = await api.get('/oficinas');
  return response.data;
};

export const getOficinaById = async (id) => {
  const response = await api.get(`/oficinas/${id}`);
  return response.data;
};

export const createOficina = async (dados) => {
  const response = await api.post('/oficinas', dados);
  return response.data;
};

export const updateOficina = async (id, dados) => {
  const response = await api.put(`/oficinas/${id}`, dados);
  return response.data;
};