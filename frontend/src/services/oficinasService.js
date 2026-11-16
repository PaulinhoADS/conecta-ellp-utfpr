// frontend/src/services/oficinasService.js
const CHAVE_ARMAZENAMENTO = "conecta-ellp:oficinas-v2";

const oficinasIniciais = [
  {
    id: 1,
    nome: "Robótica LEGO",
    tema: "Física, Engenharia e Programação em Blocos",
    vagas: 20,
    descricao:
      "Utiliza os kits LEGO Mindstorms para ensinar conceitos de física, matemática, engenharia e lógica de programação de forma lúdica, montando e programando robôs interativos. Indicada para todas as idades.",
    ativa: true,
  },
  {
    id: 2,
    nome: "Robótica com Arduino",
    tema: "Eletrônica Básica e Automação",
    vagas: 15,
    descricao:
      "Focada em eletrônica básica e automação. Os alunos aprendem a programar placas digitais conectando sensores, luzes LED e pequenos motores. Recomendada a partir de 10 anos.",
    ativa: true,
  },
  {
    id: 3,
    nome: "Modelagem 3D",
    tema: "Design Tridimensional e Percepção Espacial",
    vagas: 15,
    descricao:
      "Desenvolve a percepção espacial através da criação de objetos digitais tridimensionais em softwares específicos, simulando a base para design e engenharia. Recomendada a partir de 12 anos.",
    ativa: true,
  },
  {
    id: 4,
    nome: "Fábrica de Sites",
    tema: "Desenvolvimento Web (HTML, CSS e JS)",
    vagas: 20,
    descricao:
      "Introdução ao desenvolvimento web, onde os estudantes aprendem a estruturar e criar suas próprias páginas e portfólios na internet. Recomendada a partir de 13 anos.",
    ativa: true,
  },
  {
    id: 5,
    nome: "Desenvolvimento de Jogos",
    tema: "Lógica de Programação e Criação de Games",
    vagas: 25,
    descricao:
      "Oficinas focadas na criação de games, ensinando a lógica de programação por trás das mecânicas, personagens e cenários. Indicada para todas as idades.",
    ativa: true,
  },
];

const criarNoLocalStorage = () => {
  if (!localStorage.getItem(CHAVE_ARMAZENAMENTO)) {
    localStorage.setItem(CHAVE_ARMAZENAMENTO, JSON.stringify(oficinasIniciais));
  }
};

export const getOficinas = async () => {
  criarNoLocalStorage();
  return JSON.parse(localStorage.getItem(CHAVE_ARMAZENAMENTO)) || [];
};

export const getOficinaById = async (id) => {
  criarNoLocalStorage();
  const oficina = JSON.parse(localStorage.getItem(CHAVE_ARMAZENAMENTO)).find(
    (item) => item.id === Number(id),
  );

  if (!oficina) {
    throw Object.assign(new Error("Oficina não encontrada."), {
      response: { status: 404 },
    });
  }

  return oficina;
};

export const createOficina = async (dados) => {
  criarNoLocalStorage();
  const oficinas = await getOficinas();
  const proximoId =
    oficinas.reduce((maior, oficina) => Math.max(maior, oficina.id), 0) + 1;
  const nova = { ...dados, id: proximoId, ativa: true };

  localStorage.setItem(
    CHAVE_ARMAZENAMENTO,
    JSON.stringify([...oficinas, nova]),
  );
  return nova;
};

export const updateOficina = async (id, dados) => {
  criarNoLocalStorage();
  const idNumerico = Number(id);
  const oficinas = await getOficinas();

  if (!oficinas.some((oficina) => oficina.id === idNumerico)) {
    throw Object.assign(new Error("Oficina não encontrada."), {
      response: { status: 404 },
    });
  }

  const atualizada = { ...dados, id: idNumerico };

  localStorage.setItem(
    CHAVE_ARMAZENAMENTO,
    JSON.stringify(
      oficinas.map((oficina) =>
        oficina.id === idNumerico ? atualizada : oficina,
      ),
    ),
  );
  return atualizada;
};