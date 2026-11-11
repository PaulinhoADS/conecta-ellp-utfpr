const CHAVE_ALUNOS = "conecta-ellp:alunos";

const alunosIniciais = [
  {
    id: 1,
    nome: "Lucas Gabriel Martins",
    idade: 12,
    perfilLologico: "Robótica LEGO",
    escolaId: 1,
  },
  {
    id: 2,
    nome: "Beatriz Oliveira Santos",
    idade: 14,
    perfilLologico: "Fábrica de Sites",
    escolaId: 1,
  },
  {
    id: 3,
    nome: "Matheus Henrique Costa",
    idade: 11,
    perfilLologico: "Desenvolvimento de Jogos",
    escolaId: 1,
  },
  {
    id: 4,
    nome: "Camila Vitória Rocha",
    idade: 13,
    perfilLologico: "Modelagem 3D",
    escolaId: 2,
  },
  {
    id: 5,
    nome: "Pedro Augusto Lima",
    idade: 15,
    perfilLologico: "Robótica com Arduino",
    escolaId: 3,
  },
  {
    id: 6,
    nome: "Sofia Rodrigues Alves",
    idade: 10,
    perfilLologico: "Robótica LEGO",
    escolaId: 3,
  },
];

const criarAlunosNoLocalStorage = () => {
  if (!localStorage.getItem(CHAVE_ALUNOS)) {
    localStorage.setItem(CHAVE_ALUNOS, JSON.stringify(alunosIniciais));
  }
};

const lerAlunosRaw = () => {
  criarAlunosNoLocalStorage();
  return JSON.parse(localStorage.getItem(CHAVE_ALUNOS)) || [];
};

export const getAlunos = async () => {
  return lerAlunosRaw();
};

export const getAlunosByEscola = async (escolaId) => {
  const alunos = lerAlunosRaw();
  return alunos.filter((aluno) => Number(aluno.escolaId) === Number(escolaId));
};

export const getAlunoById = async (id) => {
  const idNumerico = Number(id);
  const aluno = lerAlunosRaw().find((item) => item.id === idNumerico);

  if (!aluno) {
    throw Object.assign(new Error("Aluno não encontrado."), {
      response: { status: 404 },
    });
  }

  return aluno;
};

export const createAluno = async (escolaId, dadosAluno) => {
  const alunos = lerAlunosRaw();
  const proximoId =
    alunos.reduce((maior, item) => Math.max(maior, item.id), 0) + 1;

  const novoAluno = {
    id: proximoId,
    nome: dadosAluno.nome.trim(),
    idade: Number(dadosAluno.idade),
    perfilLologico: dadosAluno.perfilLologico || "Aguardando Quiz Perfil Tech",
    escolaId: Number(escolaId),
  };

  localStorage.setItem(CHAVE_ALUNOS, JSON.stringify([...alunos, novoAluno]));
  return novoAluno;
};

export const updateAluno = async (escolaId, alunoId, dadosAluno) => {
  const alunos = lerAlunosRaw();
  const idNumerico = Number(alunoId);

  if (!alunos.some((item) => item.id === idNumerico)) {
    throw Object.assign(new Error("Aluno não encontrado."), {
      response: { status: 404 },
    });
  }

  const atualizado = {
    id: idNumerico,
    nome: dadosAluno.nome.trim(),
    idade: Number(dadosAluno.idade),
    perfilLologico: dadosAluno.perfilLologico || "Aguardando Quiz Perfil Tech",
    escolaId: Number(escolaId),
  };

  localStorage.setItem(
    CHAVE_ALUNOS,
    JSON.stringify(
      alunos.map((item) => (item.id === idNumerico ? atualizado : item)),
    ),
  );

  return atualizado;
};

export const deleteAluno = async (escolaId, alunoId) => {
  const alunos = lerAlunosRaw();
  const idNumerico = Number(alunoId);

  localStorage.setItem(
    CHAVE_ALUNOS,
    JSON.stringify(
      alunos.filter(
        (item) =>
          !(
            item.id === idNumerico &&
            Number(item.escolaId) === Number(escolaId)
          ),
      ),
    ),
  );

  return true;
};

export const deleteAlunosByEscola = async (escolaId) => {
  const alunos = lerAlunosRaw();
  const idNumerico = Number(escolaId);

  localStorage.setItem(
    CHAVE_ALUNOS,
    JSON.stringify(
      alunos.filter((aluno) => Number(aluno.escolaId) !== idNumerico),
    ),
  );

  return true;
};
