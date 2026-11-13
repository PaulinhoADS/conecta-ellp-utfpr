import { generatePassword } from "../utils/utils";

const CHAVE_ALUNOS = "conecta-ellp:alunos";

const alunosIniciais = [
  {
    id: 1,
    nome: "Lucas Gabriel Martins",
    username: "lucas.martins",
    idade: 12,
    perfilLologico: "Robótica LEGO",
    escolaId: 1,
  },
  {
    id: 2,
    nome: "Beatriz Oliveira Santos",
    username: "beatriz.santos",
    idade: 14,
    perfilLologico: "Fábrica de Sites",
    escolaId: 1,
  },
  {
    id: 3,
    nome: "Matheus Henrique Costa",
    username: "matheus.costa",
    idade: 11,
    perfilLologico: "Desenvolvimento de Jogos",
    escolaId: 1,
  },
  {
    id: 4,
    nome: "Camila Vitória Rocha",
    username: "camila.rocha",
    idade: 13,
    perfilLologico: "Modelagem 3D",
    escolaId: 2,
  },
  {
    id: 5,
    nome: "Pedro Augusto Lima",
    username: "pedro.lima",
    idade: 15,
    perfilLologico: "Robótica com Arduino",
    escolaId: 3,
  },
  {
    id: 6,
    nome: "Sofia Rodrigues Alves",
    username: "sofia.alves",
    idade: 10,
    perfilLologico: "Robótica LEGO",
    escolaId: 3,
  },
];

const gerarUsernameSugerido = (nome = "", id = "") => {
  const partes = String(nome)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (partes.length === 0) {
    return `aluno${id}`;
  }
  if (partes.length === 1) {
    return partes[0];
  }
  return `${partes[0]}.${partes[partes.length - 1]}`;
};

const criarAlunosNoLocalStorage = () => {
  if (!localStorage.getItem(CHAVE_ALUNOS)) {
    localStorage.setItem(CHAVE_ALUNOS, JSON.stringify(alunosIniciais));
  }
};

const lerAlunosRaw = () => {
  criarAlunosNoLocalStorage();
  const salvos = JSON.parse(localStorage.getItem(CHAVE_ALUNOS)) || [];

  return salvos.map((aluno) => ({
    ...aluno,
    username:
      aluno.username || gerarUsernameSugerido(aluno.nome, aluno.id),
  }));
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
  const usernameNormalizado = String(dadosAluno.username || "")
    .trim()
    .toLowerCase();

  if (
    usernameNormalizado &&
    alunos.some(
      (item) => String(item.username || "").toLowerCase() === usernameNormalizado,
    )
  ) {
    throw Object.assign(new Error("Este nome de usuário já está em uso."), {
      response: { status: 409, data: { campo: "username" } },
    });
  }

  const proximoId =
    alunos.reduce((maior, item) => Math.max(maior, item.id), 0) + 1;

  const senhaTemporaria =
    dadosAluno.senhaTemporaria || generatePassword(10);

  const novoAluno = {
    id: proximoId,
    nome: dadosAluno.nome.trim(),
    username:
      usernameNormalizado ||
      gerarUsernameSugerido(dadosAluno.nome, proximoId),
    idade: Number(dadosAluno.idade),
    perfilLologico: dadosAluno.perfilLologico || "Aguardando Quiz Perfil Tech",
    escolaId: Number(escolaId),
    senhaTemporaria,
  };

  localStorage.setItem(CHAVE_ALUNOS, JSON.stringify([...alunos, novoAluno]));
  return novoAluno;
};

export const updateAluno = async (escolaId, alunoId, dadosAluno) => {
  const alunos = lerAlunosRaw();
  const idNumerico = Number(alunoId);
  const existente = alunos.find((item) => item.id === idNumerico);

  if (!existente) {
    throw Object.assign(new Error("Aluno não encontrado."), {
      response: { status: 404 },
    });
  }

  const usernameNormalizado = String(
    dadosAluno.username !== undefined ? dadosAluno.username : existente.username,
  )
    .trim()
    .toLowerCase();

  if (
    usernameNormalizado &&
    alunos.some(
      (item) =>
        item.id !== idNumerico &&
        String(item.username || "").toLowerCase() === usernameNormalizado,
    )
  ) {
    throw Object.assign(new Error("Este nome de usuário já está em uso."), {
      response: { status: 409, data: { campo: "username" } },
    });
  }

  const atualizado = {
    ...existente,
    id: idNumerico,
    nome: dadosAluno.nome ? dadosAluno.nome.trim() : existente.nome,
    username: usernameNormalizado,
    idade:
      dadosAluno.idade !== undefined
        ? Number(dadosAluno.idade)
        : existente.idade,
    perfilLologico:
      dadosAluno.perfilLologico ||
      existente.perfilLologico ||
      "Aguardando Quiz Perfil Tech",
    escolaId:
      escolaId !== undefined ? Number(escolaId) : Number(existente.escolaId),
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
