import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.EXPO_PUBLIC_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

export default function ConfigScreen() {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);
  const [geral, setGeral] = useState({ total: 0, acertos: 0, tempoMedio: 0 });
  const [questoesDificeis, setQuestoesDificeis] = useState([]);
  const [boletim, setBoletim] = useState('');
  const [loadingBoletim, setLoadingBoletim] = useState(false);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    setLoading(true);
    await Promise.all([buscarStatsPorMateria(), buscarQuestoesDificeis()]);
    setLoading(false);
  }

  async function buscarStatsPorMateria() {
    const { data } = await supabase
      .from('progresso')
      .select('disciplina, acertou, tempo_segundos')
      .eq('user_id', user.id);

    if (!data || data.length === 0) return;

    const mapa = {};
    data.forEach(({ disciplina, acertou, tempo_segundos }) => {
      if (!disciplina) return;
      if (!mapa[disciplina]) mapa[disciplina] = { total: 0, acertos: 0, tempos: [] };
      mapa[disciplina].total += 1;
      if (acertou) mapa[disciplina].acertos += 1;
      if (tempo_segundos > 0) mapa[disciplina].tempos.push(tempo_segundos);
    });

    const resultado = Object.entries(mapa).map(([disciplina, v]) => ({
      disciplina,
      total: v.total,
      acertos: v.acertos,
      taxa: Math.round((v.acertos / v.total) * 100),
      tempoMedio: v.tempos.length > 0
        ? Math.round(v.tempos.reduce((a, b) => a + b, 0) / v.tempos.length)
        : 0,
    })).sort((a, b) => a.taxa - b.taxa); // pior primeiro

    setStats(resultado);

    const totalGeral = data.length;
    const acertosGeral = data.filter(p => p.acertou).length;
    const todosTempos = data.filter(p => p.tempo_segundos > 0).map(p => p.tempo_segundos);
    setGeral({
      total: totalGeral,
      acertos: acertosGeral,
      tempoMedio: todosTempos.length > 0
        ? Math.round(todosTempos.reduce((a, b) => a + b, 0) / todosTempos.length)
        : 0,
    });
  }

  async function buscarQuestoesDificeis() {
    const { data } = await supabase
      .from('progresso')
      .select('questao_id, tempo_segundos, disciplina, acertou')
      .eq('user_id', user.id)
      .gt('tempo_segundos', 0)
      .order('tempo_segundos', { ascending: false })
      .limit(5);
    setQuestoesDificeis(data ?? []);
  }

  async function gerarBoletimRevisao() {
    setLoadingBoletim(true);
    setBoletim('');
    try {
      const { data: erros } = await supabase
        .from('progresso')
        .select('disciplina, acertou, questoes(enunciado)')
        .eq('user_id', user.id)
        .eq('acertou', false);

      if (!erros || erros.length === 0) {
        setBoletim('🎉 Você ainda não tem erros registrados. Continue respondendo questões!');
        setLoadingBoletim(false);
        return;
      }

      // Agrupa erros por disciplina
      const porDisciplina = {};
      erros.forEach(({ disciplina, questoes }) => {
        if (!porDisciplina[disciplina]) porDisciplina[disciplina] = [];
        if (questoes?.enunciado) {
          porDisciplina[disciplina].push(questoes.enunciado.slice(0, 100) + '...');
        }
      });

      const resumo = Object.entries(porDisciplina)
        .sort((a, b) => b[1].length - a[1].length)
        .map(([disc, qs]) =>
          `• ${disc}: ${qs.length} erro(s)\n  Ex: "${qs[0] ?? ''}"`
        ).join('\n');

      const taxaGeral = geral.total > 0
        ? Math.round((geral.acertos / geral.total) * 100) : 0;

      const res = await groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `Você é uma tutora especialista na OAB 1ª fase, direta e motivadora.
Analise os erros do candidato e gere um boletim de revisão personalizado.
Estruture assim:
1. 📊 Diagnóstico rápido (2 frases sobre o desempenho atual)
2. 🎯 Top 3 prioridades de revisão (disciplinas com mais erros, com 2-3 temas específicos cada)
3. 📅 Plano de ação (quantas questões por dia e em quais matérias focar)
4. 💪 Frase motivadora final
Use emojis, seja direta. Máximo 350 palavras.`,
          },
          {
            role: 'user',
            content: `Meu desempenho:
- Questões respondidas: ${geral.total}
- Taxa de acerto geral: ${taxaGeral}%
- Meta: 50% (40/80 questões na OAB)

Erros por disciplina:
${resumo}`,
          },
        ],
        model: 'llama-3.3-70b-versatile',
      });

      setBoletim(res.choices[0].message.content);
    } catch (err) {
      setBoletim('Erro ao gerar boletim. Tente novamente.');
    } finally {
      setLoadingBoletim(false);
    }
  }

  function formatarTempo(seg) {
    if (seg < 60) return `${seg}s`;
    const m = Math.floor(seg / 60);
    const s = seg % 60;
    return s > 0 ? `${m}m ${s}s` : `${m}m`;
  }

  function corTaxa(taxa) {
    if (taxa >= 70) return '#10B981';
    if (taxa >= 50) return '#F59E0B';
    return '#EF4444';
  }

  const taxaGeral = geral.total > 0
    ? Math.round((geral.acertos / geral.total) * 100) : 0;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {(user?.user_metadata?.nome?.[0] ?? user?.email?.[0] ?? '?').toUpperCase()}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.nomeUsuario}>
            {user?.user_metadata?.nome ?? 'Candidato'}
          </Text>
          <Text style={styles.emailUsuario}>{user?.email}</Text>
        </View>
        <TouchableOpacity onPress={signOut} style={styles.btnSair}>
          <Text style={styles.btnSairText}>Sair</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#4F46E5" style={{ marginTop: 60 }} />
      ) : geral.total === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>📊</Text>
          <Text style={styles.emptyTitle}>Nenhum dado ainda</Text>
          <Text style={styles.emptyDesc}>
            Responda questões para ver seu desempenho aqui.
          </Text>
        </View>
      ) : (
        <>
          {/* Cards gerais */}
          <Text style={styles.sectionTitle}>Desempenho Geral</Text>
          <View style={styles.cardsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statNum}>{geral.total}</Text>
              <Text style={styles.statLabel}>Questões</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statNum, { color: corTaxa(taxaGeral) }]}>
                {taxaGeral}%
              </Text>
              <Text style={styles.statLabel}>Acertos</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statNum, { color: '#F59E0B' }]}>
                {formatarTempo(geral.tempoMedio)}
              </Text>
              <Text style={styles.statLabel}>Tempo médio</Text>
            </View>
          </View>

          {/* Meta OAB */}
          <View style={styles.metaCard}>
            <View style={styles.metaTopo}>
              <Text style={styles.metaLabel}>Meta OAB: 50% (40/80)</Text>
              <Text style={[styles.metaPct, { color: corTaxa(taxaGeral) }]}>
                {taxaGeral}%
              </Text>
            </View>
            <View style={styles.barraFundo}>
              <View style={[
                styles.barraPreenchida,
                { width: `${Math.min(taxaGeral, 100)}%`, backgroundColor: corTaxa(taxaGeral) }
              ]} />
              {/* Linha da meta */}
              <View style={styles.metaLinha} />
            </View>
            <Text style={styles.metaHint}>
              {taxaGeral >= 50
                ? '✅ Você está acima da meta de aprovação!'
                : `⚠️ Faltam ${50 - taxaGeral} pontos percentuais para a meta`}
            </Text>
          </View>

          {/* Por matéria — pior primeiro */}
          <Text style={styles.sectionTitle}>Por Matéria</Text>
          <Text style={styles.sectionHint}>Ordenado do que mais precisa ao que já domina</Text>
          {stats.map((item) => (
            <View key={item.disciplina} style={styles.materiaCard}>
              <View style={styles.materiaHeader}>
                <Text style={styles.materiaNome} numberOfLines={1}>
                  {item.disciplina}
                </Text>
                <Text style={[styles.materiaTaxa, { color: corTaxa(item.taxa) }]}>
                  {item.taxa}%
                </Text>
              </View>
              <View style={styles.barraFundo}>
                <View style={[styles.barraPreenchida, {
                  width: `${item.taxa}%`,
                  backgroundColor: corTaxa(item.taxa),
                }]} />
              </View>
              <View style={styles.materiaFooter}>
                <Text style={styles.materiaDetalhe}>
                  {item.acertos}/{item.total} acertos
                </Text>
                <Text style={styles.materiaDetalhe}>
                  ⏱ {formatarTempo(item.tempoMedio)} por questão
                </Text>
              </View>
            </View>
          ))}

          {/* Onde demorou mais */}
          {questoesDificeis.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Onde você demorou mais</Text>
              {questoesDificeis.map((item, index) => (
                <View key={index} style={styles.difCard}>
                  <View style={[
                    styles.difIndex,
                    { backgroundColor: item.acertou ? '#D1FAE5' : '#FEE2E2' }
                  ]}>
                    <Text style={{ fontSize: 16 }}>{item.acertou ? '✓' : '✗'}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.difDisciplina}>
                      {item.disciplina ?? 'Sem matéria'}
                    </Text>
                    <Text style={styles.difTempo}>
                      Levou {formatarTempo(item.tempo_segundos)}
                    </Text>
                  </View>
                </View>
              ))}
            </>
          )}

          {/* Boletim de revisão */}
          <TouchableOpacity
            style={styles.btnBoletim}
            onPress={gerarBoletimRevisao}
            disabled={loadingBoletim}
          >
            {loadingBoletim
              ? <ActivityIndicator color="#FFF" />
              : <Text style={styles.btnBoletimText}>🎯 Gerar Boletim de Revisão com IA</Text>
            }
          </TouchableOpacity>

          {boletim !== '' && (
            <View style={styles.boletimCard}>
              <Text style={styles.boletimTitulo}>📋 Seu Plano de Revisão</Text>
              <Text style={styles.boletimTexto}>{boletim}</Text>
            </View>
          )}
        </>
      )}

      <View style={{ height: 60 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', paddingHorizontal: 20 },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingTop: 60, paddingBottom: 28,
  },
  avatar: {
    width: 52, height: 52, borderRadius: 26, backgroundColor: '#4F46E5',
    justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { color: '#FFF', fontSize: 22, fontWeight: '800' },
  nomeUsuario: { fontSize: 17, fontWeight: '800', color: '#1E293B' },
  emailUsuario: { fontSize: 13, color: '#94A3B8', marginTop: 2 },
  btnSair: { padding: 8 },
  btnSairText: { color: '#94A3B8', fontWeight: '600' },
  sectionTitle: {
    fontSize: 16, fontWeight: '800', color: '#1E293B',
    marginBottom: 4, marginTop: 8,
  },
  sectionHint: { fontSize: 12, color: '#94A3B8', marginBottom: 14 },
  cardsRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  statCard: {
    flex: 1, backgroundColor: '#FFF', borderRadius: 16, padding: 14,
    alignItems: 'center', elevation: 1,
  },
  statNum: { fontSize: 22, fontWeight: '900', color: '#1E293B' },
  statLabel: { fontSize: 11, color: '#94A3B8', fontWeight: '600', marginTop: 2 },

  // Meta
  metaCard: {
    backgroundColor: '#FFF', borderRadius: 16, padding: 18,
    marginBottom: 28, elevation: 1,
  },
  metaTopo: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 10,
  },
  metaLabel: { fontSize: 13, fontWeight: '700', color: '#64748B' },
  metaPct: { fontSize: 18, fontWeight: '900' },
  metaLinha: {
    position: 'absolute', left: '50%', top: 0,
    width: 2, height: 8, backgroundColor: '#1E293B',
  },
  metaHint: { fontSize: 12, color: '#64748B', marginTop: 10, fontWeight: '600' },

  // Barras
  barraFundo: {
    height: 8, backgroundColor: '#F1F5F9',
    borderRadius: 4, marginBottom: 10, overflow: 'hidden',
  },
  barraPreenchida: { height: 8, borderRadius: 4 },

  // Matéria
  materiaCard: {
    backgroundColor: '#FFF', borderRadius: 16, padding: 16,
    marginBottom: 10, elevation: 1,
  },
  materiaHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 10,
  },
  materiaNome: {
    fontSize: 14, fontWeight: '700', color: '#1E293B',
    flex: 1, marginRight: 8,
  },
  materiaTaxa: { fontSize: 16, fontWeight: '900' },
  materiaFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  materiaDetalhe: { fontSize: 12, color: '#94A3B8', fontWeight: '600' },

  // Difíceis
  difCard: {
    backgroundColor: '#FFF', borderRadius: 14, padding: 14,
    flexDirection: 'row', alignItems: 'center', gap: 14,
    marginBottom: 8, elevation: 1,
  },
  difIndex: {
    width: 40, height: 40, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center',
  },
  difDisciplina: { fontSize: 13, fontWeight: '700', color: '#1E293B' },
  difTempo: { fontSize: 12, color: '#94A3B8', marginTop: 2 },

  // Boletim
  btnBoletim: {
    backgroundColor: '#4F46E5', padding: 18, borderRadius: 16,
    alignItems: 'center', marginTop: 24, marginBottom: 12,
  },
  btnBoletimText: { color: '#FFF', fontWeight: '800', fontSize: 14 },
  boletimCard: {
    backgroundColor: '#F5F3FF', borderRadius: 16, padding: 20,
    marginBottom: 24, borderLeftWidth: 4, borderLeftColor: '#4F46E5',
  },
  boletimTitulo: {
    fontSize: 15, fontWeight: '800', color: '#3730A3', marginBottom: 12,
  },
  boletimTexto: { fontSize: 14, color: '#1E293B', lineHeight: 22 },

  // Empty
  empty: { marginTop: 80, alignItems: 'center', gap: 10 },
  emptyIcon: { fontSize: 48 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: '#1E293B' },
  emptyDesc: {
    fontSize: 14, color: '#94A3B8',
    textAlign: 'center', paddingHorizontal: 40,
  },
});