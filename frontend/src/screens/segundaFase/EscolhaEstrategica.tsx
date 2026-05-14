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
import { AREAS, Area } from '../../constants/areas2fase';

const QUIZ = [
  {
    id: 'afinidade',
    pergunta: 'Qual área você mais estudou na faculdade?',
    opcoes: [
      { label: 'Constitucional / Administrativo', areas: ['constitucional', 'administrativo'] },
      { label: 'Civil / Família / Sucessões', areas: ['civil'] },
      { label: 'Penal / Processo Penal', areas: ['penal'] },
      { label: 'Trabalhista / Previdenciário', areas: ['trabalho'] },
      { label: 'Tributário / Empresarial', areas: ['tributario', 'empresarial'] },
    ],
  },
  {
    id: 'tempo',
    pergunta: 'Quanto tempo você tem para estudar até a prova?',
    opcoes: [
      { label: 'Menos de 30 dias', areas: ['constitucional', 'administrativo'] },
      { label: 'Entre 1 e 2 meses', areas: ['constitucional', 'civil', 'tributario'] },
      { label: 'Mais de 2 meses', areas: ['constitucional', 'civil', 'tributario', 'administrativo', 'trabalho'] },
    ],
  },
  {
    id: 'peca',
    pergunta: 'Qual tipo de peça você prefere?',
    opcoes: [
      { label: 'Ações constitucionais (MS, HC, ADI...)', areas: ['constitucional', 'administrativo'] },
      { label: 'Petições e contestações civis', areas: ['civil'] },
      { label: 'Ações penais e habeas corpus', areas: ['penal'] },
      { label: 'Reclamações e recursos trabalhistas', areas: ['trabalho'] },
      { label: 'Mandados de segurança tributários', areas: ['tributario'] },
    ],
  },
];

type Respostas = Record<string, string[]>;

function calcularRecomendacao(respostas: Respostas): Area {
  const pontos: Record<string, number> = {};
  AREAS.forEach((area) => {
    pontos[area.id] = 0;
  });

  Object.values(respostas).forEach((areas) => {
    areas.forEach((id) => {
      if (typeof pontos[id] === 'number') pontos[id] += 1;
    });
  });

  const melhorId =
    Object.entries(pontos).sort((a, b) => b[1] - a[1])[0]?.[0] || AREAS[0].id;

  return AREAS.find((area) => area.id === melhorId) || AREAS[0];
}

