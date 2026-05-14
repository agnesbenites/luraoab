import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator, TextInput, Alert
} from 'react-native';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const ICONES = {
  'Ética Profissional': '⚖️',
  'Filosofia do Direito': '🧠',
  'Direito Constitucional': '📜',
  'Direitos Humanos': '🕊️',
  'Direito Internacional': '🌐',
  'Direito Eleitoral': '🗳️',
  'Direito Administrativo': '🏛️',
  'Direito Tributário': '💰',
  'Direito Financeiro': '📊',
  'Direito Civil': '🤝',
  'Direito Processual Civil': '📋',
  'Direito Empresarial': '🏢',
  'Direito Penal': '🔒',
  'Direito Processual Penal': '🔍',
  'Direito do Trabalho': '👷',
  'Direito Processual do Trabalho': '⚙️',
  'Direito Ambiental': '🌿',
  'Direito do Consumidor': '🛒',
  'ECA': '👶',
  'Direito Previdenciário': '🛡️',
  'Legislação Especial': '📌',
};

export default function InsightsScreen() {
  const { user } = useAuth();
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selecionada, setSelecionada] = useState(null);
  const [aba, setAba] = useState('temas');
  const [temasEstudados, setTemasEstudados] = useState({});
  const [novoTema, setNovoTema] = useState('');
  const [adicionando, setAdicionando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [diagnosticoConcluido, setDiagnosticoConcluido] = useState(false);
  const [ordemDiagnostico, setOrdemDiagnostico] = useState([]);

  useEffect(() => {
    carregarDados();
  }, []);

  useEffect(() => {
    verificarDiagnostico();
  }, []);

  async function carregarDados() {
    setLoading(true);
    await Promise.all([carregarInsights(), carregarTemasEstudados()]);
    setLoading(false);
  }

  async function carregarInsights() {
    const { data } = await supabase
      .from('insights_materias')
      .select('*')
      .order('disciplina');
    setInsights(data ?? []);
  }

  async function carregarTemasEstudados() {
    const { data } = await supabase
      .from('temas_estudados')
      .select('*')
      .eq('user_id', user.id);

    // Monta mapa: { "Disciplina|||Tema": { id, estudado, personalizado } }
    const mapa = {};
    (data ?? []).forEach(t => {
      mapa[`${t.disciplina}|||${t.tema}`] = {
        id: t.id, estudado: t.estudado, personalizado: t.personalizado
      };
    });
    setTemasEstudados(mapa);
  }

  async function verificarDiagnostico() {
    // Verifica se tem simulado diagnóstico OU simulado completo concluído (mais recente)
    const { data: sessao } = await supabase
      .from('sessoes')
      .select('id, modo')
      .eq('user_id', user.id)
      .eq('diagnostico_concluido', true)
      .in('modo', ['diagnostico', 'simulado_completo'])
      .order('atualizada_em', { ascending: false }) // pega o mais recente
      .limit(1)
      .single();

    if (!sessao) return;

    // Busca desempenho por disciplina do diagnóstico
    const { data: progresso } = await supabase
      .from('progresso')
      .select('disciplina, acertou')
      .eq('sessao_id', sessao.id);

    if (!progresso || progresso.length === 0) return;

    const mapa = {};
    progresso.forEach(({ disciplina, acertou }) => {
      if (!mapa[disciplina]) mapa[disciplina] = { total: 0, acertos: 0 };
      mapa[disciplina].total += 1;
      if (acertou) mapa[disciplina].acertos += 1;
    });

    // Ordena do pior para o melhor desempenho
    const ordenado = Object.entries(mapa)
      .map(([disciplina, v]) => ({
        disciplina,
        taxa: Math.round((v.acertos / v.total) * 100),
      }))
      .sort((a, b) => a.taxa - b.taxa);

    setOrdemDiagnostico(ordenado);
    setDiagnosticoConcluido(true);
  }

  async function toggleEstudado(disciplina, tema) {
    const chave = `${disciplina}|||${tema}`;
    const atual = temasEstudados[chave];

    // Otimista: atualiza UI imediatamente
    setTemasEstudados(prev => ({
      ...prev,
      [chave]: { ...prev[chave], estudado: !atual?.estudado }
    }));

    if (atual?.id) {
      // Já existe — atualiza
      await supabase
        .from('temas_estudados')
        .update({ estudado: !atual.estudado })
        .eq('id', atual.id);
    } else {
      // Cria novo
      const { data } = await supabase
        .from('temas_estudados')
        .insert([{ user_id: user.id, disciplina, tema, estudado: true, personalizado: false }])
        .select()
        .single();
      if (data) {
        setTemasEstudados(prev => ({
          ...prev,
          [chave]: { id: data.id, estudado: true, personalizado: false }
        }));
      }
    }
  }

  async function adicionarTemaPersonalizado() {
    if (!novoTema.trim() || !selecionada) return;
    setSalvando(true);
    const chave = `${selecionada}|||${novoTema.trim()}`;

    const { data, error } = await supabase
      .from('temas_estudados')
      .insert([{
        user_id: user.id,
        disciplina: selecionada,
        tema: novoTema.trim(),
        estudado: false,
        personalizado: true,
      }])
      .select()
      .single();

    if (!error && data) {
      setTemasEstudados(prev => ({
        ...prev,
        [chave]: { id: data.id, estudado: false, personalizado: true }
      }));
      setNovoTema('');
      setAdicionando(false);
    }
    setSalvando(false);
  }

  async function excluirTemaPersonalizado(disciplina, tema) {
    Alert.alert('Remover tema', `Remover "${tema}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover', style: 'destructive', onPress: async () => {
          const chave = `${disciplina}|||${tema}`;
          const id = temasEstudados[chave]?.id;
          if (id) await supabase.from('temas_estudados').delete().eq('id', id);
          setTemasEstudados(prev => {
            const novo = { ...prev };
            delete novo[chave];
            return novo;
          });
        }
      }
    ]);
  }

  function progressoMateria(disciplina, temas) {
    const total = temas.length;
    const feitos = temas.filter(t =>
      temasEstudados[`${disciplina}|||${t}`]?.estudado
    ).length;
    return { feitos, total };
  }

  const materia = insights.find(i => i.disciplina === selecionada);

  // Temas personalizados da disciplina selecionada
  const temasPersonalizados = selecionada
    ? Object.entries(temasEstudados)
      .filter(([chave, v]) =>
        chave.startsWith(`${selecionada}|||`) && v.personalizado
      )
      .map(([chave]) => chave.split('|||')[1])
    : [];

  if (loading) return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color="#4F46E5" />
    </View>
  );

  // Tela de detalhe da matéria
  if (selecionada && materia) {
    const todosOsTemas = [
      ...materia.temas_mais_cobrados,
      ...temasPersonalizados,
    ];
    const { feitos, total } = progressoMateria(selecionada, todosOsTemas);
    const pct = total > 0 ? Math.round((feitos / total) * 100) : 0;

    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => { setSelecionada(null); setAdicionando(false); }} style={styles.btnVoltar}>
          <Text style={styles.btnVoltarText}>← Voltar</Text>
        </TouchableOpacity>

        <Text style={styles.titulo}>
          {ICONES[selecionada] || '📚'} {selecionada}
        </Text>

        {/* Barra de progresso geral */}
        <View style={styles.progressoContainer}>
          <View style={styles.progressoTopo}>
            <Text style={styles.progressoLabel}>Temas estudados</Text>
            <Text style={styles.progressoPct}>{feitos}/{total} — {pct}%</Text>
          </View>
          <View style={styles.barraFundo}>
            <View style={[styles.barraPreenchida, { width: `${pct}%` }]} />
          </View>
        </View>

        {materia.dica_fgv && (
          <View style={styles.dicaFGV}>
            <Text style={styles.dicaFGVTitle}>🎯 Estratégia FGV</Text>
            <Text style={styles.dicaFGVText}>{materia.dica_fgv}</Text>
          </View>
        )}

        {/* Abas */}
        <View style={styles.abas}>
          {[
            { key: 'temas', label: '📊 Temas' },
            { key: 'pegadinhas', label: '⚠️ Pegadinhas' },
            { key: 'atencao', label: '🔎 Atenção' },
          ].map(a => (
            <TouchableOpacity
              key={a.key}
              style={[styles.aba, aba === a.key && styles.abaAtiva]}
              onPress={() => setAba(a.key)}
            >
              <Text style={[styles.abaText, aba === a.key && styles.abaTextAtiva]}>
                {a.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>

          {/* ABA TEMAS — com check */}
          {aba === 'temas' && (
            <>
              {/* Temas padrão */}
              {materia.temas_mais_cobrados.map((t, i) => {
                const estudado = temasEstudados[`${selecionada}|||${t}`]?.estudado ?? false;
                return (
                  <TouchableOpacity
                    key={i}
                    style={[styles.temaItem, estudado && styles.temaEstudado]}
                    onPress={() => toggleEstudado(selecionada, t)}
                  >
                    <View style={[styles.checkBox, estudado && styles.checkBoxAtivo]}>
                      {estudado && <Text style={styles.checkMark}>✓</Text>}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.temaNum, { color: '#4F46E5' }]}>{i + 1}</Text>
                      <Text style={[styles.temaTexto, estudado && styles.temaTextoEstudado]}>
                        {t}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}

              {/* Temas personalizados */}
              {temasPersonalizados.map((t, i) => {
                const estudado = temasEstudados[`${selecionada}|||${t}`]?.estudado ?? false;
                return (
                  <TouchableOpacity
                    key={`custom-${i}`}
                    style={[styles.temaItem, styles.temaPersonalizado, estudado && styles.temaEstudado]}
                    onPress={() => toggleEstudado(selecionada, t)}
                  >
                    <View style={[styles.checkBox, estudado && styles.checkBoxAtivo]}>
                      {estudado && <Text style={styles.checkMark}>✓</Text>}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.temaCustomLabel}>✏️ Personalizado</Text>
                      <Text style={[styles.temaTexto, estudado && styles.temaTextoEstudado]}>{t}</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => excluirTemaPersonalizado(selecionada, t)}
                      style={styles.btnExcluirTema}
                    >
                      <Text style={styles.btnExcluirTemaText}>✕</Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
                );
              })}

              {/* Adicionar tema personalizado */}
              {adicionando ? (
                <View style={styles.addTemaCard}>
                  <TextInput
                    style={styles.addTemaInput}
                    placeholder="Ex: Responsabilidade do transportador"
                    placeholderTextColor="#94A3B8"
                    value={novoTema}
                    onChangeText={setNovoTema}
                    autoFocus
                  />
                  <View style={styles.addTemaBotoes}>
                    <TouchableOpacity
                      style={styles.btnCancelarAdd}
                      onPress={() => { setAdicionando(false); setNovoTema(''); }}
                    >
                      <Text style={styles.btnCancelarAddText}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.btnSalvarAdd, (!novoTema.trim() || salvando) && { opacity: 0.4 }]}
                      onPress={adicionarTemaPersonalizado}
                      disabled={!novoTema.trim() || salvando}
                    >
                      {salvando
                        ? <ActivityIndicator color="#FFF" size="small" />
                        : <Text style={styles.btnSalvarAddText}>Adicionar</Text>
                      }
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.btnAddTema}
                  onPress={() => setAdicionando(true)}
                >
                  <Text style={styles.btnAddTemaText}>+ Adicionar tema para estudar</Text>
                </TouchableOpacity>
              )}
            </>
          )}

          {/* ABA PEGADINHAS */}
          {aba === 'pegadinhas' && materia.pegadinhas.map((p, i) => (
            <View key={i} style={[styles.item, styles.itemPegadinha]}>
              <Text style={styles.itemEmoji}>⚠️</Text>
              <Text style={styles.itemText}>{p}</Text>
            </View>
          ))}

          {/* ABA ATENÇÃO */}
          {aba === 'atencao' && materia.pontos_atencao.map((p, i) => (
            <View key={i} style={[styles.item, styles.itemAtencao]}>
              <Text style={styles.itemEmoji}>🔎</Text>
              <Text style={styles.itemText}>{p}</Text>
            </View>
          ))}

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    );
  }

  // Tela de lista de matérias
  return (
    <ScrollView style={styles.containerLista} showsVerticalScrollIndicator={false}>
      <Text style={styles.headerTitle}>📚 Inteligência de Prova</Text>
      <Text style={styles.headerSub}>Temas mais cobrados, pegadinhas e estratégias da FGV</Text>

      {/* Banner diagnóstico */}
      {!diagnosticoConcluido && (
        <View style={styles.bannerDiagnostico}>
          <Text style={styles.bannerDiagnosticoIcon}>🩺</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerDiagnosticoTitle}>Faça o Simulado Diagnóstico</Text>
            <Text style={styles.bannerDiagnosticoDesc}>
              Descubra suas matérias mais fracas e os insights serão ordenados por prioridade.
            </Text>
          </View>
        </View>
      )}

      {diagnosticoConcluido && (
        <View style={styles.bannerDiagnosticoConcluido}>
          <Text style={styles.bannerDiagnosticoTitle}>
            🎯 Ordem de estudo recomendada
          </Text>
          <Text style={styles.bannerDiagnosticoDesc}>
            Baseada no seu diagnóstico — do que mais precisa ao que já domina.
          </Text>
        </View>
      )}

      {/* Lista ordenada pelo diagnóstico ou padrão */}
      {(diagnosticoConcluido
        ? [
            // Disciplinas ordenadas pelo diagnóstico primeiro
            ...ordemDiagnostico
              .map(o => insights.find(i => i.disciplina === o.disciplina))
              .filter(Boolean),
            // Resto que não estava no diagnóstico
            ...insights.filter(i =>
              !ordemDiagnostico.find(o => o.disciplina === i.disciplina)
            ),
          ]
        : insights
      ).map(i => {
        const diagItem = ordemDiagnostico.find(o => o.disciplina === i.disciplina);
        const { feitos, total } = progressoMateria(i.disciplina, i.temas_mais_cobrados);
        const pct = total > 0 ? Math.round((feitos / total) * 100) : 0;

        return (
          <TouchableOpacity
            key={i.id}
            style={styles.card}
            onPress={() => { setSelecionada(i.disciplina); setAba('temas'); }}
          >
            <Text style={styles.cardIcon}>{ICONES[i.disciplina] || '📚'}</Text>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{i.disciplina}</Text>

              {/* Badge do diagnóstico */}
              {diagItem && (
                <View style={[
                  styles.diagBadge,
                  { backgroundColor: diagItem.taxa < 50 ? '#FEE2E2' : diagItem.taxa < 70 ? '#FEF3C7' : '#D1FAE5' }
                ]}>
                  <Text style={[
                    styles.diagBadgeText,
                    { color: diagItem.taxa < 50 ? '#EF4444' : diagItem.taxa < 70 ? '#F59E0B' : '#10B981' }
                  ]}>
                    🩺 Diagnóstico: {diagItem.taxa}%
                  </Text>
                </View>
              )}

              <View style={styles.cardProgressoRow}>
                <View style={styles.cardBarraFundo}>
                  <View style={[
                    styles.cardBarraPreenchida,
                    { width: `${pct}%`, backgroundColor: pct === 100 ? '#10B981' : '#4F46E5' }
                  ]} />
                </View>
                <Text style={styles.cardProgressoPct}>{pct}%</Text>
              </View>
              <Text style={styles.cardSub}>
                {feitos}/{total} temas • {i.pegadinhas.length} pegadinhas
              </Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        );
      })}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', paddingHorizontal: 20, paddingTop: 60 },
  containerLista: { flex: 1, backgroundColor: '#F8FAFC', paddingHorizontal: 20, paddingTop: 60 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 22, fontWeight: '900', color: '#1E293B', marginBottom: 6 },
  headerSub: { fontSize: 13, color: '#94A3B8', marginBottom: 24 },

  // Banner Diagnóstico
  bannerDiagnostico: {
    backgroundColor: '#FDF2F8', borderRadius: 16, padding: 18,
    flexDirection: 'row', alignItems: 'center', gap: 14,
    marginBottom: 20, borderWidth: 1.5, borderColor: '#FBCFE8',
  },
  bannerDiagnosticoConcluido: {
    backgroundColor: '#EEF2FF', borderRadius: 16, padding: 18,
    marginBottom: 20, borderWidth: 1.5, borderColor: '#C7D2FE',
  },
  bannerDiagnosticoIcon: { fontSize: 32 },
  bannerDiagnosticoTitle: { fontSize: 14, fontWeight: '800', color: '#1E293B', marginBottom: 4 },
  bannerDiagnosticoDesc: { fontSize: 12, color: '#64748B', lineHeight: 18 },

  // Card da lista
  card: {
    backgroundColor: '#FFF', borderRadius: 16, padding: 18, flexDirection: 'row',
    alignItems: 'center', marginBottom: 12, elevation: 1,
    borderWidth: 1, borderColor: '#F1F5F9',
  },
  cardIcon: { fontSize: 28, marginRight: 14 },
  cardBody: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '800', color: '#1E293B', marginBottom: 6 },
  diagBadge: { alignSelf: 'flex-start', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3, marginBottom: 6 },
  diagBadgeText: { fontSize: 11, fontWeight: '800' },
  cardProgressoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  cardBarraFundo: { flex: 1, height: 5, backgroundColor: '#F1F5F9', borderRadius: 4 },
  cardBarraPreenchida: { height: 5, borderRadius: 4 },
  cardProgressoPct: { fontSize: 11, fontWeight: '800', color: '#64748B', width: 30 },
  cardSub: { fontSize: 12, color: '#94A3B8' },
  chevron: { fontSize: 24, color: '#CBD5E1' },

  // Detalhe
  btnVoltar: { marginBottom: 16 },
  btnVoltarText: { fontSize: 14, fontWeight: '700', color: '#4F46E5' },
  titulo: { fontSize: 20, fontWeight: '900', color: '#1E293B', marginBottom: 16 },

  progressoContainer: { marginBottom: 16 },
  progressoTopo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressoLabel: { fontSize: 13, fontWeight: '700', color: '#64748B' },
  progressoPct: { fontSize: 13, fontWeight: '800', color: '#4F46E5' },
  barraFundo: { height: 8, backgroundColor: '#E2E8F0', borderRadius: 6 },
  barraPreenchida: { height: 8, borderRadius: 6, backgroundColor: '#4F46E5' },

  dicaFGV: {
    backgroundColor: '#FFF7ED', borderRadius: 14, padding: 16, marginBottom: 20,
    borderLeftWidth: 4, borderLeftColor: '#F59E0B',
  },
  dicaFGVTitle: { fontSize: 13, fontWeight: '800', color: '#92400E', marginBottom: 6 },
  dicaFGVText: { fontSize: 13, color: '#78350F', lineHeight: 20 },

  abas: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  aba: { flex: 1, paddingVertical: 10, borderRadius: 12, backgroundColor: '#F1F5F9', alignItems: 'center' },
  abaAtiva: { backgroundColor: '#4F46E5' },
  abaText: { fontSize: 12, fontWeight: '700', color: '#64748B' },
  abaTextAtiva: { color: '#FFF' },

  // Temas com check
  temaItem: {
    flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 14, padding: 14,
    marginBottom: 10, alignItems: 'center', borderWidth: 1, borderColor: '#F1F5F9', gap: 12,
  },
  temaEstudado: { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' },
  temaPersonalizado: { borderStyle: 'dashed', borderColor: '#C7D2FE' },
  checkBox: {
    width: 26, height: 26, borderRadius: 8, borderWidth: 2,
    borderColor: '#CBD5E1', justifyContent: 'center', alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  checkBoxAtivo: { backgroundColor: '#10B981', borderColor: '#10B981' },
  checkMark: { color: '#FFF', fontWeight: '900', fontSize: 14 },
  temaNum: { fontSize: 11, fontWeight: '800', marginBottom: 2 },
  temaTexto: { fontSize: 14, color: '#334155', lineHeight: 20 },
  temaTextoEstudado: { color: '#86EFAC', textDecorationLine: 'line-through' },
  temaCustomLabel: { fontSize: 10, fontWeight: '700', color: '#6366F1', marginBottom: 2 },
  btnExcluirTema: {
    width: 28, height: 28, borderRadius: 8, backgroundColor: '#FEE2E2',
    justifyContent: 'center', alignItems: 'center',
  },
  btnExcluirTemaText: { color: '#EF4444', fontWeight: '800', fontSize: 12 },

  // Adicionar tema
  btnAddTema: {
    borderWidth: 1.5, borderColor: '#C7D2FE', borderStyle: 'dashed',
    borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 4, marginBottom: 16,
  },
  btnAddTemaText: { color: '#4F46E5', fontWeight: '700', fontSize: 14 },
  addTemaCard: {
    backgroundColor: '#EEF2FF', borderRadius: 14, padding: 16, marginBottom: 16,
  },
  addTemaInput: {
    backgroundColor: '#FFF', borderRadius: 10, paddingHorizontal: 14,
    paddingVertical: 12, fontSize: 14, color: '#1E293B',
    borderWidth: 1, borderColor: '#C7D2FE',
  },
  addTemaBotoes: { flexDirection: 'row', gap: 10, marginTop: 10 },
  btnCancelarAdd: {
    flex: 1, padding: 12, backgroundColor: '#F1F5F9',
    borderRadius: 10, alignItems: 'center',
  },
  btnCancelarAddText: { color: '#64748B', fontWeight: '700' },
  btnSalvarAdd: {
    flex: 1, padding: 12, backgroundColor: '#4F46E5',
    borderRadius: 10, alignItems: 'center',
  },
  btnSalvarAddText: { color: '#FFF', fontWeight: '800' },

  // Pegadinhas / Atenção
  item: {
    flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 12, padding: 14,
    marginBottom: 10, alignItems: 'flex-start', borderWidth: 1, borderColor: '#F1F5F9',
  },
  itemPegadinha: { borderColor: '#FEE2E2', backgroundColor: '#FFF5F5' },
  itemAtencao: { borderColor: '#E0E7FF', backgroundColor: '#F5F7FF' },
  itemEmoji: { fontSize: 16, marginRight: 12, marginTop: 1 },
  itemText: { flex: 1, fontSize: 14, color: '#334155', lineHeight: 20 },
});