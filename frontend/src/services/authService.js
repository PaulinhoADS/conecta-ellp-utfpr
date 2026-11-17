// frontend/src/services/authService.js
import api from './api';

export const loginRequest = async (usuario, senha) => {
  const response = await api.post('/login', { usuario, senha });
  return response.data;
};

export const changePassword = async ({ senhaAtual, novaSenha }) => {
  const response = await api.put('/auth/senha', { senhaAtual, novaSenha });
  return response.data;
};