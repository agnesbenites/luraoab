import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator, FlatList
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

export default function QuestaoScreen({ route, navigation }) {
  const { user } = useAuth();
  const sessao = route?.params?.sessao ?? null;

  const [questao, setQuestao] = useState(null);
  const [loading, setLoading] = useState(true);
  const [respondida, setRespondida] = useState(false);
  const [opcaoSelecionada, setOpcaoSelecionada] = useState(null);
  const [filtro, setFiltro] = useState('todas');

  const [explicacao, setExplicacao] = useState('');
  const [artigosCitados, setArtigosCitados] = useState([]);
  const [loadingAI, setLoadingAI] = useState(false);
  const [loadingVade, setLoadingVade] = useState(false);
  const [modalVade, setModalVade] = useState(false);

  const [tempoSegundos, setTempoSegundos] = useState(0);
  const intervaloRef = useRef(null);

  useEffect(() => {
    fetchQuestao();
  }, [filtro]);

  useEffect(() => {
    if (!loading && questao) {
      iniciarCronometro();
    }
    return () => pararCronometro();
  }, [questao, loading]);

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

      // Busca IDs já respondidos nesta sessão para não repetir
      let idsRespondidos = [];
      if (sessao?.id) {
        const { data: respondidas } = await supabase
          .from('progresso')
          .select('questao_id')
          .eq('sessao_id', sessao.id);
        idsRespondidos = (respondidas ?? []).map(r => r.questao_id);
      }

      // Modo DIAGNÓSTICO
      if (sessao?.modo === 'diagnostico') {
        // Distribuição por disciplina do diagnóstico
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

        // Descobre qual disciplina buscar baseado no progresso atual
        const { data: respondidas } = await supabase
          .from('progresso')
          .select('questao_id, disciplina')
          .eq('sessao_id', sessao.id);

        const contagemPorDisc = {};
        (respondidas ?? []).forEach(r => {
          contagemPorDisc[r.disciplina] = (contagemPorDisc[r.disciplina] ?? 0) + 1;
        });

        const idsRespondidos = (respondidas ?? []).map(r => r.questao_id);

        // Acha a próxima disciplina que ainda tem cota disponível
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

      // Filtra pela sessão ou pelo filtro manual
      if (sessao?.modo === 'simulado_edicao' && sessao?.edicao) {
        query = query.eq('origem', sessao.edicao);
      } else if (sessao?.modo === 'por_materia' && sessao?.disciplina) {
        query = query.eq('disciplina', sessao.disciplina);
      } else if (filtro !== 'todas') {
        query = query.eq('disciplina', filtro);
      }

      // Exclui já respondidas nesta sessão
      if (idsRespondidos.length > 0) {
        query = query.not('id', 'in', `(${idsRespondidos.join(',')})`);
      }

      const { data } = await query.limit(80);

      if (data && data.length > 0) {
        setQuestao(data[Math.floor(Math.random() * data.length)]);
      } else {
        setQuestao(null); // Todas as questões da edição foram respondidas
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function salvarProgresso(foiAcerto) {
    try {
      pararCronometro();
      await supabase.from('progresso').insert([{
        questao_id: questao.id,
        disciplina: questao.disciplina,
        acertou: foiAcerto,
        tempo_segundos: tempoSegundos,
        user_id: user.id,
        sessao_id: sessao?.id ?? null,
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

        // Marca diagnóstico ou simulado completo como concluído ao atingir o limite
        if (sessao?.modo === 'diagnostico' || sessao?.modo === 'simulado_completo') {
          const limite = sessao.modo === 'diagnostico' ? 40 : 80;

          if (novoTotal >= limite) {
            await supabase
              .from('sessoes')
              .update({ diagnostico_concluido: true, concluida: true })
              .eq('id', sessao.id);
            
            // Atualiza a sessão local
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
    if (respondida) return;
    const foiAcerto = letra === questao.resposta_correta;
    setOpcaoSelecionada(letra);
    setRespondida(true);
    salvarProgresso(foiAcerto);
  };

  async function pedirLuraExplica() {
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
    try {
      const res = await groq.chat.completions.create({
        messages: [
          { role: "system", content: "Liste os artigos da lei seca fundamentais para esta questão. Formate cada artigo começando com 'Art.' e separe-os por uma quebra de linha." },
          { role: "user", content: `Questão: ${questao.enunciado}.` }
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

      {/* Cronômetro + Botão Voltar */}
      {!loading && questao && (
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
            <>
              <Text style={styles.sessaoInfo}>
                {sessao.questoes_respondidas ?? 0} respondidas
              </Text>
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
            </>
          )}
        </View>
      )}

      {/* Filtros por matéria */}
      {mostrarFiltros && (
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
        ) : !questao ? (
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
              <Text style={styles.origemText}>{questao.origem} • {questao.disciplina}</Text>
            </View>

            <View style={styles.enunciadoCard}>
              <Text style={styles.enunciadoTexto}>{questao.enunciado}</Text>
            </View>

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

            {respondida && (
              <View style={styles.actionsContainer}>
                <View style={styles.tempoGasto}>
                  <Text style={styles.tempoGastoText}>
                    Você levou <Text style={{ fontWeight: '800' }}>{formatarTempo(tempoSegundos)}</Text> nessa questão
                  </Text>
                </View>

                <View style={styles.rowButtons}>
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

                  <TouchableOpacity
                    style={[styles.btnAction, { backgroundColor: '#10B981' }]}
                    onPress={abrirVademecum}
                  >
                    <Text style={styles.btnActionText}>📚 LEI SECA</Text>
                  </TouchableOpacity>
                </View>

                {explicacao && !modalVade && (
                  <View style={styles.quickExplicacao}>
                    <Text style={styles.quickText}>{explicacao}</Text>
                  </View>
                )}

                <TouchableOpacity style={styles.btnNext} onPress={fetchQuestao}>
                  <Text style={styles.btnNextText}>PRÓXIMA QUESTÃO →</Text>
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
  emptyText: { fontSize: 15, fontWeight: 'bold', color: '#64748B' },
  btnVoltarCenter: { backgroundColor: '#EEF2FF', paddingVertical: 12, paddingHorizontal: 24,
    borderRadius: 12 },
  btnVoltarCenterText: { color: '#4F46E5', fontWeight: '700', fontSize: 14 },
  metaContainer: { marginTop: 20, marginBottom: 10 },
  origemText: { fontSize: 12, color: '#94A3B8', fontWeight: '700' },
  enunciadoCard: { marginBottom: 25 },
  enunciadoTexto: { fontSize: 17, color: '#1E293B', lineHeight: 26 },
  alternativasWrapper: { gap: 10 },
  opcaoCard: { flexDirection: 'row', backgroundColor: '#FFF', padding: 16, borderRadius: 14,
    borderWidth: 1.5, borderColor: '#F1F5F9', alignItems: 'center' },
  opcaoFoco: { borderColor: '#4F46E5' },
  opcaoSucesso: { borderColor: '#10B981', backgroundColor: '#F0FDF4' },
  opcaoFalha: { borderColor: '#EF4444', backgroundColor: '#FEF2F2' },
  letraContainer: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#F1F5F9',
    justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  letraSucesso: { backgroundColor: '#10B981' },
  letraFalha: { backgroundColor: '#EF4444' },
  letraLabel: { fontWeight: 'bold', color: '#64748B' },
  opcaoTexto: { flex: 1, fontSize: 15, color: '#334155', lineHeight: 20 },
  actionsContainer: { marginTop: 30, gap: 15 },
  tempoGasto: { backgroundColor: '#F8FAFC', borderRadius: 10, padding: 10, alignItems: 'center',
    borderWidth: 1, borderColor: '#E2E8F0' },
  tempoGastoText: { fontSize: 13, color: '#64748B' },
  rowButtons: { flexDirection: 'row', gap: 10 },
  btnAction: { flex: 1, padding: 18, borderRadius: 16, alignItems: 'center', justifyContent: 'center', elevation: 2 },
  btnActionText: { color: '#FFF', fontWeight: '800', fontSize: 12, letterSpacing: 1 },
  quickExplicacao: { backgroundColor: '#F5F3FF', padding: 15, borderRadius: 12,
    borderLeftWidth: 4, borderLeftColor: '#8B5CF6' },
  quickText: { color: '#4C1D95', fontSize: 14, lineHeight: 20 },
  btnNext: { backgroundColor: '#1E293B', padding: 18, borderRadius: 16, alignItems: 'center' },
  btnNextText: { color: '#FFF', fontWeight: '700' }
});