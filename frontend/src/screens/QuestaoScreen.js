import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator, FlatList, TextInput, Alert
} from 'react-native';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import Groq from "groq-sdk";
import VadeModal from '../components/VadeModal';

const groq = new Groq({
  apiKey: process.env.EXPO_PUBLIC_GROQ_API_KEY,
  dangerouslyAllowBrowser: true
});

const DISCIPLINAS = [
  { id: 'todas', label: 'GERAL' },
  { id: 'Ética Profissional', label: 'ÉTICA' },
  { id: 'Direito Constitucional', label: 'CONST.' },
  { id: 'Direito Administrativo', label: 'ADM.' },
  { id: 'Direito Civil', label: 'CIVIL' },
  { id: 'Direito Processual Civil', label: 'PROC. CIVIL' },
  { id: 'Direito Penal', label: 'PENAL' },
  { id: 'Direito Processual Penal', label: 'PROC. PENAL' },
  { id: 'Direito do Trabalho', label: 'TRABALHO' },
  { id: 'Direito Processual do Trabalho', label: 'PROC. TRABALHO' },
  { id: 'Direito Tributário', label: 'TRIB.' },
  { id: 'Direito Empresarial', label: 'EMPRESARIAL' },
];

// Mapa de subtemas por disciplina para geração de questões direcionadas
const SUBTEMAS_POR_DISCIPLINA = {
  'Direito Constitucional': [
    'Direitos e garantias fundamentais', 'Organização dos poderes', 'Controle de constitucionalidade',
    'Federação e repartição de competências', 'Processo legislativo', 'Remédios constitucionais'
  ],
  'Direito Administrativo': [
    'Atos administrativos', 'Poderes da administração', 'Licitações e contratos', 'Agentes públicos',
    'Responsabilidade civil do Estado', 'Serviços públicos', 'Intervenção do Estado na propriedade'
  ],
  'Direito Civil': [
    'Teoria das obrigações', 'Contratos típicos e atípicos', 'Responsabilidade civil',
    'Direito das coisas', 'Direito de família', 'Direito das sucessões'
  ],
  'Direito Processual Civil': [
    'Petição inicial e requisitos', 'Tutelas provisórias', 'Recursos', 'Cumprimento de sentença',
    'Provas', 'Processo de execução', 'Ações constitucionais'
  ],
  'Direito Penal': [
    'Teoria do crime', 'Penalidades', 'Crimes contra a pessoa', 'Crimes contra o patrimônio',
    'Crimes contra a administração pública', 'Lei de drogas'
  ],
  'Direito Processual Penal': [
    'Inquérito policial', 'Ação penal', 'Medidas cautelares', 'Provas no processo penal',
    'Recursos', 'Execução penal', 'Tribunal do Júri'
  ],
  'Direito do Trabalho': [
    'Contrato de trabalho', 'Remuneração e salário', 'Jornada de trabalho', 'Rescisão contratual',
    'Estabilidade e garantias', 'Férias e 13º salário'
  ],
  'Direito Processual do Trabalho': [
    'Dissídio individual e coletivo', 'Recursos trabalhistas', 'Execução trabalhista',
    'Provas no processo do trabalho', 'Prazos processuais'
  ],
  'Direito Tributário': [
    'Princípios tributários', 'Impostos federais, estaduais e municipais', 'Obrigação tributária',
    'Crédito tributário e execução fiscal', 'Processo administrativo fiscal'
  ],
  'Direito Empresarial': [
    'Teoria da empresa', 'Sociedades empresárias', 'Títulos de crédito', 'Falência e recuperação judicial',
    'Registro empresarial', 'Propriedade industrial'
  ],
  'Ética Profissional': [
    'Estatuto da OAB', 'Código de Ética', 'Inscrição e registro', 'Publicidade e honorários',
    'Processo ético-disciplinar', 'Deveres e vedações'
  ]
};

