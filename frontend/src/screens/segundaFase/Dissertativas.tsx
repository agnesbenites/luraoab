import React, { useMemo, useState } from 'react';
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

export default function Dissertativas() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const areaNome = route.params?.areaNome || '';
  const areaId = route.params?.areaId || '';

  const exames = useMemo(() => getProvasDisponiveis(areaId), [areaId]);

  const questoes = useMemo(() => {
    return exames
      .map((num) => {
        const prova = getProva(areaId, num);
        return {
          exame: num,
          questoes: Array.isArray(prova?.questoes) ? prova.questoes : [],
        };
      })
      .filter((item) => item.questoes.length > 0)
      .sort((a, b) => b.exame - a.exame);
  }, [areaId, exames]);

  const [abertas, setAbertas] = useState<Record<string, boolean>>({});

  const toggle = (key: string) => {
    setAbertas((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={t.background} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Voltar</Text>
        </TouchableOpacity>

        <Text style={styles.badge}>2ª FASE — {areaNome.toUpperCase()}</Text>
        <Text style={styles.title}>Questões Dissertativas</Text>
        <Text style={styles.subtitle}>Treine as 3 questões com base nas provas reais da área</Text>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Resumo</Text>
          <Text style={styles.summaryText}>• Exames com questões: {questoes.length}</Text>
          <Text style={styles.summaryText}>
            • Total estimado de questões: {questoes.reduce((acc, item) => acc + item.questoes.length, 0)}
          </Text>
          <Text style={styles.summaryText}>• Use esta tela para leitura rápida e treino guiado</Text>
        </View>

        {questoes.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>Nenhuma questão dissertativa encontrada para esta área.</Text>
          </View>
        ) : (
          questoes.map((bloco) => (
            <View key={bloco.exame} style={styles.examCard}>
              <View style={styles.examHeader}>
                <View>
                  <Text style={styles.examTitle}>{bloco.exame}º Exame de Ordem</Text>
                  <Text style={styles.examSub}>{bloco.questoes.length} questões disponíveis</Text>
                </View>

                <TouchableOpacity
                  style={styles.openProofBtn}
                  onPress={() =>
                    navigation.navigate('GabaritoExame', {
                      exame: bloco.exame,
                      areaId,
                      areaNome,
                    })
                  }
                >
                  <Text style={styles.openProofText}>Ver prova</Text>
                </TouchableOpacity>
              </View>

              {bloco.questoes.map((questao: any, index: number) => {
                const key = `${bloco.exame}-${index}`;
                const aberta = !!abertas[key];

                return (
                  <View key={key} style={styles.questaoCard}>
                    <Text style={styles.questaoNumero}>Questão {questao.numero || index + 1}</Text>
                    <Text style={styles.questaoTexto} numberOfLines={aberta ? undefined : 4}>
                      {questao.enunciado}
                    </Text>

                    <TouchableOpacity style={styles.toggleBtn} onPress={() => toggle(key)}>
                      <Text style={styles.toggleText}>
                        {aberta ? 'Ocultar detalhes ▲' : 'Ler mais ▼'}
                      </Text>
                    </TouchableOpacity>

                    {aberta && (
                      <View style={styles.detailsBox}>
                        {questao.itens?.map((item: any, ii: number) => (
                          <View key={ii} style={styles.itemBox}>
                            <Text style={styles.itemPergunta}>
                              {item.letra ? `${item.letra}) ` : ''}{item.pergunta}
                            </Text>
                            {item.gabarito ? (
                              <Text style={styles.itemGabarito}>Gabarito: {item.gabarito}</Text>
                            ) : null}
                            {item.pontuacao ? (
                              <Text style={styles.itemPontuacao}>Pontuação: {item.pontuacao}</Text>
                            ) : null}
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          ))
        )}
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
  subtitle: { fontSize: 14, color: t.textSecondary, lineHeight: 22, marginBottom: 20 },

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

  emptyBox: {
    backgroundColor: t.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: t.border,
    padding: 18,
  },
  emptyText: { color: t.textMuted, fontSize: 14, textAlign: 'center' },

  examCard: {
    backgroundColor: t.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: t.border,
    padding: 16,
    marginBottom: 16,
  },
  examHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    gap: 12,
  },
  examTitle: { fontSize: 16, fontWeight: '700', color: t.textPrimary },
  examSub: { fontSize: 12, color: t.textMuted, marginTop: 3 },

  openProofBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: t.background,
    borderWidth: 1,
    borderColor: t.border,
  },
  openProofText: { fontSize: 12, color: t.accentMuted, fontWeight: '700' },

  questaoCard: {
    backgroundColor: t.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: t.border,
    padding: 14,
    marginBottom: 12,
  },
  questaoNumero: { fontSize: 12, fontWeight: '700', color: t.accent, marginBottom: 8 },
  questaoTexto: { fontSize: 13, color: t.textSecondary, lineHeight: 21, marginBottom: 10 },

  toggleBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: t.border,
    backgroundColor: t.surface,
  },
  toggleText: { fontSize: 12, color: t.accentMuted, fontWeight: '700' },

  detailsBox: { marginTop: 12, gap: 10 },
  itemBox: {
    borderTopWidth: 1,
    borderTopColor: t.border,
    paddingTop: 10,
  },
  itemPergunta: { fontSize: 13, color: t.textPrimary, lineHeight: 20, marginBottom: 6 },
  itemGabarito: { fontSize: 12, color: t.textSecondary, lineHeight: 19, marginBottom: 4 },
  itemPontuacao: { fontSize: 12, color: t.accent, fontWeight: '700' },
});
