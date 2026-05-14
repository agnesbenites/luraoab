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
import { getProva } from '../../utils/provasLegacy';
import { theme2fase as t } from '../../constants/theme2fase';

export default function GabaritoExame() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const exame = route.params?.exame;
  const areaId = route.params?.areaId || '';
  const areaNome = route.params?.areaNome || 'Minha Área';

  const json = useMemo(() => {
    if (!areaId || !exame) return null;
    return getProva(areaId, exame);
  }, [areaId, exame]);

  const questoes = json?.questoes || [];
  const peca = json?.peca;

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
          <Text style={styles.badge}>
            2ª FASE — {areaNome.toUpperCase()}
          </Text>
          <Text style={styles.title}>Gabarito do {exame}º exame</Text>
          <Text style={styles.subtitle}>
            Veja a peça, as questões e a estrutura de correção da prova.
          </Text>
        </View>

        {!json ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>Prova não encontrada</Text>
            <Text style={styles.emptyText}>
              Verifique se este exame está cadastrado corretamente no util de
              provas para a área selecionada.
            </Text>
          </View>
        ) : (
          <>
            {peca ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Peça profissional</Text>
                {!!peca.tipo && <Text style={styles.meta}>Tipo: {peca.tipo}</Text>}
                {!!peca.pecaCorreta && (
                  <Text style={styles.meta}>Peça correta: {peca.pecaCorreta}</Text>
                )}
                {!!peca.justificativa && (
                  <Text style={styles.body}>{peca.justificativa}</Text>
                )}
              </View>
            ) : null}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Questões</Text>

              {questoes.length === 0 ? (
                <Text style={styles.emptyText}>
                  Nenhuma questão cadastrada para este exame.
                </Text>
              ) : (
                questoes.map((q: any, index: number) => (
                  <View key={index} style={styles.questionCard}>
                    <Text style={styles.questionTitle}>
                      Questão {index + 1}
                    </Text>

                    {!!q.pergunta && (
                      <Text style={styles.questionLabel}>Pergunta</Text>
                    )}
                    {!!q.pergunta && (
                      <Text style={styles.body}>{q.pergunta}</Text>
                    )}

                    {!!q.gabarito && (
                      <Text style={styles.questionLabel}>Gabarito</Text>
                    )}
                    {!!q.gabarito && (
                      <Text style={styles.body}>{q.gabarito}</Text>
                    )}
                  </View>
                ))
              )}
            </View>
          </>
        )}
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
    paddingBottom: 40,
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
    fontSize: 28,
    fontWeight: 'bold',
    color: t.textPrimary,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: t.textSecondary,
    lineHeight: 22,
  },
  section: {
    backgroundColor: t.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: t.border,
    padding: 18,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: t.textPrimary,
    marginBottom: 12,
  },
  meta: {
    fontSize: 13,
    color: t.textSecondary,
    marginBottom: 6,
  },
  body: {
    fontSize: 14,
    color: t.textPrimary,
    lineHeight: 22,
    marginBottom: 10,
  },
  questionCard: {
    backgroundColor: t.background,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: t.border,
    padding: 14,
    marginBottom: 12,
  },
  questionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: t.textPrimary,
    marginBottom: 10,
  },
  questionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: t.primary,
    marginBottom: 6,
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