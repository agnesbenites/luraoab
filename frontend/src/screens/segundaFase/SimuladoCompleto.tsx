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

export default function SimuladoCompleto() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const areaNome = route.params?.areaNome || '';
  const areaId = route.params?.areaId || '';

  const exames = useMemo(() => getProvasDisponiveis(areaId), [areaId]);

  const ultimoExame = useMemo(() => {
    if (!exames.length) return null;
    const numero = exames[exames.length - 1];
    return { numero, dados: getProva(areaId, numero) };
  }, [areaId, exames]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={t.background} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Voltar</Text>
        </TouchableOpacity>

        <Text style={styles.badge}>2ª FASE — {areaNome.toUpperCase()}</Text>
        <Text style={styles.title}>Simulado Completo</Text>
        <Text style={styles.subtitle}>4h30 cronometrado em condições próximas da prova real</Text>

        <View style={styles.heroCard}>
          <Text style={styles.heroLabel}>SIMULADO RECOMENDADO</Text>
          <Text style={styles.heroTitle}>
            {ultimoExame ? `${ultimoExame.numero}º Exame de Ordem` : 'Nenhum exame disponível'}
          </Text>
          <Text style={styles.heroText}>
            {ultimoExame
              ? 'Use a peça e as questões reais desta área para um treino completo, com tempo fechado e correção posterior no espelho oficial.'
              : 'Ainda não encontramos exames disponíveis para montar o simulado desta área.'}
          </Text>
        </View>

        <View style={styles.cardsRow}>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Duração</Text>
            <Text style={styles.infoValue}>4h30</Text>
            <Text style={styles.infoHint}>Cronometrado</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Composição</Text>
            <Text style={styles.infoValue}>1 + 3</Text>
            <Text style={styles.infoHint}>Peça + questões</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Como usar</Text>

          <View style={styles.stepCard}>
            <Text style={styles.stepTitle}>1. Separe um bloco único</Text>
            <Text style={styles.stepText}>
              Faça a peça e as três questões em sequência, sem consultar o espelho.
            </Text>
          </View>

          <View style={styles.stepCard}>
            <Text style={styles.stepTitle}>2. Cronometre 4h30</Text>
            <Text style={styles.stepText}>
              Simule a pressão real da prova e distribua seu tempo entre peça e questões.
            </Text>
          </View>

          <View style={styles.stepCard}>
            <Text style={styles.stepTitle}>3. Corrija no gabarito oficial</Text>
            <Text style={styles.stepText}>
              Compare sua resposta com a peça correta, fundamentos, pedidos e pontuação.
            </Text>
          </View>
        </View>

        {ultimoExame && (
          <>
            <TouchableOpacity
              style={styles.primaryBtn}
              activeOpacity={0.85}
              onPress={() =>
                navigation.navigate('GabaritoExame', {
                  exame: ultimoExame.numero,
                  areaId,
                  areaNome,
                })
              }
            >
              <Text style={styles.primaryBtnText}>Abrir simulado recomendado →</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryBtn}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('ProvasReais', { areaId, areaNome })}
            >
              <Text style={styles.secondaryBtnText}>Escolher outro exame</Text>
            </TouchableOpacity>
          </>
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

  heroCard: {
    backgroundColor: t.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: t.primary,
    padding: 18,
    marginBottom: 18,
  },
  heroLabel: { fontSize: 10, color: t.accentMuted, letterSpacing: 2, fontWeight: '700', marginBottom: 10 },
  heroTitle: { fontSize: 22, fontWeight: 'bold', color: t.textPrimary, marginBottom: 10 },
  heroText: { fontSize: 13, color: t.textSecondary, lineHeight: 21 },

  cardsRow: { flexDirection: 'row', gap: 12, marginBottom: 22 },
  infoCard: {
    flex: 1,
    backgroundColor: t.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: t.border,
    padding: 16,
  },
  infoLabel: { fontSize: 12, color: t.textSecondary, marginBottom: 8 },
  infoValue: { fontSize: 26, fontWeight: 'bold', color: t.textPrimary, marginBottom: 4 },
  infoHint: { fontSize: 12, color: t.textMuted },

  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: t.textPrimary, marginBottom: 12 },
  stepCard: {
    backgroundColor: t.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: t.border,
    padding: 16,
    marginBottom: 12,
  },
  stepTitle: { fontSize: 14, fontWeight: '700', color: t.textPrimary, marginBottom: 8 },
  stepText: { fontSize: 13, color: t.textSecondary, lineHeight: 21 },

  primaryBtn: {
    backgroundColor: t.primary,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },

  secondaryBtn: {
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: t.accentMuted,
  },
  secondaryBtnText: { fontSize: 15, fontWeight: '700', color: t.accentMuted },
});