export default function QuestaoScreen({ route, navigation }) {
  const { user } = useAuth();
  const sessao = route?.params?.sessao ?? null;

  const [questao, setQuestao] = useState(null);
  const [loading, setLoading] = useState(true);
  const [respondida, setRespondida] = useState(false);
  const [opcaoSelecionada, setOpcaoSelecionada] = useState(null);
  const [filtro, setFiltro] = useState('todas');

  // Estados para resposta dissertativa
  const [respostaAluno, setRespostaAluno] = useState('');
  const [corrigindo, setCorrigindo] = useState(false);
  const [correcao, setCorrecao] = useState(null);
  
  // Estados para geração de questão discursiva por IA
  const [gerandoDiscursiva, setGerandoDiscursiva] = useState(false);
  const [questaoGerada, setQuestaoGerada] = useState(null);
  const [modoDiscursivaIA, setModoDiscursivaIA] = useState(false);

  const [explicacao, setExplicacao] = useState('');
  const [artigosCitados, setArtigosCitados] = useState([]);
  const [loadingAI, setLoadingAI] = useState(false);
  const [loadingVade, setLoadingVade] = useState(false);
  const [modalVade, setModalVade] = useState(false);

  const [tempoSegundos, setTempoSegundos] = useState(0);
  const intervaloRef = useRef(null);

  // Obter disciplina atual para geração
  const getDisciplinaAtual = () => {
    if (modoDiscursivaIA && questaoGerada) {
      return questaoGerada.disciplina;
    }
    if (sessao?.disciplina) return sessao.disciplina;
    if (filtro !== 'todas') return filtro;
    return questao?.disciplina || null;
  };

  useEffect(() => {
    fetchQuestao();
  }, [filtro]);

  useEffect(() => {
    if (!loading && (questao || questaoGerada)) {
      iniciarCronometro();
      setRespostaAluno('');
      setCorrecao(null);
    }
    return () => pararCronometro();
  }, [questao, questaoGerada, loading]);

  function iniciarCronometro() {
    pararCronometro();
    setTempoSegundos(0);
    intervaloRef.current = setInterval(() => {
      setTempoSegundos(t => t + 1);
    }, 1000);
  }

  function pararCronometro() {
    if (intervaloRef.current) {
      clearInterval(intervaloRef.current);
      intervaloRef.current = null;
    }
  }

  function formatarTempo(seg) {
    const m = Math.floor(seg / 60).toString().padStart(2, '0');
    const s = (seg % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  async function fetchQuestao() {
    try {
      setLoading(true);
      setRespondida(false);
      setOpcaoSelecionada(null);
      setExplicacao('');
      setArtigosCitados([]);
      setRespostaAluno('');
      setCorrecao(null);
      setModoDiscursivaIA(false);
      setQuestaoGerada(null);

      let idsRespondidos = [];
      if (sessao?.id) {
        const { data: respondidas } = await supabase
          .from('progresso')
          .select('questao_id')
          .eq('sessao_id', sessao.id);
        idsRespondidos = (respondidas ?? []).map(r => r.questao_id);
      }

      if (sessao?.modo === 'diagnostico') {
        const DISTRIBUICAO = [
          { disciplina: 'Ética Profissional', qtd: 5 },
          { disciplina: 'Direito Civil', qtd: 5 },
          { disciplina: 'Direito Constitucional', qtd: 5 },
          { disciplina: 'Direito Administrativo', qtd: 4 },
          { disciplina: 'Direito Penal', qtd: 4 },
          { disciplina: 'Direito do Trabalho', qtd: 4 },
          { disciplina: 'Direito Empresarial', qtd: 4 },
          { disciplina: 'Direito Processual Civil', qtd: 4 },
          { disciplina: 'Direito Tributário', qtd: 5 },
        ];

        const { data: respondidas } = await supabase
          .from('progresso')
          .select('questao_id, disciplina')
          .eq('sessao_id', sessao.id);

        const contagemPorDisc = {};
        (respondidas ?? []).forEach(r => {
          contagemPorDisc[r.disciplina] = (contagemPorDisc[r.disciplina] ?? 0) + 1;
        });

        const idsRespondidos = (respondidas ?? []).map(r => r.questao_id);
        const proxDisc = DISTRIBUICAO.find(d =>
          (contagemPorDisc[d.disciplina] ?? 0) < d.qtd
        );

        if (!proxDisc) { 
          setQuestao(null); 
          setLoading(false); 
          return; 
        }

        let q = supabase
          .from('questoes')
          .select('*')
          .eq('disciplina', proxDisc.disciplina);

        if (idsRespondidos.length > 0) {
          q = q.not('id', 'in', `(${idsRespondidos.join(',')})`);
        }

        const { data: qData } = await q.limit(30);
        if (qData && qData.length > 0) {
          setQuestao(qData[Math.floor(Math.random() * qData.length)]);
        } else {
          setQuestao(null);
        }
        setLoading(false);
        return;
      }

      let query = supabase.from('questoes').select('*');

      if (sessao?.modo === 'simulado_edicao' && sessao?.edicao) {
        query = query.eq('origem', sessao.edicao);
      } else if (sessao?.modo === 'por_materia' && sessao?.disciplina) {
        query = query.eq('disciplina', sessao.disciplina);
      } else if (filtro !== 'todas') {
        query = query.eq('disciplina', filtro);
      }

      if (idsRespondidos.length > 0) {
        query = query.not('id', 'in', `(${idsRespondidos.join(',')})`);
      }

      const { data } = await query.limit(80);

      if (data && data.length > 0) {
        setQuestao(data[Math.floor(Math.random() * data.length)]);
      } else {
        setQuestao(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // Gerar questão discursiva por IA
  async function gerarQuestaoDiscursiva() {
    const disciplinaAtual = getDisciplinaAtual();
    
    if (!disciplinaAtual || disciplinaAtual === 'todas') {
      Alert.alert(
        'Selecione uma matéria',
        'Para gerar uma questão discursiva, primeiro selecione uma disciplina específica no filtro acima.',
        [{ text: 'OK' }]
      );
      return;
    }

    setGerandoDiscursiva(true);
    
    try {
      const subtemas = SUBTEMAS_POR_DISCIPLINA[disciplinaAtual] || ['Temas gerais da matéria'];
      const subtemaAleatorio = subtemas[Math.floor(Math.random() * subtemas.length)];

      const res = await groq.chat.completions.create({
        messages: [
          { 
            role: "system", 
            content: `Você é um examinador da OAB. Crie uma questão discursiva de nível avançado sobre ${disciplinaAtual}, focando especificamente em: ${subtemaAleatorio}.

A questão deve:
1. Apresentar um caso prático realista
2. Cobrar conhecimento específico da legislação
3. Exigir argumentação jurídica fundamentada
4. Ter entre 3 a 5 linhas de enunciado

Retorne APENAS o enunciado da questão, sem explicações adicionais.` 
          }
        ],
        model: "llama-3.3-70b-versatile",
      });

      const enunciadoGerado = res.choices[0].message.content;
      
      // Gerar também um espelho de correção para esta questão
      const resEspelho = await groq.chat.completions.create({
        messages: [
          { 
            role: "system", 
            content: `Com base na questão abaixo, crie um ESPELHO DE CORREÇÃO para a OAB contendo:
1. OS PONTOS OBRIGATÓRIOS que o candidato deve abordar
2. A LEGISLAÇÃO APLICÁVEL (artigos específicos)
3. OS FUNDAMENTOS JURÍDICOS esperados

Seja objetivo e direto, como uma banca examinadora.` 
          },
          { role: "user", content: enunciadoGerado }
        ],
        model: "llama-3.3-70b-versatile",
      });

      setQuestaoGerada({
        enunciado: enunciadoGerado,
        disciplina: disciplinaAtual,
        espelhoCorrecao: resEspelho.choices[0].message.content,
        origem: 'IA Generator',
        tipo: 'discursiva_ia'
      });
      
      setModoDiscursivaIA(true);
      setRespondida(false);
      setCorrecao(null);
      setRespostaAluno('');
      
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Não foi possível gerar a questão. Tente novamente.');
    } finally {
      setGerandoDiscursiva(false);
    }
  }

  async function salvarProgresso(foiAcerto, tipo = 'multipla_escolha') {
    try {
      pararCronometro();
      await supabase.from('progresso').insert([{
        questao_id: modoDiscursivaIA ? null : questao?.id,
        disciplina: modoDiscursivaIA ? questaoGerada?.disciplina : questao?.disciplina,
        acertou: foiAcerto,
        tempo_segundos: tempoSegundos,
        user_id: user.id,
        sessao_id: sessao?.id ?? null,
        tipo: tipo,
        ...(modoDiscursivaIA && { questao_texto: questaoGerada?.enunciado })
      }]);

      if (sessao?.id) {
        const novoTotal = (sessao.questoes_respondidas ?? 0) + 1;
        
        await supabase
          .from('sessoes')
          .update({
            questoes_respondidas: novoTotal,
            atualizada_em: new Date().toISOString(),
          })
          .eq('id', sessao.id);

        if (sessao?.modo === 'diagnostico' || sessao?.modo === 'simulado_completo') {
          const limite = sessao.modo === 'diagnostico' ? 40 : 80;

          if (novoTotal >= limite) {
            await supabase
              .from('sessoes')
              .update({ diagnostico_concluido: true, concluida: true })
              .eq('id', sessao.id);
            
            sessao.diagnostico_concluido = true;
            sessao.concluida = true;
          }
        }
      }
    } catch (err) {
      console.error('Erro ao salvar progresso:', err);
    }
  }

  const validarResposta = (letra) => {
    if (respondida || modoDiscursivaIA) return;
    const foiAcerto = letra === questao.resposta_correta;
    setOpcaoSelecionada(letra);
    setRespondida(true);
    salvarProgresso(foiAcerto, 'multipla_escolha');
  };

  async function corrigirRespostaDissertativa() {
    if (!respostaAluno.trim()) {
      Alert.alert('Atenção', 'Digite sua resposta antes de corrigir');
      return;
    }

    setCorrigindo(true);
    setCorrecao(null);

    const questaoAtual = modoDiscursivaIA ? questaoGerada : questao;
    
    try {
      let promptSistema = `Você é um corretor da prova da OAB. Analise a resposta do aluno e forneça:

1. NOTA SUGERIDA: Dê uma nota de 0 a 10 baseada nos critérios da OAB
2. ESPELHO ESPERADO: O que a banca esperava como resposta completa
3. ACERTOS: Pontos que o aluno acertou
4. OMISSÕES: Pontos importantes que faltaram
5. MELHORIA DE REDAÇÃO JURÍDICA: Sugestões específicas

Seja objetivo, construtivo e específico. Use formatação clara com emojis.`;

      let conteudoUsuario = `QUESTÃO: ${questaoAtual.enunciado}\n\nRESPOSTA DO ALUNO: ${respostaAluno}`;

      if (modoDiscursivaIA && questaoGerada?.espelhoCorrecao) {
        conteudoUsuario += `\n\nESPELHO DE CORREÇÃO OFICIAL:\n${questaoGerada.espelhoCorrecao}`;
      } else if (!modoDiscursivaIA && questao?.resposta_correta) {
        conteudoUsuario += `\n\nALTERNATIVA CORRETA: ${questao.resposta_correta}\nRESPOSTA CORRETA ESPERADA: ${questao[`alternativa_${questao.resposta_correta.toLowerCase()}`]}`;
      }

      const res = await groq.chat.completions.create({
        messages: [
          { role: "system", content: promptSistema },
          { role: "user", content: conteudoUsuario }
        ],
        model: "llama-3.3-70b-versatile",
      });

      const textoCorrecao = res.choices[0].message.content;
      
      const sections = {
        nota: '',
        espelho: '',
        acertos: '',
        omissoes: '',
        melhoria: ''
      };

      const lines = textoCorrecao.split('\n');
      let currentSection = '';
      
      for (const line of lines) {
        if (line.includes('NOTA SUGERIDA') || line.includes('🎯')) {
          currentSection = 'nota';
          sections.nota += line + '\n';
        } else if (line.includes('ESPELHO ESPERADO') || line.includes('📋')) {
          currentSection = 'espelho';
          sections.espelho += line + '\n';
        } else if (line.includes('ACERTOS') || line.includes('✅')) {
          currentSection = 'acertos';
          sections.acertos += line + '\n';
        } else if (line.includes('OMISSÕES') || line.includes('❌')) {
          currentSection = 'omissoes';
          sections.omissoes += line + '\n';
        } else if (line.includes('MELHORIA') || line.includes('📝')) {
          currentSection = 'melhoria';
          sections.melhoria += line + '\n';
        } else if (currentSection && line.trim()) {
          sections[currentSection] += line + '\n';
        }
      }

      setCorrecao(sections);
      setRespondida(true);
      
      if (modoDiscursivaIA && !respondida) {
        await salvarProgresso(null, 'discursiva_ia');
      }
      
    } catch (err) {
      console.error(err);
      setCorrecao({
        nota: '⚠️ Erro na correção',
        espelho: 'Não foi possível gerar a correção no momento.',
        acertos: 'Tente novamente mais tarde.',
        omissoes: '',
        melhoria: ''
      });
    } finally {
      setCorrigindo(false);
    }
  }

  async function pedirLuraExplica() {
    if (modoDiscursivaIA) {
      Alert.alert('Modo Discursiva', 'Para questões discursivas, utilize a correção com IA acima para obter feedback detalhado.');
      return;
    }
    
    try {
      setLoadingAI(true);
      const res = await groq.chat.completions.create({
        messages: [
          { role: "system", content: "Aja como uma professora da OAB. Explique de forma muito curta e direta por que a alternativa está correta." },
          { role: "user", content: `Questão: ${questao.enunciado}. Correta: ${questao.resposta_correta}.` }
        ],
        model: "llama-3.3-70b-versatile",
      });
      setExplicacao(res.choices[0].message.content);
    } catch (err) {
      setExplicacao("Erro na consulta rápida.");
    } finally {
      setLoadingAI(false);
    }
  }

  async function abrirVademecum() {
    setModalVade(true);
    setLoadingVade(true);
    setExplicacao('');
    
    const questaoAtual = modoDiscursivaIA ? questaoGerada : questao;
    
    try {
      const res = await groq.chat.completions.create({
        messages: [
          { role: "system", content: "Liste os artigos da lei seca fundamentais para esta questão. Formate cada artigo começando com 'Art.' e separe-os por uma quebra de linha." },
          { role: "user", content: `Questão: ${questaoAtual.enunciado}.` }
        ],
        model: "llama-3.3-70b-versatile",
      });
      const lista = res.choices[0].message.content
        .split('\n')
        .filter(line => line.trim() !== '');
      setArtigosCitados(lista);
    } catch (err) {
      setArtigosCitados(["Erro ao carregar legislação."]);
    } finally {
      setLoadingVade(false);
    }
  }

  async function explicarArtigoNoVade(artigo) {
    setLoadingVade(true);
    try {
      const res = await groq.chat.completions.create({
        messages: [
          { role: "system", content: "Compare a doutrina e jurisprudência deste artigo especificamente, citando autores populares da OAB." },
          { role: "user", content: artigo }
        ],
        model: "llama-3.3-70b-versatile",
      });
      setExplicacao(res.choices[0].message.content);
    } catch (err) {
      setExplicacao("Erro na análise doutrinária.");
    } finally {
      setLoadingVade(false);
    }
  }

  const mostrarFiltros = !sessao || sessao.modo === 'aleatorio' || sessao.modo === 'por_materia';
  const questaoAtual = modoDiscursivaIA ? questaoGerada : questao;
  const disciplinaAtual = getDisciplinaAtual();
  const podeGerarDiscursiva = disciplinaAtual && disciplinaAtual !== 'todas';

  return (
    <View style={styles.safeContainer}>
      <VadeModal
        visivel={modalVade}
        fechar={() => setModalVade(false)}
        artigos={artigosCitados}
        aoExplicarArtigo={explicarArtigoNoVade}
        loadingArtigo={loadingVade}
        conteudo={explicacao}
      />

      {!loading && questaoAtual && (
        <View style={styles.cronometroBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.btnVoltar}>
            <Text style={styles.btnVoltarText}>← Home</Text>
          </TouchableOpacity>
          <Text style={[
            styles.cronometroText,
            tempoSegundos > 120 && { color: '#EF4444' },
            tempoSegundos > 60 && tempoSegundos <= 120 && { color: '#F59E0B' },
          ]}>
            ⏱ {formatarTempo(tempoSegundos)}
          </Text>
          {sessao && (
            <Text style={styles.sessaoInfo}>
              {sessao.questoes_respondidas ?? 0} respondidas
            </Text>
          )}
          {sessao?.modo === 'diagnostico' && (
            <View style={styles.diagnosticoBanner}>
              <Text style={styles.diagnosticoText}>
                🩺 {sessao.questoes_respondidas ?? 0}/40
              </Text>
              <View style={styles.diagnosticoBarraFundo}>
                <View style={[
                  styles.diagnosticoBarraPreenchida,
                  { width: `${((sessao.questoes_respondidas ?? 0) / 40) * 100}%` }
                ]} />
              </View>
            </View>
          )}
        </View>
      )}

      {mostrarFiltros && !modoDiscursivaIA && (
        <View style={styles.headerFiltros}>
          <FlatList
            data={DISCIPLINAS}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.filtroBadge, filtro === item.id && styles.filtroAtivo]}
                onPress={() => setFiltro(item.id)}
              >
                <Text style={[styles.filtroLabel, filtro === item.id && styles.filtroLabelAtivo]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            )}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtrosList}
          />
        </View>
      )}

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#4F46E5" />
          </View>
        ) : !questaoAtual ? (
          <View style={styles.center}>
            <Text style={styles.emptyText}>⚖️ Nenhuma questão encontrada.</Text>
            {sessao?.modo === 'diagnostico' && (
              <Text style={styles.diagnosticoConcluidoText}>
                ✅ Diagnóstico concluído! Volte para a home e veja seu boletim de revisão.
              </Text>
            )}
            {sessao?.modo === 'simulado_completo' && (
              <Text style={styles.diagnosticoConcluidoText}>
                🏆 Simulado completo finalizado! Volte para a home e veja seu desempenho.
              </Text>
            )}
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.btnVoltarCenter}>
              <Text style={styles.btnVoltarCenterText}>← Voltar para Home</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.metaContainer}>
              <Text style={styles.origemText}>
                {questaoAtual.origem || 'IA Generator'} • {questaoAtual.disciplina}
                {modoDiscursivaIA && ' • 🧠 Questão Gerada por IA'}
              </Text>
            </View>

            <View style={styles.enunciadoCard}>
              <Text style={styles.enunciadoTexto}>{questaoAtual.enunciado}</Text>
            </View>

            {!modoDiscursivaIA && (
              <View style={styles.alternativasWrapper}>
                {['A', 'B', 'C', 'D'].map((letra) => {
                  const isCorreta = respondida && letra === questao.resposta_correta;
                  const isErrada = respondida && opcaoSelecionada === letra && letra !== questao.resposta_correta;
                  return (
                    <TouchableOpacity
                      key={letra}
                      onPress={() => validarResposta(letra)}
                      style={[
                        styles.opcaoCard,
                        opcaoSelecionada === letra && styles.opcaoFoco,
                        isCorreta && styles.opcaoSucesso,
                        isErrada && styles.opcaoFalha,
                        respondida && letra !== questao.resposta_correta && letra !== opcaoSelecionada && { opacity: 0.4 }
                      ]}
                    >
                      <View style={[styles.letraContainer, isCorreta && styles.letraSucesso, isErrada && styles.letraFalha]}>
                        <Text style={[styles.letraLabel, (isCorreta || isErrada) && { color: '#FFF' }]}>{letra}</Text>
                      </View>
                      <Text style={styles.opcaoTexto}>{questao[`alternativa_${letra.toLowerCase()}`]}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            {/* Seção de Resposta Dissertativa */}
            <View style={styles.respostaDissertativaContainer}>
              <Text style={styles.respostaDissertativaTitle}>
                {modoDiscursivaIA ? '📝 Sua Resposta Dissertativa' : '📝 Pratique com Resposta Dissertativa'}
              </Text>
              <TextInput
                style={styles.respostaInput}
                multiline
                numberOfLines={8}
                placeholder={modoDiscursivaIA 
                  ? "Escreva sua resposta dissertativa aqui. A IA irá corrigir baseada no espelho de correção..." 
                  : "Que tal treinar também sua argumentação? Escreva uma resposta dissertativa para esta questão e corrija com IA!"}
                placeholderTextColor="#94A3B8"
                value={respostaAluno}
                onChangeText={setRespostaAluno}
              />
              
              <TouchableOpacity 
                style={styles.btnCorrigirIA}
                onPress={corrigirRespostaDissertativa}
                disabled={corrigindo}
              >
                {corrigindo ? (
                  <ActivityIndicator color="#FFF" size="small" />
                ) : (
                  <Text style={styles.btnCorrigirIAText}>🤖 CORRIGIR COM IA</Text>
                )}
              </TouchableOpacity>

              {correcao && (
                <View style={styles.correcaoContainer}>
                  <Text style={styles.correcaoTitle}>📊 RESULTADO DA CORREÇÃO</Text>
                  
                  {correcao.nota && (
                    <View style={styles.correcaoSection}>
                      <Text style={styles.correcaoSectionTitle}>🎯 {correcao.nota.split('\n')[0]}</Text>
                      {correcao.nota.split('\n').slice(1).map((line, i) => (
                        <Text key={i} style={styles.correcaoText}>{line}</Text>
                      ))}
                    </View>
                  )}

                  {correcao.espelho && (
                    <View style={styles.correcaoSection}>
                      <Text style={styles.correcaoSectionTitle}>📋 O QUE A BANCA ESPERAVA</Text>
                      {correcao.espelho.split('\n').map((line, i) => (
                        <Text key={i} style={styles.correcaoText}>{line}</Text>
                      ))}
                    </View>
                  )}

                  {correcao.acertos && (
                    <View style={styles.correcaoSection}>
                      <Text style={styles.correcaoSectionTitle}>✅ SEUS ACERTOS</Text>
                      {correcao.acertos.split('\n').map((line, i) => (
                        <Text key={i} style={styles.correcaoText}>{line}</Text>
                      ))}
                    </View>
                  )}

                  {correcao.omissoes && (
                    <View style={styles.correcaoSection}>
                      <Text style={styles.correcaoSectionTitle}>❌ PONTOS QUE FALTARAM</Text>
                      {correcao.omissoes.split('\n').map((line, i) => (
                        <Text key={i} style={styles.correcaoText}>{line}</Text>
                      ))}
                    </View>
                  )}

                  {correcao.melhoria && (
                    <View style={styles.correcaoSection}>
                      <Text style={styles.correcaoSectionTitle}>📝 COMO MELHORAR</Text>
                      {correcao.melhoria.split('\n').map((line, i) => (
                        <Text key={i} style={styles.correcaoText}>{line}</Text>
                      ))}
                    </View>
                  )}
                </View>
              )}
            </View>

            {/* Botão para gerar nova questão discursiva por IA */}
            <TouchableOpacity 
              style={[styles.btnGerarDiscursiva, !podeGerarDiscursiva && styles.btnGerarDiscursivaDisabled]}
              onPress={gerarQuestaoDiscursiva}
              disabled={gerandoDiscursiva || !podeGerarDiscursiva}
            >
              {gerandoDiscursiva ? (
                <ActivityIndicator color="#FFF" size="small" />
              ) : (
                <>
                  <Text style={styles.btnGerarDiscursivaText}>🧠 GERAR QUESTÃO DISCURSIVA</Text>
                  <Text style={styles.btnGerarDiscursivaSubtext}>
                    {podeGerarDiscursiva 
                      ? `Baseada em ${disciplinaAtual}` 
                      : 'Selecione uma matéria no filtro acima'}
                  </Text>
                </>
              )}
            </TouchableOpacity>

            {respondida && (
              <View style={styles.actionsContainer}>
                <View style={styles.tempoGasto}>
                  <Text style={styles.tempoGastoText}>
                    Você levou <Text style={{ fontWeight: '800' }}>{formatarTempo(tempoSegundos)}</Text> nessa questão
                  </Text>
                </View>

                <View style={styles.rowButtons}>
                  {!modoDiscursivaIA && (
                    <TouchableOpacity
                      style={[styles.btnAction, { backgroundColor: '#8B5CF6' }]}
                      onPress={pedirLuraExplica}
                      disabled={loadingAI}
                    >
                      {loadingAI
                        ? <ActivityIndicator color="#FFF" />
                        : <Text style={styles.btnActionText}>✨ LURA EXPLICA</Text>
                      }
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    style={[styles.btnAction, { backgroundColor: '#10B981' }]}
                    onPress={abrirVademecum}
                  >
                    <Text style={styles.btnActionText}>📚 LEI SECA</Text>
                  </TouchableOpacity>
                </View>

                {explicacao && !modalVade && !modoDiscursivaIA && (
                  <View style={styles.quickExplicacao}>
                    <Text style={styles.quickText}>{explicacao}</Text>
                  </View>
                )}

                <TouchableOpacity 
                  style={styles.btnNext} 
                  onPress={modoDiscursivaIA ? gerarQuestaoDiscursiva : fetchQuestao}
                >
                  <Text style={styles.btnNextText}>
                    {modoDiscursivaIA ? 'NOVA DISCURSIVA →' : 'PRÓXIMA QUESTÃO →'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            <View style={{ height: 40 }} />
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: '#F8FAFC' },
  cronometroBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 52, paddingBottom: 8, backgroundColor: '#FFF',
    borderBottomWidth: 1, borderBottomColor: '#E2E8F0', position: 'relative' },
  btnVoltar: { paddingVertical: 4, paddingHorizontal: 8 },
  btnVoltarText: { fontSize: 14, fontWeight: '700', color: '#4F46E5' },
  cronometroText: { fontSize: 16, fontWeight: '800', color: '#10B981' },
  sessaoInfo: { fontSize: 12, color: '#94A3B8', fontWeight: '600' },
  diagnosticoBanner: {
    position: 'absolute', bottom: -28, left: 0, right: 0,
    paddingHorizontal: 20, paddingVertical: 6,
    backgroundColor: '#FDF2F8', borderBottomWidth: 1, borderBottomColor: '#FBCFE8',
    flexDirection: 'row', alignItems: 'center', gap: 10,
  },
  diagnosticoText: { fontSize: 11, fontWeight: '800', color: '#BE185D', width: 48 },
  diagnosticoBarraFundo: { flex: 1, height: 4, backgroundColor: '#FCE7F3', borderRadius: 4 },
  diagnosticoBarraPreenchida: { height: 4, borderRadius: 4, backgroundColor: '#BE185D' },
  diagnosticoConcluidoText: { fontSize: 14, color: '#BE185D', textAlign: 'center', marginTop: 8, fontWeight: '600' },
  headerFiltros: { backgroundColor: '#FFF', paddingVertical: 14 },
  filtrosList: { paddingHorizontal: 20, gap: 8 },
  filtroBadge: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
    backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#E2E8F0' },
  filtroAtivo: { backgroundColor: '#4F46E5', borderColor: '#4F46E5' },
  filtroLabel: { fontSize: 11, fontWeight: '800', color: '#64748B' },
  filtroLabelAtivo: { color: '#FFF' },
  container: { flex: 1, paddingHorizontal: 20 },
  center: { height: 500, justifyContent: 'center', alignItems: 'center', gap: 16 },
  emptyText: { fontSize: 16, fontWeight: 'bold', color: '#475569' },
  btnVoltarCenter: { backgroundColor: '#EEF2FF', paddingVertical: 12, paddingHorizontal: 24,
    borderRadius: 12 },
  btnVoltarCenterText: { color: '#4F46E5', fontWeight: '700', fontSize: 14 },
  metaContainer: { marginTop: 20, marginBottom: 10 },
  origemText: { fontSize: 13, color: '#64748B', fontWeight: '700', letterSpacing: 0.5 },
  enunciadoCard: { marginBottom: 25 },
  enunciadoTexto: { fontSize: 17, fontWeight: '500', color: '#0F172A', lineHeight: 28, letterSpacing: -0.3 },
  alternativasWrapper: { gap: 12 },
  opcaoCard: { flexDirection: 'row', backgroundColor: '#FFF', padding: 18, borderRadius: 16,
    borderWidth: 1.5, borderColor: '#E2E8F0', alignItems: 'center' },
  opcaoFoco: { borderColor: '#6366F1', borderWidth: 2 },
  opcaoSucesso: { borderColor: '#10B981', backgroundColor: '#F0FDF4' },
  opcaoFalha: { borderColor: '#EF4444', backgroundColor: '#FEF2F2' },
  letraContainer: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#F1F5F9',
    justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  letraSucesso: { backgroundColor: '#10B981' },
  letraFalha: { backgroundColor: '#EF4444' },
  letraLabel: { fontWeight: '800', fontSize: 16, color: '#475569' },
  opcaoTexto: { flex: 1, fontSize: 15, fontWeight: '500', color: '#1E293B', lineHeight: 22 },
  
  respostaDissertativaContainer: { marginTop: 32, marginBottom: 16 },
  respostaDissertativaTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A', marginBottom: 12 },
  respostaInput: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, 
    fontSize: 15, lineHeight: 24, color: '#0F172A', borderWidth: 1.5, borderColor: '#E2E8F0',
    textAlignVertical: 'top', minHeight: 160 },
  btnCorrigirIA: { backgroundColor: '#6366F1', borderRadius: 16, padding: 16, alignItems: 'center',
    marginTop: 12, shadowColor: '#4F46E5', shadowOpacity: 0.2, shadowRadius: 8, elevation: 3 },
  btnCorrigirIAText: { color: '#FFF', fontWeight: '800', fontSize: 14, letterSpacing: 0.8 },
  correcaoContainer: { marginTop: 20, backgroundColor: '#F1F5F9', borderRadius: 16, padding: 16, gap: 16 },
  correcaoTitle: { fontSize: 14, fontWeight: '800', color: '#475569', textAlign: 'center', letterSpacing: 1 },
  correcaoSection: { backgroundColor: '#FFF', borderRadius: 12, padding: 16 },
  correcaoSectionTitle: { fontSize: 15, fontWeight: '800', color: '#0F172A', marginBottom: 12 },
  correcaoText: { fontSize: 14, lineHeight: 22, color: '#334155', marginBottom: 6 },
  
  btnGerarDiscursiva: { backgroundColor: '#8B5CF6', borderRadius: 16, padding: 18, alignItems: 'center',
    marginTop: 16, marginBottom: 8, shadowColor: '#7C3AED', shadowOpacity: 0.2, shadowRadius: 8, elevation: 3 },
  btnGerarDiscursivaDisabled: { backgroundColor: '#A78BFA', opacity: 0.6 },
  btnGerarDiscursivaText: { color: '#FFF', fontWeight: '800', fontSize: 14, letterSpacing: 0.8 },
  btnGerarDiscursivaSubtext: { color: '#E9D5FF', fontSize: 11, marginTop: 6, fontWeight: '600' },
  
  actionsContainer: { marginTop: 30, gap: 15 },
  tempoGasto: { backgroundColor: '#F8FAFC', borderRadius: 10, padding: 10, alignItems: 'center',
    borderWidth: 1, borderColor: '#E2E8F0' },
  tempoGastoText: { fontSize: 13, color: '#64748B', fontWeight: '600' },
  rowButtons: { flexDirection: 'row', gap: 10 },
  btnAction: { flex: 1, padding: 18, borderRadius: 16, alignItems: 'center', justifyContent: 'center', elevation: 2 },
  btnActionText: { color: '#FFF', fontWeight: '800', fontSize: 12, letterSpacing: 1 },
  quickExplicacao: { backgroundColor: '#F5F3FF', padding: 15, borderRadius: 12,
    borderLeftWidth: 4, borderLeftColor: '#8B5CF6' },
  quickText: { color: '#4C1D95', fontSize: 14, lineHeight: 20, fontWeight: '500' },
  btnNext: { backgroundColor: '#1E293B', padding: 18, borderRadius: 16, alignItems: 'center' },
  btnNextText: { color: '#FFF', fontWeight: '700', fontSize: 15 }
});