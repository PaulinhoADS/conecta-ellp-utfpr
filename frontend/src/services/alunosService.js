// frontend/src/services/alunosService.js
import api from './api';
import { generatePassword } from '../utils/utils';

export const getAlunos = async () => {
  const response = await api.get('/alunos');
  return response.data;
};

export const getAlunosByEscola = async (escolaId) => {
  const escola = await api.get(`/escolas/${escolaId}`);
  return escola.data.alunos || [];
};

export const getAlunoById = async (id) => {
  const response = await api.get(`/alunos/${id}`);
  return response.data;
};

export const createAluno = async (escolaId, dadosAluno) => {
  const senhaTemporaria = dadosAluno.senhaTemporaria || generatePassword(10);
  const response = await api.post(`/escolas/${escolaId}/alunos`, {
    ...dadosAluno,
    senhaTemporaria,
  });
  return response.data;
};

export const updateAluno = async (escolaId, alunoId, dadosAluno) => {
  const response = await api.put(
    `/escolas/${escolaId}/alunos/${alunoId}`,
    dadosAluno
  );
  return response.data;
};

export const deleteAluno = async (escolaId, alunoId) => {
  await api.delete(`/escolas/${escolaId}/alunos/${alunoId}`);
  return true;
};

export const deleteAlunosByEscola = async () => true;