export default function EscolhaEstrategica() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const modoInicial = useMemo(() => {
    return route.params?.modo === 'quiz' ? 'quiz' : 'areas';
  }, [route.params?.modo]);

  const [modo, setModo] = useState<'areas' | 'quiz'>(modoInicial);
  const [quizStep, setQuizStep] = useState(0);
  const [respostas, setRespostas] = useState<Respostas>({});
  const [recomendacao, setRecomendacao] = useState<Area | null>(null);

  const abrirArea = (area: Area) => {
    navigation.navigate('AreaHome', {
      areaId: area.id,
      areaNome: area.nome,
    });
  };

  const handleOpcao = (opcao: { label: string; areas: string[] }) => {
    const novas = { ...respostas, [QUIZ[quizStep].id]: opcao.areas };
    setRespostas(novas);

    if (quizStep < QUIZ.length - 1) {
      setQuizStep((prev) => prev + 1);
      return;
    }

    setRecomendacao(calcularRecomendacao(novas));
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={t.background} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Voltar</Text>
        </TouchableOpacity>

        <Text style={styles.badge}>2ª FASE</Text>

        {modo === 'areas' ? (
          <>
            <Text style={styles.title}>Qual área você escolheu?</Text>
            <Text style={styles.subtitle}>
              Selecione sua matéria para entrar em Minha Área.
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.title}>Vamos escolher sua área</Text>
            <Text style={styles.subtitle}>
              Responda rapidamente e eu te indico a matéria mais estratégica.
            </Text>
          </>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {modo === 'areas' ? (
          <>
            {AREAS.map((area) => (
              <TouchableOpacity
                key={area.id}
                style={styles.optionCard}
                onPress={() => abrirArea(area)}
              >
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>{area.nome}</Text>
                  <Text style={styles.optionSub}>{area.pecaPrincipal}</Text>
                </View>

                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity style={styles.switchButton} onPress={() => setModo('quiz')}>
              <Text style={styles.switchButtonText}>Prefiro que o app me ajude a escolher</Text>
            </TouchableOpacity>
          </>
        ) : recomendacao ? (
          <View style={styles.resultCard}>
            <Text style={styles.resultBadge}>Recomendação para você</Text>
            <Text style={styles.resultArea}>{recomendacao.nome}</Text>
            <Text style={styles.resultDesc}>{recomendacao.descricao}</Text>

            <TouchableOpacity style={styles.primaryButton} onPress={() => abrirArea(recomendacao)}>
              <Text style={styles.primaryButtonText}>Entrar em {recomendacao.nome}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.switchButton} onPress={() => setModo('areas')}>
              <Text style={styles.switchButtonText}>Ver todas as áreas</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.quizCard}>
            <Text style={styles.progress}>
              {quizStep + 1} / {QUIZ.length}
            </Text>

            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${((quizStep + 1) / QUIZ.length) * 100}%` },
                ]}
              />
            </View>

            <Text style={styles.question}>{QUIZ[quizStep].pergunta}</Text>

            {QUIZ[quizStep].opcoes.map((opcao, index) => (
              <TouchableOpacity
                key={index}
                style={styles.answerButton}
                onPress={() => handleOpcao(opcao)}
              >
                <Text style={styles.answerText}>{opcao.label}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity style={styles.switchButton} onPress={() => setModo('areas')}>
              <Text style={styles.switchButtonText}>Já escolhi minha área</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: t.background },
  header: { paddingHorizontal: 24, paddingTop: 56, paddingBottom: 16 },
  back: { color: t.accentMuted, fontSize: 14, marginBottom: 20 },
  badge: {
    color: '#a78bfa',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 3,
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  title: { fontSize: 26, fontWeight: 'bold', color: t.textPrimary, marginBottom: 12 },
  subtitle: { fontSize: 14, color: t.textSecondary, lineHeight: 22 },
  scroll: { padding: 16, paddingTop: 8, paddingBottom: 32 },

  optionCard: {
    backgroundColor: '#1a1626',
    borderWidth: 1,
    borderColor: '#2c2340',
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionContent: { flex: 1 },
  optionTitle: { fontSize: 16, fontWeight: '700', color: '#fff', marginBottom: 4 },
  optionSub: { fontSize: 13, color: '#b3acc8', lineHeight: 20 },
  chevron: { fontSize: 28, color: '#b794f4', marginLeft: 12 },

  quizCard: {
    backgroundColor: '#1a1626',
    borderWidth: 1,
    borderColor: '#2c2340',
    borderRadius: 18,
    padding: 20,
  },
  progress: { fontSize: 12, color: t.textMuted, marginBottom: 8, textAlign: 'center' },
  progressBar: {
    height: 4,
    backgroundColor: t.border,
    borderRadius: 999,
    marginBottom: 24,
    overflow: 'hidden',
  },
  progressFill: { height: 4, backgroundColor: t.primary, borderRadius: 999 },
  question: { fontSize: 20, fontWeight: 'bold', color: t.textPrimary, marginBottom: 20, lineHeight: 30 },
  answerButton: {
    backgroundColor: t.surface,
    borderWidth: 1,
    borderColor: t.border,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },
  answerText: { color: t.textPrimary, fontSize: 14, lineHeight: 20 },

  resultCard: {
    backgroundColor: '#1a1626',
    borderWidth: 1,
    borderColor: '#2c2340',
    borderRadius: 18,
    padding: 20,
  },
  resultBadge: {
    fontSize: 11,
    color: '#a78bfa',
    letterSpacing: 2,
    fontWeight: '700',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  resultArea: { fontSize: 30, fontWeight: 'bold', color: '#fff', marginBottom: 10 },
  resultDesc: { fontSize: 14, color: t.textSecondary, lineHeight: 22, marginBottom: 20 },

  primaryButton: {
    backgroundColor: t.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: { color: '#fff', fontWeight: '700', fontSize: 15 },

  switchButton: {
    borderWidth: 1,
    borderColor: t.border,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  switchButtonText: { color: t.textSecondary, fontSize: 14 },
});