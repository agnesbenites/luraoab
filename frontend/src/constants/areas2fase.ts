export type Area = {
  id: string;
  nome: string;
  taxa: number;
  escolha: number;
  pecaPrincipal: string;
  dificuldade: 'Baixa' | 'Media' | 'Alta';
  descricao: string;
};

export const AREAS: Area[] = [
  {
    id: 'constitucional',
    nome: 'Direito Constitucional',
    taxa: 29.6,
    escolha: 8,
    pecaPrincipal: 'Mandado de Segurança / Ação Direta',
    dificuldade: 'Baixa',
    descricao: 'Menos reformas, legislação estável e peças bem definidas.',
  },
  {
    id: 'civil',
    nome: 'Direito Civil',
    taxa: 22.4,
    escolha: 15,
    pecaPrincipal: 'Petição Inicial / Contestação',
    dificuldade: 'Media',
    descricao: 'Ampla, mas previsível. Código Civil bem consolidado.',
  },
  {
    id: 'tributario',
    nome: 'Direito Tributário',
    taxa: 19.6,
    escolha: 9,
    pecaPrincipal: 'Mandado de Segurança / Exceção de Pré-Execução',
    dificuldade: 'Media',
    descricao: 'Técnico, mas com poucas súmulas-chave que caem com frequência.',
  },
  {
    id: 'administrativo',
    nome: 'Direito Administrativo',
    taxa: 19.2,
    escolha: 8,
    pecaPrincipal: 'Mandado de Segurança / Ação Popular',
    dificuldade: 'Media',
    descricao: 'A sobreposição com Constitucional facilita o estudo.',
  },
  {
    id: 'trabalho',
    nome: 'Direito do Trabalho',
    taxa: 17.9,
    escolha: 27,
    pecaPrincipal: 'Reclamação Trabalhista',
    dificuldade: 'Media',
    descricao: 'Muito escolhida, mas a CLT passa por reformas constantes.',
  },
  {
    id: 'penal',
    nome: 'Direito Penal',
    taxa: 17.7,
    escolha: 30,
    pecaPrincipal: 'Habeas Corpus / Resposta à Acusação',
    dificuldade: 'Alta',
    descricao: 'É a mais escolhida e a que menos aprova. Alta concorrência.',
  },
  {
    id: 'empresarial',
    nome: 'Direito Empresarial',
    taxa: 11.8,
    escolha: 3,
    pecaPrincipal: 'Petição Inicial / Recuperação Judicial',
    dificuldade: 'Alta',
    descricao: 'Tem a menor taxa de aprovação. Legislação complexa e esparsa.',
  },
];