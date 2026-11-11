const resumoMock = {
  administradores: 3,
  oficinas: 5,
  escolas: 8,
  alunos: 214,
  solicitacoesPendentes: {
    total: 4,
    recentes: [
      {
        id: 3,
        nome: "Escola Rural Exemplo",
        cidade: "Cornélio Procópio",
        responsavel: "Carla Exemplo",
        createdAt: "2026-10-28T15:00:00.000Z",
      },
      {
        id: 4,
        nome: "Escola Municipal Modelo",
        cidade: "Cornélio Procópio",
        responsavel: "Diego Exemplo",
        createdAt: "2026-10-30T15:00:00.000Z",
      },
      {
        id: 5,
        nome: "Colégio Modelo",
        cidade: "Cornélio Procópio",
        responsavel: "Elisa Exemplo",
        createdAt: "2026-11-02T15:00:00.000Z",
      },
    ],
  },
};

export const getResumoAdmin = async () => resumoMock;
