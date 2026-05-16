import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
} from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { theme2fase as t } from '../../constants/theme2fase';
import { supabase } from '../../lib/supabase';

type QuestaoIA = {
  id: string;
  titulo: string | null;
  enunciado: string;
  dificuldade: string | null;
  fundamento_legal: string | null;
  pontuacao: number | null;
  created_at?: string | null;
};

export default function SegundaFaseDissertativasIA() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const areaNome = route.params?.areaNome || '';
  const areaId = route.params?.areaId || '';

  const [questoes, setQuestoes] = useState<QuestaoIA[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const carregarQuestoes = async (isRefresh = false) => {
    if (!areaId) {
      setError('Área não informada.');
      setLoading(false);
      setRefreshing(false);
      return;
    }

    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    setError(null);

    const { data, error } = await supabase
      .from('questoes')
      .select(`
        id,
        titulo,
        enunciado,
        dificuldade,
        fundamento_legal,
        pontuacao,
        created_at
      `)
      .eq('area_id', areaId)
      .eq('tipo', 'discursiva')
      .eq('ativo', true)
      .eq('status', 'publicada')
      .order('created_at', { ascending: false });

    if (error) {
      setError(error.message);
      setQuestoes([]);
    } else {
      setQuestoes((data ?? []) as QuestaoIA[]);
    }

    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    carregarQuestoes();
  }, [areaId]);

  useFocusEffect(
    useCallback(() => {
      carregarQuestoes();
    }, [areaId])
  );

  const resumo = useMemo(() => {
    return {
      total: questoes.length,
      comFundamento: questoes.filter((q) => !!q.fundamento_legal).length,
    };
  }, [questoes]);

  const dificuldadeLabel = (value?: string | null) => {
    if (!value) return 'Sem nível';
    if (value === 'baixa') return 'Baixa';
    if (value === 'media') return 'Média';
    if (value === 'alta') return 'Alta';
    return value;
  };

  const renderItem = ({ item, index }: { item: QuestaoIA; index: number }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={() =>
        navigation.navigate('SegundaFaseDissertativaDetalheIA', {
          areaId,
          areaNome,
          questaoId: item.id,
          questao: item,
        })
      }
    >
      <View style={styles.cardTop}>
        <Text style={styles.cardBadge}>QUESTÃO IA</Text>
        <Text style={styles.cardMeta}>
          {item.pontuacao ? `${item.pontuacao} pt` : `Item ${index + 1}`}
        </Text>
      </View>

      <Text style={styles.cardTitle}>
        {item.titulo?.trim() || `Questão discursiva ${index + 1}`}
      </Text>

      <Text style={styles.cardText} numberOfLines={4}>
        {item.enunciado}
      </Text>

      <View style={styles.metaRow}>
        <Text style={styles.metaItem}>{dificuldadeLabel(item.dificuldade)}</Text>
        {item.fundamento_legal ? (
          <Text style={styles.metaItem} numberOfLines={1}>
            {item.fundamento_legal}
          </Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={t.background} />

      <FlatList
        data={questoes}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          !loading && questoes.length === 0 ? styles.contentEmpty : null,
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => carregarQuestoes(true)}
            tintColor={t.accent}
          />
        }
        ListHeaderComponent={
          <View>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.back}>← Voltar</Text>
            </TouchableOpacity>

            <Text style={styles.badge}>2ª FASE — {areaNome.toUpperCase()}</Text>
            <Text style={styles.title}>Banco de Questões da IA</Text>
            <Text style={styles.subtitle}>
              Questões discursivas geradas para treino complementar da sua área.
            </Text>

            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Resumo</Text>
              <Text style={styles.summaryText}>• Questões disponíveis: {resumo.total}</Text>
              <Text style={styles.summaryText}>
                • Questões com fundamento legal: {resumo.comFundamento}
              </Text>
              <Text style={styles.summaryText}>• Atualizadas a partir do banco da área</Text>
            </View>

            {loading ? (
              <View style={styles.centerBox}>
                <ActivityIndicator size="large" color={t.accent} />
                <Text style={styles.centerText}>Carregando questões da IA...</Text>
              </View>
            ) : error ? (
              <View style={styles.centerBox}>
                <Text style={styles.errorTitle}>Não foi possível carregar</Text>
                <Text style={styles.centerText}>{error}</Text>
                <TouchableOpacity style={styles.retryBtn} onPress={() => carregarQuestoes()}>
                  <Text style={styles.retryText}>Tentar novamente</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        }
        ListEmptyComponent={
          !loading && !error ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyTitle}>Ainda não há questões da IA</Text>
              <Text style={styles.emptyText}>
                Quando houver questões publicadas para esta área, elas aparecerão aqui.
              </Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: t.background },
  content: { padding: 24, paddingTop: 20, paddingBottom: 48 },
  contentEmpty: { flexGrow: 1 },
  back: { color: t.accentMuted, fontSize: 14, marginBottom: 20 },
  badge: {
    fontSize: 11,
    color: t.accentMuted,
    letterSpacing: 2,
    fontWeight: '700',
    marginBottom: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: t.textPrimary,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: t.textSecondary,
    lineHeight: 22,
    marginBottom: 20,
  },
  summaryCard: {
    backgroundColor: t.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: t.border,
    padding: 16,
    marginBottom: 18,
  },
  summaryTitle: { fontSize: 14, fontWeight: '700', color: t.textPrimary, marginBottom: 8 },
  summaryText: { fontSize: 13, color: t.textSecondary, lineHeight: 21, marginBottom: 4 },

  card: {
    backgroundColor: t.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: t.border,
    padding: 16,
    marginBottom: 14,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    gap: 12,
  },
  cardBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: t.accent,
    letterSpacing: 1,
  },
  cardMeta: {
    fontSize: 12,
    color: t.textMuted,
    fontWeight: '700',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: t.textPrimary,
    marginBottom: 8,
  },
  cardText: {
    fontSize: 13,
    color: t.textSecondary,
    lineHeight: 21,
    marginBottom: 12,
  },
  metaRow: {
    gap: 6,
  },
  metaItem: {
    fontSize: 12,
    color: t.textMuted,
    fontWeight: '600',
  },
  centerBox: {
    backgroundColor: t.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: t.border,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  centerText: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    color: t.textSecondary,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: t.textPrimary,
    marginBottom: 6,
  },
  retryBtn: {
    marginTop: 14,
    backgroundColor: t.surface,
    borderWidth: 1,
    borderColor: t.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  retryText: {
    color: t.accentMuted,
    fontWeight: '700',
    fontSize: 13,
  },
  emptyBox: {
    backgroundColor: t.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: t.border,
    padding: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: t.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 22,
    color: t.textSecondary,
    textAlign: 'center',
  },
});