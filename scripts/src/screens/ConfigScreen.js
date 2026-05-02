import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export default function ConfigScreen() {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);
  const [geral, setGeral] = useState({ total: 0, acertos: 0, tempoMedio: 0 });
  const [questoesDificeis, setQuestoesDificeis] = useState([]);

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

    // Agrupa por disciplina
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
    })).sort((a, b) => b.total - a.total);

    setStats(resultado);

    // Geral
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
    // Questões onde o usuário demorou mais (top 5)
    const { data } = await supabase
      .from('progresso')
      .select('questao_id, tempo_segundos, disciplina, acertou')
      .eq('user_id', user.id)
      .gt('tempo_segundos', 0)
      .order('tempo_segundos', { ascending: false })
      .limit(5);

    setQuestoesDificeis(data ?? []);
  }

  function formatarTempo(seg) {
    if (seg < 60) return `${seg}s`;
    const m = Math.floor(seg / 60);
    const s = seg % 60;
    return `${m}m ${s}s`;
  }

  function corTaxa(taxa) {
    if (taxa >= 70) return '#10B981';
    if (taxa >= 50) return '#F59E0B';
    return '#EF4444';
  }

  const taxaGeral = geral.total > 0
    ? Math.round((geral.acertos / geral.total) * 100)
    : 0;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* Header perfil */}
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
          <Text style={styles.emptyDesc}>Responda questões para ver seu desempenho aqui.</Text>
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
              <Text style={[styles.statNum, { color: corTaxa(taxaGeral) }]}>{taxaGeral}%</Text>
              <Text style={styles.statLabel}>Acertos</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statNum, { color: '#F59E0B' }]}>{formatarTempo(geral.tempoMedio)}</Text>
              <Text style={styles.statLabel}>Tempo médio</Text>
            </View>
          </View>

          {/* Por matéria */}
          <Text style={styles.sectionTitle}>Por Matéria</Text>
          {stats.map((item) => (
            <View key={item.disciplina} style={styles.materiaCard}>
              <View style={styles.materiaHeader}>
                <Text style={styles.materiaNome} numberOfLines={1}>{item.disciplina}</Text>
                <Text style={[styles.materiaTaxa, { color: corTaxa(item.taxa) }]}>
                  {item.taxa}%
                </Text>
              </View>

              {/* Barra de progresso */}
              <View style={styles.barraFundo}>
                <View style={[styles.barraPreenchida, {
                  width: `${item.taxa}%`,
                  backgroundColor: corTaxa(item.taxa)
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

          {/* Questões que mais demoraram */}
          {questoesDificeis.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Onde você demorou mais</Text>
              {questoesDificeis.map((item, index) => (
                <View key={index} style={styles.difCard}>
                  <View style={[styles.difIndex, { backgroundColor: item.acertou ? '#D1FAE5' : '#FEE2E2' }]}>
                    <Text style={{ fontSize: 16 }}>{item.acertou ? '✓' : '✗'}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.difDisciplina}>{item.disciplina ?? 'Sem matéria'}</Text>
                    <Text style={styles.difTempo}>Levou {formatarTempo(item.tempo_segundos)}</Text>
                  </View>
                </View>
              ))}
            </>
          )}
        </>
      )}

      <View style={{ height: 60 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', paddingHorizontal: 20 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingTop: 60, paddingBottom: 28 },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#4F46E5',
    justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#FFF', fontSize: 22, fontWeight: '800' },
  nomeUsuario: { fontSize: 17, fontWeight: '800', color: '#1E293B' },
  emailUsuario: { fontSize: 13, color: '#94A3B8', marginTop: 2 },
  btnSair: { padding: 8 },
  btnSairText: { color: '#94A3B8', fontWeight: '600' },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#1E293B', marginBottom: 14, marginTop: 8 },
  cardsRow: { flexDirection: 'row', gap: 10, marginBottom: 28 },
  statCard: { flex: 1, backgroundColor: '#FFF', borderRadius: 16, padding: 14,
    alignItems: 'center', elevation: 1 },
  statNum: { fontSize: 22, fontWeight: '900', color: '#1E293B' },
  statLabel: { fontSize: 11, color: '#94A3B8', fontWeight: '600', marginTop: 2 },
  materiaCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 16,
    marginBottom: 10, elevation: 1 },
  materiaHeader: { flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 10 },
  materiaNome: { fontSize: 14, fontWeight: '700', color: '#1E293B', flex: 1, marginRight: 8 },
  materiaTaxa: { fontSize: 16, fontWeight: '900' },
  barraFundo: { height: 6, backgroundColor: '#F1F5F9', borderRadius: 4, marginBottom: 10 },
  barraPreenchida: { height: 6, borderRadius: 4 },
  materiaFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  materiaDetalhe: { fontSize: 12, color: '#94A3B8', fontWeight: '600' },
  difCard: { backgroundColor: '#FFF', borderRadius: 14, padding: 14,
    flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 8, elevation: 1 },
  difIndex: { width: 40, height: 40, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center' },
  difDisciplina: { fontSize: 13, fontWeight: '700', color: '#1E293B' },
  difTempo: { fontSize: 12, color: '#94A3B8', marginTop: 2 },
  empty: { marginTop: 80, alignItems: 'center', gap: 10 },
  emptyIcon: { fontSize: 48 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: '#1E293B' },
  emptyDesc: { fontSize: 14, color: '#94A3B8', textAlign: 'center', paddingHorizontal: 40 },
});