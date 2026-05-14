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
import { getProvasDisponiveis, getProva } from '../../utils/provasLegacy';
import { theme2fase as t } from '../../constants/theme2fase';

export default function ProvasReais() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const areaNome = route.params?.areaNome || 'Minha Área';
  const areaId = route.params?.areaId || '';
  const exames = useMemo(() => getProvasDisponiveis(areaId), [areaId]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={t.background} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Voltar</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.badge}>2ª FASE — {areaNome.toUpperCase()}</Text>
          <Text style={styles.title}>Provas reais</Text>
          <Text style={styles.subtitle}>
            Escolha um exame para ver o enunciado, o gabarito comentado e a
            distribuição de pontos.
          </Text>
        </View>

        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Exames disponíveis</Text>
          <Text style={styles.summaryValue}>{exames.length}</Text>
        </View>

        <View style={styles.grid}>
          {exames.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>
                Nenhuma prova cadastrada para esta área
              </Text>
              <Text style={styles.emptyText}>
                Verifique se os arquivos da matéria estão mapeados corretamente
                no util de provas.
              </Text>
            </View>
          ) : (
            exames.map((num: number) => {
              const dados = getProva(areaId, num);
              const qtdQuestoes = dados?.questoes?.length || 0;
              const temPeca = !!dados?.peca;

              return (
                <TouchableOpacity
                  key={num}
                  style={styles.card}
                  activeOpacity={0.85}
                  onPress={() =>
                    navigation.navigate('GabaritoExame', {
                      exame: num,
                      areaId,
                      areaNome,
                    })
                  }
                >
                  <View style={styles.cardTop}>
                    <View>
                      <Text style={styles.examLabel}>EXAME</Text>
                      <Text style={styles.examNumber}>{num}º</Text>
                    </View>

                    <View style={styles.tag}>
                      <Text style={styles.tagText}>
                        {temPeca ? 'Peça + Questões' : 'Questões'}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.cardArea}>{dados?.area || areaNome}</Text>
                  <Text style={styles.cardMeta}>
                    {qtdQuestoes} questões dissertativas
                  </Text>
                  <Text style={styles.cardMeta}>
                    {temPeca ? 'Inclui peça profissional' : 'Sem peça cadastrada'}
                  </Text>
                  <Text style={styles.cardAction}>Abrir gabarito →</Text>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: t.background,
  },
  scroll: {
    padding: 24,
    paddingTop: 56,
  },
  back: {
    color: t.accentMuted,
    fontSize: 14,
    marginBottom: 20,
  },
  header: {
    marginBottom: 20,
  },
  badge: {
    fontSize: 11,
    color: t.accentMuted,
    letterSpacing: 3,
    fontWeight: '700',
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: t.textPrimary,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: t.textSecondary,
    lineHeight: 22,
  },
  summary: {
    backgroundColor: t.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: t.border,
    padding: 18,
    marginBottom: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryTitle: {
    fontSize: 13,
    color: t.textSecondary,
    fontWeight: '600',
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: '800',
    color: t.primary,
  },
  grid: {
    gap: 12,
  },
  card: {
    backgroundColor: t.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: t.border,
    padding: 18,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
    gap: 12,
  },
  examLabel: {
    fontSize: 11,
    color: t.textMuted,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 4,
  },
  examNumber: {
    fontSize: 30,
    fontWeight: '800',
    color: t.textPrimary,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: t.background,
    borderWidth: 1,
    borderColor: t.border,
  },
  tagText: {
    fontSize: 11,
    color: t.textSecondary,
    fontWeight: '700',
  },
  cardArea: {
    fontSize: 14,
    color: t.textPrimary,
    fontWeight: '700',
    marginBottom: 6,
  },
  cardMeta: {
    fontSize: 12,
    color: t.textSecondary,
    lineHeight: 18,
    marginBottom: 2,
  },
  cardAction: {
    marginTop: 12,
    fontSize: 13,
    color: t.primary,
    fontWeight: '700',
  },
  emptyCard: {
    backgroundColor: t.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: t.border,
    padding: 18,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: t.textPrimary,
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 13,
    color: t.textSecondary,
    lineHeight: 20,
  },
});