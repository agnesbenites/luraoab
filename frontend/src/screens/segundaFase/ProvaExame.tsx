import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getProva } from '../../utils/provasLegacy';

export default function ProvaExame({ route }: any) {
  const { exame, areaId, areaNome } = route.params || {};
  const [mostrarGabarito, setMostrarGabarito] = useState(false);
  const [tempo, setTempo] = useState(0);
  const [rodando, setRodando] = useState(false);

  const prova = useMemo(() => getProva(String(areaId || '').toLowerCase(), Number(exame)), [areaId, exame]);

  useEffect(() => {
    if (!rodando) return;

    const timer = setInterval(() => {
      setTempo((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [rodando]);

  const formatarTempo = (total: number) => {
    const horas = Math.floor(total / 3600);
    const minutos = Math.floor((total % 3600) / 60);
    const segundos = total % 60;

    return [horas, minutos, segundos]
      .map((n) => String(n).padStart(2, '0'))
      .join(':');
  };

  const questoes = Array.isArray(prova?.questoes) ? prova.questoes : [];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.back}>← Voltar</Text>
      <Text style={styles.badge}>2ª FASE — {String(areaNome || '').toUpperCase()}</Text>
      <Text style={styles.title}>{exame}º Exame de Ordem</Text>
      {!!prova?.data && <Text style={styles.date}>Aplicado em {prova.data}</Text>}

      <View style={styles.timerCard}>
        <Text style={styles.timerLabel}>Cronômetro</Text>
        <Text style={styles.timerValue}>{formatarTempo(tempo)}</Text>

        <View style={styles.timerActions}>
          {!rodando ? (
            <TouchableOpacity style={styles.primaryBtn} onPress={() => setRodando(true)}>
              <Text style={styles.primaryBtnText}>Iniciar prova</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.secondaryBtn} onPress={() => setRodando(false)}>
              <Text style={styles.secondaryBtnText}>Pausar</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => {
              setTempo(0);
              setRodando(false);
            }}
          >
            <Text style={styles.secondaryBtnText}>Zerar</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.helper}>
          Faça a peça e as questões no papel. O gabarito só aparece quando você clicar em “Revelar Gabarito”.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Enunciado da peça</Text>
        <Text style={styles.body}>
          {prova?.peca?.enunciado || 'Enunciado da peça não encontrado.'}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Questões</Text>

        {questoes.length === 0 ? (
          <Text style={styles.body}>Nenhuma questão encontrada nesta prova.</Text>
        ) : (
          questoes.map((q: any, index: number) => (
            <View key={index} style={styles.questionBlock}>
              <Text style={styles.questionTitle}>Questão {index + 1}</Text>
              <Text style={styles.body}>{q?.pergunta || q?.enunciado || 'Questão sem enunciado.'}</Text>

              {mostrarGabarito && (
                <View style={styles.gabaritoBox}>
                  <Text style={styles.gabaritoTitle}>Gabarito</Text>
                  <Text style={styles.body}>{q?.gabarito || 'Gabarito não encontrado.'}</Text>
                </View>
              )}
            </View>
          ))
        )}
      </View>

      {!mostrarGabarito ? (
        <TouchableOpacity style={styles.revealBtn} onPress={() => setMostrarGabarito(true)}>
          <Text style={styles.revealBtnText}>Revelar Gabarito</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Gabarito da peça</Text>
          <Text style={styles.label}>Peça correta</Text>
          <Text style={styles.body}>
            {prova?.peca?.gabarito?.peca_correta || prova?.peca?.tipo || 'Não informado.'}
          </Text>

          {!!prova?.peca?.gabarito?.justificativa_peca && (
            <>
              <Text style={styles.label}>Justificativa</Text>
              <Text style={styles.body}>{prova.peca.gabarito.justificativa_peca}</Text>
            </>
          )}

          {Array.isArray(prova?.peca?.gabarito?.fundamentos) && prova.peca.gabarito.fundamentos.length > 0 && (
            <>
              <Text style={styles.label}>Fundamentos</Text>
              {prova.peca.gabarito.fundamentos.map((item: string, idx: number) => (
                <Text key={idx} style={styles.bullet}>• {item}</Text>
              ))}
            </>
          )}

          {Array.isArray(prova?.peca?.gabarito?.pedidos) && prova.peca.gabarito.pedidos.length > 0 && (
            <>
              <Text style={styles.label}>Pedidos</Text>
              {prova.peca.gabarito.pedidos.map((item: string, idx: number) => (
                <Text key={idx} style={styles.bullet}>• {item}</Text>
              ))}
            </>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#0b0b12',
    gap: 16,
  },
  back: {
    color: '#b8a8ff',
    fontSize: 16,
    marginBottom: 8,
  },
  badge: {
    color: '#9b87f5',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  title: {
    color: '#f5f5f7',
    fontSize: 22,
    fontWeight: '800',
  },
  date: {
    color: '#8e8ea0',
    fontSize: 14,
    marginTop: 4,
  },
  timerCard: {
    backgroundColor: '#161622',
    borderColor: '#2a2a3a',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },
  timerLabel: {
    color: '#b8b8c7',
    fontSize: 13,
    marginBottom: 6,
  },
  timerValue: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 12,
  },
  timerActions: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  helper: {
    color: '#9a9aad',
    fontSize: 13,
    lineHeight: 20,
  },
  primaryBtn: {
    backgroundColor: '#6d28d9',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  primaryBtnText: {
    color: '#fff',
    fontWeight: '700',
  },
  secondaryBtn: {
    backgroundColor: '#232334',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  secondaryBtnText: {
    color: '#fff',
    fontWeight: '700',
  },
  revealBtn: {
    backgroundColor: '#7c3aed',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  revealBtnText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 15,
  },
  card: {
    backgroundColor: '#141421',
    borderWidth: 1,
    borderColor: '#2a2a3a',
    borderRadius: 16,
    padding: 16,
  },
  sectionTitle: {
    color: '#b794f4',
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginBottom: 12,
    letterSpacing: 1,
  },
  questionBlock: {
    marginBottom: 20,
  },
  questionTitle: {
    color: '#f3f3f8',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  gabaritoBox: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#1b1b2b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#34344a',
  },
  gabaritoTitle: {
    color: '#c4b5fd',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },
  label: {
    color: '#d6bcfa',
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 6,
  },
  body: {
    color: '#e8e8f0',
    fontSize: 15,
    lineHeight: 24,
  },
  bullet: {
    color: '#e8e8f0',
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 4,
  },
});
