import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../lib/supabase';

export default function ConfigScreen() {
  const [stats, setStats] = useState({ total: 0, acertos: 0, porDisciplina: {} });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Recarrega os dados toda vez que a tela ganha foco
  useFocusEffect(
    useCallback(() => {
      fetchStats();
    }, [])
  );

  const fetchStats = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('progresso').select('*');

      if (data) {
        const total = data.length;
        const acertos = data.filter(item => item.acertou).length;
        
        // Agrupa por disciplina
        const porDisciplina = data.reduce((acc, item) => {
          const disc = item.disciplina || 'Outros';
          if (!acc[disc]) acc[disc] = { total: 0, acertos: 0 };
          acc[disc].total += 1;
          if (item.acertou) acc[disc].acertos += 1;
          return acc;
        }, {});

        setStats({ total, acertos, porDisciplina });
      }
    } catch (err) {
      console.error("Erro ao processar estatísticas:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  const percentualGeral = stats.total > 0 ? Math.round((stats.acertos / stats.total) * 100) : 0;

  return (
    <ScrollView 
      style={styles.container} 
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>Meu Desempenho</Text>
        <Text style={styles.subGreeting}>Acompanhe sua evolução para a prova.</Text>
      </View>

      {/* Card Principal: Resumo Geral */}
      <View style={styles.mainCard}>
        <View style={styles.statRow}>
          <View>
            <Text style={styles.statLabel}>Total Resolvidas</Text>
            <Text style={styles.statValue}>{stats.total}</Text>
          </View>
          <View style={styles.divider} />
          <View>
            <Text style={styles.statLabel}>Acertos Geral</Text>
            <Text style={[styles.statValue, { color: '#10B981' }]}>{percentualGeral}%</Text>
          </View>
        </View>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: `${percentualGeral}%` }]} />
        </View>
      </View>

      <Text style={styles.sectionTitle}>Desempenho por Disciplina</Text>

      {/* Lista de Disciplinas */}
      {Object.keys(stats.porDisciplina).length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>Resolva sua primeira questão para ver as estatísticas aqui! 🚀</Text>
        </View>
      ) : (
        Object.keys(stats.porDisciplina).map((disc) => {
          const d = stats.porDisciplina[disc];
          const perc = Math.round((d.acertos / d.total) * 100);
          return (
            <View key={disc} style={styles.disciplineCard}>
              <View style={styles.discInfo}>
                <Text style={styles.discName}>{disc}</Text>
                <Text style={styles.discCount}>{d.acertos}/{d.total} acertos</Text>
              </View>
              <View style={styles.miniBarBackground}>
                <View style={[styles.miniBarFill, { width: `${perc}%`, backgroundColor: perc >= 50 ? '#10B981' : '#F59E0B' }]} />
              </View>
              <Text style={styles.discPerc}>{perc}%</Text>
            </View>
          );
        })
      )}
      
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', paddingHorizontal: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' },
  header: { marginTop: 40, marginBottom: 25 },
  greeting: { fontSize: 28, fontWeight: 'bold', color: '#1E293B' },
  subGreeting: { fontSize: 16, color: '#64748B', marginTop: 4 },
  mainCard: { backgroundColor: '#FFF', padding: 24, borderRadius: 20, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 15 },
  statRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginBottom: 20 },
  divider: { width: 1, height: 40, backgroundColor: '#E2E8F0' },
  statLabel: { fontSize: 13, color: '#94A3B8', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  statValue: { fontSize: 32, fontWeight: '800', color: '#1E293B', textAlign: 'center' },
  progressBarBackground: { height: 10, backgroundColor: '#F1F5F9', borderRadius: 5, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#4F46E5' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E293B', marginTop: 35, marginBottom: 15 },
  disciplineCard: { backgroundColor: '#FFF', padding: 18, borderRadius: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', borderSize: 1, borderColor: '#F1F5F9' },
  discInfo: { flex: 1 },
  discName: { fontSize: 15, fontWeight: '700', color: '#334155' },
  discCount: { fontSize: 12, color: '#94A3B8', marginTop: 2 },
  miniBarBackground: { width: 80, height: 6, backgroundColor: '#F1F5F9', borderRadius: 3, marginHorizontal: 15, overflow: 'hidden' },
  miniBarFill: { height: '100%' },
  discPerc: { width: 40, fontSize: 14, fontWeight: 'bold', color: '#1E293B', textAlign: 'right' },
  emptyCard: { padding: 40, alignItems: 'center' },
  emptyText: { textAlign: 'center', color: '#94A3B8', lineHeight: 22 }
});
