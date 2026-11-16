// frontend/src/services/dashboardService.js
import { getEscolas } from "./escolasService";
import { getOficinas } from "./oficinasService";
import { getAlunos } from "./alunosService";
import { readVoluntarios } from "../crud_voluntários/VoluntariosPage";

export const getResumoAdmin = async () => {
  const [escolas, oficinas, alunos] = await Promise.all([
    getEscolas(),
    getOficinas(),
    getAlunos(),
  ]);
  const voluntarios = readVoluntarios();

  const pendentes = escolas.filter(
    (escola) => escola.ativa && escola.status === "pendente"
  );

  return {
    administradores: voluntarios.filter((v) => v.ativo).length,
    oficinas: oficinas.filter((o) => o.ativa).length,
    escolas: escolas.filter((e) => e.ativa && e.status === "aprovada").length,
    alunos: alunos.length,
    solicitacoesPendentes: {
      total: pendentes.length,
      recentes: pendentes.slice(0, 3).map((escola) => ({
        id: escola.id,
        nome: escola.nome,
        cidade: "Cornélio Procópio - PR",
        responsavel: escola.responsavel || "Direção Escolar",
        createdAt: new Date().toISOString(),
      })),
    },
  };
};