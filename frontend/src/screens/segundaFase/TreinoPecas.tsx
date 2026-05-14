import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, StatusBar, TextInput,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { theme2fase as t } from '../../constants/theme2fase';
import { getProvasDisponiveis, getProva } from '../../data/provasMap';

export default function TreinoPecas() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const areaNome = route.params?.areaNome || '';
  const areaId = route.params?.areaId || '';

  const pecas = useMemo(() => {
    const nums = getProvasDisponiveis(areaId);
    return nums
      .map((num) => ({ exame: num, peca: getProva(areaId, num)?.peca }))
      .filter((p) => p.peca?.enunciado)
      .sort(() => Math.random() - 0.5);
  }, [areaId]);

  const [indice, setIndice] = useState(0);
  const [resposta, setResposta] = useState('');
  const [fase, setFase] = useState<'enunciado' | 'escrevendo' | 'gabarito'>('enunciado');

  const proxima = () => {
    setIndice((i) => (i + 1) % pecas.length);
    setResposta(''); setFase('enunciado');
  };

  if (pecas.length === 0) return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Treino de Peças</Text>
        <Text style={styles.wip}>Nenhuma peça encontrada para esta área.</Text>
      </ScrollView>
    </View>
  );

  const atual = pecas[indice];
  const gab = atual.peca.gabarito;
  const pont = atual.peca.pontuacao;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={t.background} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Voltar</Text>
        </TouchableOpacity>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.badge}>2ª FASE — {areaNome.toUpperCase()}</Text>
            <Text style={styles.title}>Treino de Peças</Text>
          </View>
          <View style={styles.contadorBox}>
            <Text style={styles.contadorNum}>{indice + 1}</Text>
            <Text style={styles.contadorTotal}>/{pecas.length}</Text>
          </View>
        </View>
        <Text style={styles.exameRef}>{atual.exame}º Exame de Ordem</Text>

        <View style={styles.enunciadoBox}>
          <Text style={styles.secaoLabel}>ENUNCIADO</Text>
          <Text style={styles.enunciadoText}>{atual.peca.enunciado}</Text>
        </View>

        {fase === 'enunciado' && (
          <TouchableOpacity style={styles.btnPrimary} onPress={() => setFase('escrevendo')}>
            <Text style={styles.btnText}>✍️  Escrever minha resposta</Text>
          </TouchableOpacity>
        )}

        {fase === 'escrevendo' && (
          <View style={styles.escritaBox}>
            <Text style={styles.secaoLabel}>SUA RESPOSTA</Text>
            <TextInput
              style={styles.textArea}
              multiline
              placeholder="Escreva sua peça aqui..."
              placeholderTextColor={t.textMuted}
              value={resposta}
              onChangeText={setResposta}
              textAlignVertical="top"
            />
            <TouchableOpacity style={styles.btnPrimary} onPress={() => setFase('gabarito')}>
              <Text style={styles.btnText}>Ver gabarito →</Text>
            </TouchableOpacity>
          </View>
        )}

        {fase === 'gabarito' && (
          <View style={styles.gabSection}>
            {resposta.length > 0 && (
              <View style={styles.respostaBox}>
                <Text style={styles.secaoLabel}>SUA RESPOSTA</Text>
                <Text style={styles.respostaText}>{resposta}</Text>
              </View>
            )}
            <View style={styles.gabBox}>
              <Text style={styles.secaoLabel}>GABARITO OFICIAL</Text>
              {gab?.peca_correta && <View style={styles.gabItem}><Text style={styles.gabLabel}>Peça correta</Text><Text style={styles.gabValue}>{gab.peca_correta}</Text></View>}
              {gab?.justificativa_peca && <View style={styles.gabItem}><Text style={styles.gabLabel}>Justificativa</Text><Text style={styles.gabValue}>{gab.justificativa_peca}</Text></View>}
              {gab?.enderecamento && <View style={styles.gabItem}><Text style={styles.gabLabel}>Endereçamento</Text><Text style={styles.gabValue}>{gab.enderecamento}</Text></View>}
              {gab?.fundamentos?.length > 0 && (
                <View style={styles.gabItem}>
                  <Text style={styles.gabLabel}>Fundamentos</Text>
                  {gab.fundamentos.map((f: string, i: number) => <Text key={i} style={styles.gabBullet}>• {f}</Text>)}
                </View>
              )}
              {gab?.pedidos?.length > 0 && (
                <View style={styles.gabItem}>
                  <Text style={styles.gabLabel}>Pedidos</Text>
                  {gab.pedidos.map((p: string, i: number) => <Text key={i} style={styles.gabBullet}>• {p}</Text>)}
                </View>
              )}
            </View>
            {pont?.itens?.length > 0 && (
              <View style={styles.pontBox}>
                <Text style={styles.secaoLabel}>DISTRIBUIÇÃO DE PONTOS</Text>
                {pont.itens.map((it: any, i: number) => (
                  <View key={i} style={styles.pontItem}>
                    <Text style={styles.pontDesc}>{it.item}</Text>
                    <Text style={styles.pontValor}>{it.valor}</Text>
                  </View>
                ))}
              </View>
            )}
            <TouchableOpacity style={styles.btnProxima} onPress={proxima}>
              <Text style={styles.btnProximaText}>Próxima peça →</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: t.background },
  scroll: { padding: 24, paddingTop: 56, paddingBottom: 48 },
  back: { color: t.accentMuted, fontSize: 14, marginBottom: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  badge: { fontSize: 11, color: t.accentMuted, letterSpacing: 2, fontWeight: '700', marginBottom: 4 },
  title: { fontSize: 28, fontWeight: 'bold', color: t.textPrimary },
  contadorBox: { flexDirection: 'row', alignItems: 'baseline', marginTop: 8 },
  contadorNum: { fontSize: 24, fontWeight: 'bold', color: t.accent },
  contadorTotal: { fontSize: 14, color: t.textMuted },
  exameRef: { fontSize: 12, color: t.textMuted, marginBottom: 16 },
  enunciadoBox: { backgroundColor: t.surface, borderRadius: 12, borderWidth: 1, borderColor: t.border, padding: 16, marginBottom: 16 },
  secaoLabel: { fontSize: 10, color: t.accentMuted, letterSpacing: 2, fontWeight: '700', marginBottom: 8 },
  enunciadoText: { fontSize: 14, color: t.textSecondary, lineHeight: 22 },
  btnPrimary: { backgroundColor: t.primary, borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginBottom: 16 },
  btnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  escritaBox: { gap: 12 },
  textArea: { backgroundColor: t.surface, borderRadius: 12, borderWidth: 1, borderColor: t.border, padding: 14, fontSize: 14, color: t.textPrimary, lineHeight: 22, minHeight: 200 },
  gabSection: { gap: 14 },
  respostaBox: { backgroundColor: t.surface, borderRadius: 12, borderWidth: 1, borderColor: t.border, padding: 14 },
  respostaText: { fontSize: 13, color: t.textSecondary, lineHeight: 20 },
  gabBox: { backgroundColor: t.surface, borderRadius: 12, borderWidth: 1, borderColor: t.primary, padding: 16, gap: 12 },
  gabItem: { gap: 4 },
  gabLabel: { fontSize: 11, color: t.accentMuted, fontWeight: '700', letterSpacing: 1 },
  gabValue: { fontSize: 14, color: t.textPrimary, lineHeight: 20 },
  gabBullet: { fontSize: 13, color: t.textSecondary, lineHeight: 20, paddingLeft: 4 },
  pontBox: { backgroundColor: t.surface, borderRadius: 12, borderWidth: 1, borderColor: t.border, padding: 16, gap: 8 },
  pontItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: t.border },
  pontDesc: { flex: 1, fontSize: 13, color: t.textSecondary, lineHeight: 18, paddingRight: 12 },
  pontValor: { fontSize: 13, fontWeight: '700', color: t.accent },
  btnProxima: { borderWidth: 1.5, borderColor: t.accent, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  btnProximaText: { fontSize: 15, fontWeight: '700', color: t.accent },
  wip: { fontSize: 16, color: t.textMuted, marginTop: 40, textAlign: 'center' },
});