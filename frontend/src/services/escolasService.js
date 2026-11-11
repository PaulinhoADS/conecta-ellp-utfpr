import { deleteAlunosByEscola, getAlunos } from "./alunosService";

const CHAVE_ESCOLAS = "conecta-ellp:escolas";

const escolasIniciais = [
  {
    id: 1,
    nome: "Colégio Estadual Monteiro Lobato",
    cnpj: "76.416.940/0001-28",
    tipo: "Escola Pública",
    endereco: "Av. XV de Novembro, 820 - Centro, Cornélio Procópio - PR",
    telefone: "(43) 3524-1840",
    email: "direcao@monteirolobato.pr.gov.br",
    responsavel: "Prof.ª Márcia Helena Souza",
    vagasSolicitadas: 25,
    observacoes:
      "Instituição parceira com turmas do 6º ao 9º ano do Ensino Fundamental interessadas nas oficinas de sábado.",
    status: "aprovada",
    ativa: true,
    cartaConviteEmitidaEm: "18/10/2026",
  },
  {
    id: 2,
    nome: "Escola Municipal Professora Noêmia",
    cnpj: "18.294.510/0001-64",
    tipo: "Escola Pública",
    endereco: "Rua Goiás, 315 - Vila Independência, Cornélio Procópio - PR",
    telefone: "(43) 3523-4190",
    email: "coord.noemia@edu.cornelioprocopio.pr.gov.br",
    responsavel: "Prof. Ricardo Almeida",
    vagasSolicitadas: 20,
    observacoes:
      "Solicitou parceria para encaminhamento de alunos do contraturno escolar para reforço lógico e robótica.",
    status: "pendente",
    ativa: true,
    cartaConviteEmitidaEm: null,
  },
  {
    id: 3,
    nome: "Instituto Social Sementes do Futuro",
    cnpj: "45.812.309/0001-05",
    tipo: "ONG",
    endereco: "Rua Mato Grosso, 140 - Jardim Panorama, Cornélio Procópio - PR",
    telefone: "(43) 99812-6504",
    email: "contato@sementesdofuturo.org.br",
    responsavel: "Ana Paula Ferreira",
    vagasSolicitadas: 15,
    observacoes:
      "ONG focada no atendimento socioeducativo de jovens de 10 a 16 anos em situação de vulnerabilidade.",
    status: "aprovada",
    ativa: true,
    cartaConviteEmitidaEm: "22/10/2026",
  },
];

const criarNoLocalStorage = () => {
  if (!localStorage.getItem(CHAVE_ESCOLAS)) {
    localStorage.setItem(CHAVE_ESCOLAS, JSON.stringify(escolasIniciais));
  }
};

const lerEscolasRaw = () => {
  criarNoLocalStorage();
  return JSON.parse(localStorage.getItem(CHAVE_ESCOLAS)) || [];
};

const anexarAlunos = (escola, todosAlunos) => {
  const alunosDaEscola = todosAlunos.filter(
    (aluno) => Number(aluno.escolaId) === Number(escola.id),
  );
  return {
    ...escola,
    ativa: escola.status !== "inativa" && escola.ativa !== false,
    alunos: alunosDaEscola,
  };
};

export const getEscolas = async () => {
  const escolas = lerEscolasRaw();
  const alunos = await getAlunos();
  return escolas.map((escola) => anexarAlunos(escola, alunos));
};

export const getEscolaById = async (id) => {
  const idNumerico = Number(id);
  const escolas = lerEscolasRaw();
  const escola = escolas.find((item) => item.id === idNumerico);

  if (!escola) {
    throw Object.assign(new Error("Escola não encontrada."), {
      response: { status: 404 },
    });
  }

  const alunos = await getAlunos();
  return anexarAlunos(escola, alunos);
};

export const createEscola = async (dados) => {
  const escolas = lerEscolasRaw();
  const proximoId =
    escolas.reduce((maior, item) => Math.max(maior, item.id), 0) + 1;

  const status = dados.status || "pendente";
  const nova = {
    ...dados,
    id: proximoId,
    vagasSolicitadas: Number(dados.vagasSolicitadas) || 0,
    status,
    ativa: status !== "inativa",
    cartaConviteEmitidaEm: dados.cartaConviteEmitidaEm || null,
  };

  localStorage.setItem(CHAVE_ESCOLAS, JSON.stringify([...escolas, nova]));
  const alunos = await getAlunos();
  return anexarAlunos(nova, alunos);
};

export const updateEscola = async (id, dados) => {
  const idNumerico = Number(id);
  const escolas = lerEscolasRaw();
  const existente = escolas.find((item) => item.id === idNumerico);

  if (!existente) {
    throw Object.assign(new Error("Escola não encontrada."), {
      response: { status: 404 },
    });
  }

  const statusFinal =
    dados.ativa === false
      ? "inativa"
      : dados.status === "inativa" && dados.ativa === true
        ? "aprovada"
        : dados.status || existente.status;

  const atualizada = {
    ...existente,
    ...dados,
    id: idNumerico,
    vagasSolicitadas: Number(dados.vagasSolicitadas) || 0,
    status: statusFinal,
    ativa: statusFinal !== "inativa",
  };

  localStorage.setItem(
    CHAVE_ESCOLAS,
    JSON.stringify(
      escolas.map((item) => (item.id === idNumerico ? atualizada : item)),
    ),
  );

  const alunos = await getAlunos();
  return anexarAlunos(atualizada, alunos);
};

export const deleteEscola = async (id) => {
  const idNumerico = Number(id);
  const escolas = lerEscolasRaw();

  if (!escolas.some((item) => item.id === idNumerico)) {
    throw Object.assign(new Error("Escola não encontrada."), {
      response: { status: 404 },
    });
  }

  localStorage.setItem(
    CHAVE_ESCOLAS,
    JSON.stringify(escolas.filter((item) => item.id !== idNumerico)),
  );

  await deleteAlunosByEscola(idNumerico);

  return true;
};

export const aprovarEscola = async (id) => {
  const idNumerico = Number(id);
  const escola = lerEscolasRaw().find((item) => item.id === idNumerico);

  if (!escola) {
    throw Object.assign(new Error("Escola não encontrada."), {
      response: { status: 404 },
    });
  }

  return updateEscola(id, {
    ...escola,
    status: "aprovada",
    ativa: true,
  });
};

export const registrarCartaConvite = async (id) => {
  const idNumerico = Number(id);
  const escola = lerEscolasRaw().find((item) => item.id === idNumerico);

  if (!escola) {
    throw Object.assign(new Error("Escola não encontrada."), {
      response: { status: 404 },
    });
  }

  const dataHoje = new Date().toLocaleDateString("pt-BR");

  return updateEscola(id, {
    ...escola,
    status: escola.status === "pendente" ? "aprovada" : escola.status,
    ativa: true,
    cartaConviteEmitidaEm: dataHoje,
  });
};
