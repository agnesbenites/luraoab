import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  ActivityIndicator, Modal, FlatList
} from 'react-native';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export default function HomeScreen({ navigation }) {
  const { user, signOut } = useAuth();
  const [sessaoAtiva, setSessaoAtiva] = useState(null);
  const [edicoes, setEdicoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalEdicao, setModalEdicao] = useState(false);
  const [stats, setStats] = useState({ total: 0, acertos: 0, tempoMedio: 0 });

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    setLoading(true);
    await Promise.all([buscarSessaoAtiva(), buscarEdicoes(), buscarStats()]);
    setLoading(false);
  }

  async function buscarSessaoAtiva() {
    const { data } = await supabase
      .from('sessoes')
      .select('*')
      .eq('user_id', user.id)
      .eq('concluida', false)
      .order('atualizada_em', { ascending: false })
      .limit(1)
      .single();
    setSessaoAtiva(data ?? null);
  }

  async function buscarEdicoes() {
    const { data } = await supabase
      .from('questoes')
      .select('origem')
      .not('origem', 'is', null);
    if (data) {
      const unicas = [...new Set(data.map(q => q.origem))].sort();
      setEdicoes(unicas);
    }
  }

  async function buscarStats() {
    const { data } = await supabase
      .from('progresso')
      .select('acertou, tempo_segundos')
      .eq('user_id', user.id);
    if (data && data.length > 0) {
      const acertos = data.filter(p => p.acertou).length;
      const tempos = data.filter(p => p.tempo_segundos > 0).map(p => p.tempo_segundos);
      const tempoMedio = tempos.length > 0
        ? Math.round(tempos.reduce((a, b) => a + b, 0) / tempos.length)
        : 0;
      setStats({ total: data.length, acertos, tempoMedio });
    }
  }

  async function iniciarSessao(modo, extras = {}) {
    const { data, error } = await supabase
      .from('sessoes')
      .insert([{ user_id: user.id, modo, ...extras }])
      .select()
      .single();
    if (!error && data) {
      navigation.navigate('Simulados', { sessao: data });
    }
  }

  function continuarSessao() {
    navigation.navigate('Simulados', { sessao: sessaoAtiva });
  }

  const taxaAcerto = stats.total > 0
    ? Math.round((stats.acertos / stats.total) * 100)
    : 0;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Olá, {user?.user_metadata?.nome?.split(' ')[0] || 'Candidato'} 👋</Text>
          <Text style={styles.subtitle}>Pronto para estudar?</Text>
        </View>
        <TouchableOpacity onPress={signOut} style={styles.btnSair}>
          <Text style={styles.btnSairText}>Sair</Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      {stats.total > 0 && (
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{stats.total}</Text>
            <Text style={styles.statLabel}>Questões</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNum, { color: '#10B981' }]}>{taxaAcerto}%</Text>
            <Text style={styles.statLabel}>Acertos</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNum, { color: '#F59E0B' }]}>{stats.tempoMedio}s</Text>
            <Text style={styles.statLabel}>Tempo médio</Text>
          </View>
        </View>
      )}

      {/* Continuar sessão ativa */}
      {sessaoAtiva && (
        <TouchableOpacity style={styles.cardContinuar} onPress={continuarSessao}>
          <View>
            <Text style={styles.cardContinuarTitle}>▶ Continuar de onde parou</Text>
            <Text style={styles.cardContinuarSub}>
              {sessaoAtiva.questoes_respondidas}/{sessaoAtiva.total_questoes} questões •{' '}
              {sessaoAtiva.modo === 'simulado_edicao' ? sessaoAtiva.edicao : sessaoAtiva.modo}
            </Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
      )}

      {/* Opções de modo */}
      <Text style={styles.sectionTitle}>Como quer estudar?</Text>

      <View style={styles.modesGrid}>
        <TouchableOpacity
          style={[styles.modeCard, { backgroundColor: '#4F46E5' }]}
          onPress={() => iniciarSessao('aleatorio')}
        >
          <Text style={styles.modeIcon}>🎲</Text>
          <Text style={styles.modeTitle}>Questões Aleatórias</Text>
          <Text style={styles.modeDesc}>Questões de todas as matérias e edições</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.modeCard, { backgroundColor: '#7C3AED' }]}
          onPress={() => iniciarSessao('por_materia')}
        >
          <Text style={styles.modeIcon}>📚</Text>
          <Text style={styles.modeTitle}>Por Matéria</Text>
          <Text style={styles.modeDesc}>Escolha a disciplina e foque no que importa</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.modeCard, { backgroundColor: '#0F172A' }]}
          onPress={() => iniciarSessao('simulado_completo')}
        >
          <Text style={styles.modeIcon}>🏆</Text>
          <Text style={styles.modeTitle}>Simulado Completo</Text>
          <Text style={styles.modeDesc}>80 questões misturadas como na prova real</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.modeCard, { backgroundColor: '#059669' }]}
          onPress={() => setModalEdicao(true)}
        >
          <Text style={styles.modeIcon}>📋</Text>
          <Text style={styles.modeTitle}>Por Edição</Text>
          <Text style={styles.modeDesc}>Refaça uma prova completa da OAB</Text>
        </TouchableOpacity>
      </View>

      {/* Modal seleção de edição */}
      <Modal visible={modalEdicao} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Escolha a Edição</Text>
            {loading ? <ActivityIndicator color="#4F46E5" /> : (
              <FlatList
                data={edicoes}
                keyExtractor={item => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.edicaoItem}
                    onPress={() => {
                      setModalEdicao(false);
                      iniciarSessao('simulado_edicao', { edicao: item });
                    }}
                  >
                    <Text style={styles.edicaoText}>{item}</Text>
                    <Text style={styles.chevron}>›</Text>
                  </TouchableOpacity>
                )}
              />
            )}
            <TouchableOpacity onPress={() => setModalEdicao(false)} style={styles.btnFechar}>
              <Text style={styles.btnFecharText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', paddingHorizontal: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 60, paddingBottom: 24 },
  greeting: { fontSize: 22, fontWeight: '800', color: '#1E293B' },
  subtitle: { fontSize: 14, color: '#94A3B8', marginTop: 2 },
  btnSair: { padding: 8 },
  btnSairText: { color: '#94A3B8', fontWeight: '600' },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  statCard: { flex: 1, backgroundColor: '#FFF', borderRadius: 16, padding: 14, alignItems: 'center', elevation: 1 },
  statNum: { fontSize: 22, fontWeight: '900', color: '#1E293B' },
  statLabel: { fontSize: 11, color: '#94A3B8', fontWeight: '600', marginTop: 2 },
  cardContinuar: { backgroundColor: '#EEF2FF', borderRadius: 16, padding: 18, flexDirection: 'row',
    justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, borderWidth: 1.5, borderColor: '#C7D2FE' },
  cardContinuarTitle: { fontSize: 15, fontWeight: '800', color: '#4F46E5' },
  cardContinuarSub: { fontSize: 12, color: '#6366F1', marginTop: 4 },
  chevron: { fontSize: 24, color: '#94A3B8' },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#1E293B', marginBottom: 14 },
  modesGrid: { gap: 12 },
  modeCard: { borderRadius: 20, padding: 22, elevation: 2 },
  modeIcon: { fontSize: 28, marginBottom: 8 },
  modeTitle: { fontSize: 17, fontWeight: '800', color: '#FFF', marginBottom: 4 },
  modeDesc: { fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 18 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '75%' },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#1E293B', marginBottom: 16 },
  edicaoItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  edicaoText: { fontSize: 14, color: '#334155', fontWeight: '600' },
  btnFechar: { marginTop: 16, padding: 16, backgroundColor: '#F1F5F9', borderRadius: 14, alignItems: 'center' },
  btnFecharText: { color: '#64748B', fontWeight: '700' },
});