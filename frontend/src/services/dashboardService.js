// frontend/src/services/dashboardService.js
import api from './api';

export const getResumoAdmin = async () => {
  const [escolasRes, oficinasRes, alunosRes, adminsRes] = await Promise.all([
    api.get('/escolas'),
    api.get('/oficinas'),
    api.get('/alunos'),
    api.get('/administradores'),
  ]);

  const escolas = escolasRes.data;
  const oficinas = oficinasRes.data;
  const alunos = alunosRes.data;
  const voluntarios = adminsRes.data;

  const pendentes = escolas.filter(
    (escola) => escola.ativa && escola.status === 'pendente'
  );

  return {
    administradores: voluntarios.filter((v) => v.ativo).length,
    oficinas: oficinas.filter((o) => o.ativa).length,
    escolas: escolas.filter((e) => e.ativa && e.status === 'aprovada').length,
    alunos: alunos.filter((a) => a.ativo !== false).length,
    solicitacoesPendentes: {
      total: pendentes.length,
      recentes: pendentes.slice(0, 3).map((escola) => ({
        id: escola.id,
        nome: escola.nome,
        cidade: 'Cornélio Procópio - PR',
        responsavel: escola.responsavel || 'Direção Escolar',
        createdAt: escola.createdAt || new Date().toISOString(),
      })),
    },
  };
};