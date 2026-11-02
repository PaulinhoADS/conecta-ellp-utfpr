const CHAVE_ARMAZENAMENTO = 'conecta-ellp:oficinas';

const oficinasIniciais = [
  {
    id: 1,
    nome: 'Programação Visual',
    tema: 'Programação em blocos',
    vagas: 20,
    descricao:
      'Monte soluções arrastando blocos e elementos visuais e veja o resultado ganhar vida na tela, sem precisar decorar comandos.',
    ativa: true,
  },
  {
    id: 2,
    nome: 'Lógica de Programação',
    tema: 'Algoritmos e raciocínio lógico',
    vagas: 20,
    descricao:
      'Exercite raciocínio, algoritmos e resolução de problemas. É a base que sustenta qualquer linguagem que você aprender depois.',
    ativa: true,
  },
  {
    id: 3,
    nome: 'Desenvolvimento Web',
    tema: 'HTML, CSS e JavaScript',
    vagas: 15,
    descricao:
      'Dê os primeiros passos construindo páginas com HTML, CSS e JavaScript e publique algo que qualquer pessoa pode acessar.',
    ativa: true,
  },
];

export const getOficinas = async () => {
  const data = JSON.parse(localStorage.getItem(CHAVE_ARMAZENAMENTO) ?? JSON.stringify(oficinasIniciais));

  return data;
}

export const getOficinaById = async (id) => {
  const oficina = JSON.parse(localStorage.getItem(CHAVE_ARMAZENAMENTO) ?? JSON.stringify(oficinasIniciais)).find((item) => item.id === Number(id));

  if (!oficina) {
    throw Object.assign(new Error('Oficina não encontrada.'), { response: { status: 404 } });
  }

  return oficina;
};

export const createOficina = async (dados) => {
  const oficinas = getOficinas();
  const proximoId = oficinas.reduce((maior, oficina) => Math.max(maior, oficina.id), 0) + 1;
  const nova = { ...dados, id: proximoId, ativa: true };

  localStorage.setItem(CHAVE_ARMAZENAMENTO, ([...oficinas, nova]));
  return nova;
};

export const updateOficina = async (id, dados) => {
  const idNumerico = Number(id);
  const oficinas = getOficinas();

  if (!oficinas.some((oficina) => oficina.id === idNumerico)) {
    throw Object.assign(new Error('Oficina não encontrada.'), { response: { status: 404 } });
  }

  const atualizada = { ...dados, id: idNumerico };

  localStorage.setItem(CHAVE_ARMAZENAMENTO, (oficinas.map((oficina) => (oficina.id === idNumerico ? atualizada : oficina))));
  return atualizada;
};