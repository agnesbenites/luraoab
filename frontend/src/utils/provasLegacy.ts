type AnyObj = Record<string, any>;

function slugArea(areaId: string) {
  return String(areaId || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function numExame(exame: string | number) {
  const valor = String(exame ?? '')
    .replace(',', '.')
    .trim();

  return Number(valor);
}

function asArray<T = any>(value: any): T[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function text(value: any): string {
  if (!value) return '';
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number') return String(value);
  if (Array.isArray(value)) return value.map(text).filter(Boolean).join('\n');

  if (typeof value === 'object') {
    return (
      value.texto ||
      value.item ||
      value.descricao ||
      value.gabarito ||
      value.resposta ||
      value.justificativa_peca ||
      value.peca_correta ||
      ''
    )
      .toString()
      .trim();
  }

  return String(value).trim();
}

function listaPontuavel(value: any): string[] {
  return asArray(value)
    .flatMap((item) => {
      if (typeof item === 'string') return [item.trim()];
      if (item?.pontuacao && item?.texto) {
        return [`${String(item.texto).trim()} (${String(item.pontuacao).trim()})`];
      }
      if (item?.item) return [String(item.item).trim()];
      if (item?.texto) return [String(item.texto).trim()];
      if (item?.descricao) return [String(item.descricao).trim()];
      if (item?.criterio) return [String(item.criterio).trim()];
      return [];
    })
    .filter(Boolean);
}

function normalizarQuestao(q: AnyObj = {}) {
  const enunciado =
    text(q.pergunta) ||
    text(q.enunciado) ||
    text(q.texto);

  const gabarito =
    text(q.gabarito) ||
    text(q.resposta) ||
    text(q.gabarito_comentado) ||
    text(q.espelho) ||
    text(q.comentario);

  const itens = [
    ...listaPontuavel(q.itens),
    ...listaPontuavel(q.subitens),
    ...listaPontuavel(q.criterios),
    ...listaPontuavel(q.distribuicao_pontos),
    ...listaPontuavel(q.pontuacao),
    ...listaPontuavel(q.espelho_itens),
  ];

  return {
    ...q,
    pergunta: enunciado || 'Questão sem enunciado.',
    gabarito: gabarito || '',
    criterios: itens,
    distribuicao_pontos: itens,
  };
}

function normalizarPeca(peca: AnyObj = {}) {
  const gab = peca?.gabarito || {};

  const justificativa =
    text(gab.justificativa_peca) ||
    text(gab.gabarito_comentado) ||
    text(gab.comentario) ||
    '';

  const fundamentos = [
    ...listaPontuavel(gab.fundamentos),
    ...listaPontuavel(gab.argumentos),
  ];

  const pedidos = [
    ...listaPontuavel(gab.pedidos),
  ];

  const criterios = [
    ...listaPontuavel(gab.itens),
    ...listaPontuavel(gab.criterios),
    ...listaPontuavel(gab.distribuicao_pontos),
    ...listaPontuavel(gab.pontuacao),
    ...fundamentos,
    ...pedidos,
  ];

  return {
    ...peca,
    enunciado: text(peca.enunciado) || 'Enunciado da peça não encontrado.',
    tipo: text(peca.tipo),
    gabarito: {
      ...gab,
      peca_correta: text(gab.peca_correta) || text(peca.tipo) || 'Não informado.',
      justificativa_peca: justificativa,
      fundamentos,
      pedidos,
      criterios,
      distribuicao_pontos: criterios,
    },
  };
}

function normalizarProva(prova: AnyObj = {}) {
  return {
    ...prova,
    area: text(prova.area),
    data: text(prova.data),
    peca: normalizarPeca(prova.peca || {}),
    questoes: asArray(prova.questoes).map(normalizarQuestao),
  };
}

function withV2(base: Record<number, any>, overrides: Record<number, any> = {}) {
  return { ...base, ...overrides };
}

const provas: Record<string, Record<number, any>> = {
  administrativo: withV2(
    {
      13: require('../data/provas/administrativo/exame_13.json'),
      15: require('../data/provas/administrativo/exame_15.json'),
      16: require('../data/provas/administrativo/exame_16.json'),
      17: require('../data/provas/administrativo/exame_17.json'),
      18: require('../data/provas/administrativo/exame_18.json'),
      19: require('../data/provas/administrativo/exame_19.json'),
      20: require('../data/provas/administrativo/exame_20.json'),
      21: require('../data/provas/administrativo/exame_21.json'),
      22: require('../data/provas/administrativo/exame_22.json'),
      23: require('../data/provas/administrativo/exame_23.json'),
      24: require('../data/provas/administrativo/exame_24.json'),
      25: require('../data/provas/administrativo/exame_25.json'),
      26: require('../data/provas/administrativo/exame_26.json'),
      27: require('../data/provas/administrativo/exame_27.json'),
      28: require('../data/provas/administrativo/exame_28.json'),
      29: require('../data/provas/administrativo/exame_29.json'),
      30: require('../data/provas/administrativo/exame_30.json'),
      31: require('../data/provas/administrativo/exame_31.json'),
      32: require('../data/provas/administrativo/exame_32.json'),
      33: require('../data/provas/administrativo/exame_33.json'),
      34: require('../data/provas/administrativo/exame_34.json'),
      35: require('../data/provas/administrativo/exame_35.json'),
      36: require('../data/provas/administrativo/exame_36.json'),
      37: require('../data/provas/administrativo/exame_37.json'),
      38: require('../data/provas/administrativo/exame_38.json'),
      39: require('../data/provas/administrativo/exame_39.json'),
      40: require('../data/provas/administrativo/exame_40.json'),
      41: require('../data/provas/administrativo/exame_41.json'),
      42: require('../data/provas/administrativo/exame_42.json'),
      43: require('../data/provas/administrativo/exame_43.json'),
      44: require('../data/provas/administrativo/exame_44.json'),
      45: require('../data/provas/administrativo/exame_45.json'),
    },
    {
      20: require('../data/provas/administrativo/exame_20v2.json'),
      25: require('../data/provas/administrativo/exame_25v2.json'),
    }
  ),

  civil: withV2(
    {
      13: require('../data/provas/civil/exame_13.json'),
      15: require('../data/provas/civil/exame_15.json'),
      16: require('../data/provas/civil/exame_16.json'),
      17: require('../data/provas/civil/exame_17.json'),
      18: require('../data/provas/civil/exame_18.json'),
      19: require('../data/provas/civil/exame_19.json'),
      20: require('../data/provas/civil/exame_20.json'),
      21: require('../data/provas/civil/exame_21.json'),
      22: require('../data/provas/civil/exame_22.json'),
      23: require('../data/provas/civil/exame_23.json'),
      24: require('../data/provas/civil/exame_24.json'),
      25: require('../data/provas/civil/exame_25.json'),
      26: require('../data/provas/civil/exame_26.json'),
      27: require('../data/provas/civil/exame_27.json'),
      28: require('../data/provas/civil/exame_28.json'),
      29: require('../data/provas/civil/exame_29.json'),
      30: require('../data/provas/civil/exame_30.json'),
      31: require('../data/provas/civil/exame_31.json'),
      32: require('../data/provas/civil/exame_32.json'),
      33: require('../data/provas/civil/exame_33.json'),
      34: require('../data/provas/civil/exame_34.json'),
      35: require('../data/provas/civil/exame_35.json'),
      36: require('../data/provas/civil/exame_36.json'),
      37: require('../data/provas/civil/exame_37.json'),
      38: require('../data/provas/civil/exame_38.json'),
      39: require('../data/provas/civil/exame_39.json'),
      40: require('../data/provas/civil/exame_40.json'),
      41: require('../data/provas/civil/exame_41.json'),
      42: require('../data/provas/civil/exame_42.json'),
      43: require('../data/provas/civil/exame_43.json'),
      44: require('../data/provas/civil/exame_44.json'),
      45: require('../data/provas/civil/exame_45.json'),
    },
    {
      20: require('../data/provas/civil/exame_20v2.json'),
      25: require('../data/provas/civil/exame_25v2.json'),
    }
  ),

  constitucional: withV2(
    {
      13: require('../data/provas/constitucional/exame_13.json'),
      15: require('../data/provas/constitucional/exame_15.json'),
      16: require('../data/provas/constitucional/exame_16.json'),
      17: require('../data/provas/constitucional/exame_17.json'),
      18: require('../data/provas/constitucional/exame_18.json'),
      19: require('../data/provas/constitucional/exame_19.json'),
      20: require('../data/provas/constitucional/exame_20.json'),
      21: require('../data/provas/constitucional/exame_21.json'),
      22: require('../data/provas/constitucional/exame_22.json'),
      23: require('../data/provas/constitucional/exame_23.json'),
      24: require('../data/provas/constitucional/exame_24.json'),
      25: require('../data/provas/constitucional/exame_25.json'),
      26: require('../data/provas/constitucional/exame_26.json'),
      27: require('../data/provas/constitucional/exame_27.json'),
      28: require('../data/provas/constitucional/exame_28.json'),
      29: require('../data/provas/constitucional/exame_29.json'),
      30: require('../data/provas/constitucional/exame_30.json'),
      31: require('../data/provas/constitucional/exame_31.json'),
      32: require('../data/provas/constitucional/exame_32.json'),
      33: require('../data/provas/constitucional/exame_33.json'),
      34: require('../data/provas/constitucional/exame_34.json'),
      35: require('../data/provas/constitucional/exame_35.json'),
      36: require('../data/provas/constitucional/exame_36.json'),
      37: require('../data/provas/constitucional/exame_37.json'),
      38: require('../data/provas/constitucional/exame_38.json'),
      39: require('../data/provas/constitucional/exame_39.json'),
      40: require('../data/provas/constitucional/exame_40.json'),
      41: require('../data/provas/constitucional/exame_41.json'),
      42: require('../data/provas/constitucional/exame_42.json'),
      43: require('../data/provas/constitucional/exame_43.json'),
      44: require('../data/provas/constitucional/exame_44.json'),
      45: require('../data/provas/constitucional/exame_45.json'),
    },
    {
      20: require('../data/provas/constitucional/exame_20v2.json'),
      25: require('../data/provas/constitucional/exame_25v2.json'),
    }
  ),

  empresarial: withV2(
    {
      13: require('../data/provas/empresarial/exame_13.json'),
      15: require('../data/provas/empresarial/exame_15.json'),
      16: require('../data/provas/empresarial/exame_16.json'),
      17: require('../data/provas/empresarial/exame_17.json'),
      18: require('../data/provas/empresarial/exame_18.json'),
      19: require('../data/provas/empresarial/exame_19.json'),
      20: require('../data/provas/empresarial/exame_20.json'),
      21: require('../data/provas/empresarial/exame_21.json'),
      22: require('../data/provas/empresarial/exame_22.json'),
      23: require('../data/provas/empresarial/exame_23.json'),
      24: require('../data/provas/empresarial/exame_24.json'),
      25: require('../data/provas/empresarial/exame_25.json'),
      26: require('../data/provas/empresarial/exame_26.json'),
      27: require('../data/provas/empresarial/exame_27.json'),
      28: require('../data/provas/empresarial/exame_28.json'),
      29: require('../data/provas/empresarial/exame_29.json'),
      30: require('../data/provas/empresarial/exame_30.json'),
      31: require('../data/provas/empresarial/exame_31.json'),
      32: require('../data/provas/empresarial/exame_32.json'),
      33: require('../data/provas/empresarial/exame_33.json'),
      34: require('../data/provas/empresarial/exame_34.json'),
      35: require('../data/provas/empresarial/exame_35.json'),
      36: require('../data/provas/empresarial/exame_36.json'),
      37: require('../data/provas/empresarial/exame_37.json'),
      38: require('../data/provas/empresarial/exame_38.json'),
      39: require('../data/provas/empresarial/exame_39.json'),
      40: require('../data/provas/empresarial/exame_40.json'),
      41: require('../data/provas/empresarial/exame_41.json'),
      42: require('../data/provas/empresarial/exame_42.json'),
      43: require('../data/provas/empresarial/exame_43.json'),
      44: require('../data/provas/empresarial/exame_44.json'),
      45: require('../data/provas/empresarial/exame_45.json'),
    },
    {
      20: require('../data/provas/empresarial/exame_20v2.json'),
      25: require('../data/provas/empresarial/exame_25v2.json'),
    }
  ),

  penal: withV2(
    {
      13: require('../data/provas/penal/exame_13.json'),
      15: require('../data/provas/penal/exame_15.json'),
      16: require('../data/provas/penal/exame_16.json'),
      17: require('../data/provas/penal/exame_17.json'),
      18: require('../data/provas/penal/exame_18.json'),
      19: require('../data/provas/penal/exame_19.json'),
      20: require('../data/provas/penal/exame_20.json'),
      21: require('../data/provas/penal/exame_21.json'),
      22: require('../data/provas/penal/exame_22.json'),
      23: require('../data/provas/penal/exame_23.json'),
      24: require('../data/provas/penal/exame_24.json'),
      25: require('../data/provas/penal/exame_25.json'),
      26: require('../data/provas/penal/exame_26.json'),
      27: require('../data/provas/penal/exame_27.json'),
      28: require('../data/provas/penal/exame_28.json'),
      29: require('../data/provas/penal/exame_29.json'),
      30: require('../data/provas/penal/exame_30.json'),
      31: require('../data/provas/penal/exame_31.json'),
      32: require('../data/provas/penal/exame_32.json'),
      33: require('../data/provas/penal/exame_33.json'),
      34: require('../data/provas/penal/exame_34.json'),
      35: require('../data/provas/penal/exame_35.json'),
      36: require('../data/provas/penal/exame_36.json'),
      37: require('../data/provas/penal/exame_37.json'),
      38: require('../data/provas/penal/exame_38.json'),
      39: require('../data/provas/penal/exame_39.json'),
      40: require('../data/provas/penal/exame_40.json'),
      41: require('../data/provas/penal/exame_41.json'),
      42: require('../data/provas/penal/exame_42.json'),
      43: require('../data/provas/penal/exame_43.json'),
      44: require('../data/provas/penal/exame_44.json'),
      45: require('../data/provas/penal/exame_45.json'),
    },
    {
      20: require('../data/provas/penal/exame_20v2.json'),
      25: require('../data/provas/penal/exame_25v2.json'),
    }
  ),

  trabalho: withV2(
    {
      13: require('../data/provas/trabalho/exame_13.json'),
      15: require('../data/provas/trabalho/exame_15.json'),
      16: require('../data/provas/trabalho/exame_16.json'),
      17: require('../data/provas/trabalho/exame_17.json'),
      18: require('../data/provas/trabalho/exame_18.json'),
      19: require('../data/provas/trabalho/exame_19.json'),
      20: require('../data/provas/trabalho/exame_20.json'),
      21: require('../data/provas/trabalho/exame_21.json'),
      22: require('../data/provas/trabalho/exame_22.json'),
      23: require('../data/provas/trabalho/exame_23.json'),
      24: require('../data/provas/trabalho/exame_24.json'),
      25: require('../data/provas/trabalho/exame_25.json'),
      26: require('../data/provas/trabalho/exame_26.json'),
      27: require('../data/provas/trabalho/exame_27.json'),
      28: require('../data/provas/trabalho/exame_28.json'),
      29: require('../data/provas/trabalho/exame_29.json'),
      30: require('../data/provas/trabalho/exame_30.json'),
      31: require('../data/provas/trabalho/exame_31.json'),
      32: require('../data/provas/trabalho/exame_32.json'),
      33: require('../data/provas/trabalho/exame_33.json'),
      34: require('../data/provas/trabalho/exame_34.json'),
      35: require('../data/provas/trabalho/exame_35.json'),
      36: require('../data/provas/trabalho/exame_36.json'),
      37: require('../data/provas/trabalho/exame_37.json'),
      38: require('../data/provas/trabalho/exame_38.json'),
      39: require('../data/provas/trabalho/exame_39.json'),
      40: require('../data/provas/trabalho/exame_40.json'),
      41: require('../data/provas/trabalho/exame_41.json'),
      42: require('../data/provas/trabalho/exame_42.json'),
      43: require('../data/provas/trabalho/exame_43.json'),
      44: require('../data/provas/trabalho/exame_44.json'),
      45: require('../data/provas/trabalho/exame_45.json'),
    },
    {
      20: require('../data/provas/trabalho/exame_20v2.json'),
      25: require('../data/provas/trabalho/exame_25v2.json'),
    }
  ),

  tributario: withV2(
    {
      13: require('../data/provas/tributario/exame_13.json'),
      15: require('../data/provas/tributario/exame_15.json'),
      16: require('../data/provas/tributario/exame_16.json'),
      17: require('../data/provas/tributario/exame_17.json'),
      18: require('../data/provas/tributario/exame_18.json'),
      19: require('../data/provas/tributario/exame_19.json'),
      20: require('../data/provas/tributario/exame_20.json'),
      21: require('../data/provas/tributario/exame_21.json'),
      22: require('../data/provas/tributario/exame_22.json'),
      23: require('../data/provas/tributario/exame_23.json'),
      24: require('../data/provas/tributario/exame_24.json'),
      25: require('../data/provas/tributario/exame_25.json'),
      26: require('../data/provas/tributario/exame_26.json'),
      27: require('../data/provas/tributario/exame_27.json'),
      28: require('../data/provas/tributario/exame_28.json'),
      29: require('../data/provas/tributario/exame_29.json'),
      30: require('../data/provas/tributario/exame_30.json'),
      31: require('../data/provas/tributario/exame_31.json'),
      32: require('../data/provas/tributario/exame_32.json'),
      33: require('../data/provas/tributario/exame_33.json'),
      34: require('../data/provas/tributario/exame_34.json'),
      35: require('../data/provas/tributario/exame_35.json'),
      36: require('../data/provas/tributario/exame_36.json'),
      37: require('../data/provas/tributario/exame_37.json'),
      38: require('../data/provas/tributario/exame_38.json'),
      39: require('../data/provas/tributario/exame_39.json'),
      40: require('../data/provas/tributario/exame_40.json'),
      41: require('../data/provas/tributario/exame_41.json'),
      42: require('../data/provas/tributario/exame_42.json'),
      43: require('../data/provas/tributario/exame_43.json'),
      44: require('../data/provas/tributario/exame_44.json'),
      45: require('../data/provas/tributario/exame_45.json'),
    },
    {
      25: require('../data/provas/tributario/exame_25v2.json'),
    }
  ),
};

export function getProvasDisponiveis(areaId: string): number[] {
  const area = slugArea(areaId);
  const bucket = provas[area] || {};

  return Object.keys(bucket)
    .map(Number)
    .filter((n) => !Number.isNaN(n))
    .sort((a, b) => b - a);
}

export function getProva(areaId: string, exame: string | number) {
  const area = slugArea(areaId);
  const numero = numExame(exame);
  const prova = provas?.[area]?.[numero];

  if (!prova) return null;

  const raw = prova?.default || prova;
  return normalizarProva(raw);
}