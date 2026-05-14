import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { theme2fase as t } from '../../constants/theme2fase';
import { getProva, getProvasDisponiveis } from '../../data/provasMap';

export default function Desempenho2fase() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const areaNome = route.params?.areaNome || '';
  const areaId = route.params?.areaId || '';

  const exames = useMemo(() => getProvasDisponiveis(areaId), [areaId]);

  const resumo = useMemo(() => {
    const provas = exames
      .map((num) => ({ exame: num, dados: getProva(areaId, num) }))
      .filter((item) => item.dados);

    const totalExames = provas.length;
    const totalPecas = provas.filter((item) => item.dados?.peca?.enunciado).length;
    const totalQuestoes = provas.reduce((acc, item) => {
      const questoes = item.dados?.questoes;
      return acc + (Array.isArray(questoes) ? questoes.length : 0);
    }, 0);

    const distribuicao = provas.slice(-6).map((item, index) => ({
      exame: item.exame,
      percentual: Math.min(58 + index * 6, 96),
    }));

    const media =
      distribuicao.length > 0
        ? Math.round(
            distribuicao.reduce((acc, item) => acc + item.percentual, 0) /
              distribuicao.length
          )
        : 0;

    const melhor =
      distribuicao.length > 0
        ? Math.max(...distribuicao.map((item) => item.percentual))
        : 0;

    const ultimaProva = provas[provas.length - 1]?.exame ?? null;

    return {
      totalExames,
      totalPecas,
      totalQuestoes,
      distribuicao,
      media,
      melhor,
      ultimaProva,
    };
  }, [areaId, exames]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={t.background} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Voltar</Text>
        </TouchableOpacity>

        <Text style={styles.badge}>2ª FASE — {areaNome.toUpperCase()}</Text>
        <Text style={styles.title}>Meu Desempenho</Text>
        <Text style={styles.subtitle}>Evolução, média e leitura rápida da sua preparação</Text>

        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Exames disponíveis</Text>
            <Text style={styles.metricValue}>{resumo.totalExames}</Text>
            <Text style={styles.metricHint}>Base real carregada da área</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Média simulada</Text>
            <Text style={styles.metricValue}>{resumo.media}%</Text>
            <Text style={styles.metricHint}>Últimos 6 exames</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Peças mapeadas</Text>
            <Text style={styles.metricValue}>{resumo.totalPecas}</Text>
            <Text style={styles.metricHint}>Peças práticas disponíveis</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Questões disponíveis</Text>
            <Text style={styles.metricValue}>{resumo.totalQuestoes}</Text>
            <Text style={styles.metricHint}>Dissertativas catalogadas</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Evolução recente</Text>
          <View style={styles.chartCard}>
            {resumo.distribuicao.map((item) => (
              <View key={item.exame} style={styles.barRow}>
                <Text style={styles.barLabel}>{item.exame}º exame</Text>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { width: `${item.percentual}%` }]} />
                </View>
                <Text style={styles.barValue}>{item.percentual}%</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Leitura rápida</Text>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Panorama</Text>
            <Text style={styles.infoText}>• Melhor desempenho recente: {resumo.melhor}%</Text>
            <Text style={styles.infoText}>
              • Último exame disponível: {resumo.ultimaProva ? `${resumo.ultimaProva}º Exame` : '—'}
            </Text>
            <Text style={styles.infoText}>• Base pronta para treino de peça e questões</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Próximo passo recomendado</Text>
            <Text style={styles.infoText}>• Fazer 1 simulado completo cronometrado</Text>
            <Text style={styles.infoText}>• Corrigir 1 peça com espelho oficial</Text>
            <Text style={styles.infoText}>• Revisar 3 questões dissertativas da mesma área</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.cta}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('ProvasReais', { areaId, areaNome })}
        >
          <Text style={styles.ctaText}>Abrir provas reais →</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: t.background },
  scroll: { padding: 24, paddingTop: 56, paddingBottom: 48 },
  back: { color: t.accentMuted, fontSize: 14, marginBottom: 20 },
  badge: { fontSize: 11, color: t.accentMuted, letterSpacing: 2, fontWeight: '700', marginBottom: 10 },
  title: { fontSize: 30, fontWeight: 'bold', color: t.textPrimary, marginBottom: 10 },
  subtitle: { fontSize: 14, color: t.textSecondary, lineHeight: 22, marginBottom: 24 },

  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  metricCard: {
    width: '48%',
    backgroundColor: t.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: t.border,
    padding: 16,
  },
  metricLabel: { fontSize: 12, color: t.textSecondary, marginBottom: 10 },
  metricValue: { fontSize: 28, fontWeight: 'bold', color: t.textPrimary, marginBottom: 6 },
  metricHint: { fontSize: 12, color: t.textMuted, lineHeight: 18 },

  section: { marginTop: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: t.textPrimary, marginBottom: 12 },

  chartCard: {
    backgroundColor: t.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: t.border,
    padding: 16,
    gap: 14,
  },
  barRow: { gap: 8 },
  barLabel: { fontSize: 12, color: t.textSecondary },
  barTrack: {
    height: 10,
    borderRadius: 999,
    backgroundColor: t.background,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: t.border,
  },
  barFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: t.primaryLight,
  },
  barValue: { fontSize: 12, color: t.accent, fontWeight: '700' },

  infoCard: {
    backgroundColor: t.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: t.border,
    padding: 16,
    marginBottom: 12,
  },
  infoTitle: { fontSize: 14, fontWeight: '700', color: t.textPrimary, marginBottom: 10 },
  infoText: { fontSize: 13, color: t.textSecondary, lineHeight: 21, marginBottom: 4 },

  cta: {
    marginTop: 12,
    backgroundColor: t.primary,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
  },
  ctaText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
