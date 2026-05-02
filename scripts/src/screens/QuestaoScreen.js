import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import { supabase } from '../lib/supabase';
import Groq from "groq-sdk";
import VadeModal from '../components/VadeModal';

// Configuração do Groq - Motor de IA
const groq = new Groq({ 
  apiKey: process.env.GROQ_API_KEY,  // ✅ Corrigido: era "const groqKey = ..."
  dangerouslyAllowBrowser: true 
});

const DISCIPLINAS = [
  { id: 'todas', label: 'GERAL' },
  { id: 'Ética Profissional', label: 'ÉTICA' },
  { id: 'Direito Constitucional', label: 'CONST.' },
  { id: 'Direito Administrativo', label: 'ADM.' },
  { id: 'Direito Civil', label: 'CIVIL' },
  { id: 'Direito Processual Civil', label: 'PROC. CIVIL' },
  { id: 'Direito Penal', label: 'PENAL' },
  { id: 'Direito Processual Penal', label: 'PROC. PENAL' },
  { id: 'Direito do Trabalho', label: 'TRABALHO' },
  { id: 'Direito Processual do Trabalho', label: 'PROC. TRABALHO' },
  { id: 'Direito Tributário', label: 'TRIB.' },
  { id: 'Direito Empresarial', label: 'EMPRESARIAL' },
];

export default function QuestaoScreen() {
  const [questao, setQuestao] = useState(null);
  const [loading, setLoading] = useState(true);
  const [respondida, setRespondida] = useState(false);
  const [opcaoSelecionada, setOpcaoSelecionada] = useState(null);
  const [filtro, setFiltro] = useState('todas');
  
  // Estados para IA e Modal
  const [explicacao, setExplicacao] = useState('');
  const [artigosCitados, setArtigosCitados] = useState([]);
  const [loadingAI, setLoadingAI] = useState(false);
  const [loadingVade, setLoadingVade] = useState(false);
  const [modalVade, setModalVade] = useState(false);

  useEffect(() => { fetchQuestao(); }, [filtro]);

  async function fetchQuestao() {
    try {
      setLoading(true); setRespondida(false); setOpcaoSelecionada(null); 
      setExplicacao(''); setArtigosCitados([]);
      
      let query = supabase.from('questoes').select('*');
      if (filtro !== 'todas') query = query.eq('disciplina', filtro);
      
      const { data } = await query.limit(25);
      if (data && data.length > 0) {
        setQuestao(data[Math.floor(Math.random() * data.length)]);
      } else { setQuestao(null); }
    } catch (err) { console.error(err); } finally { setLoading(false); }
  }

  async function salvarProgresso(foiAcerto) {
    try {
      await supabase.from('progresso').insert([
        { questao_id: questao.id, disciplina: questao.disciplina, acertou: foiAcerto }
      ]);
    } catch (err) { console.error("Erro ao peticionar progresso:", err); }
  }

  // BOTÃO 1: Explicação Rápida (O "Pulo do Gato")
  async function pedirLuraExplica() {
    try {
      setLoadingAI(true);
      const res = await groq.chat.completions.create({
        messages: [
          { role: "system", content: "Aja como uma professora da OAB. Explique de forma muito curta e direta por que a alternativa está correta." },
          { role: "user", content: `Questão: ${questao.enunciado}. Correta: ${questao.resposta_correta}.` }
        ],
        model: "llama-3.3-70b-versatile",
      });
      setExplicacao(res.choices[0].message.content);
    } catch (err) { setExplicacao("Erro na consulta rápida."); }
    finally { setLoadingAI(false); }
  }

  // BOTÃO 2: Abrir Vademecum e buscar artigos
  async function abrirVademecum() {
    setModalVade(true);
    setLoadingVade(true);
    setExplicacao(''); // Limpa explicações anteriores para focar na lei
    try {
      const res = await groq.chat.completions.create({
        messages: [
          { role: "system", content: "Liste os artigos da lei seca fundamentais para esta questão. Formate cada artigo começando com 'Art.' e separe-os por uma quebra de linha." },
          { role: "user", content: `Questão: ${questao.enunciado}.` }
        ],
        model: "llama-3.3-70b-versatile",
      });
      const lista = res.choices[0].message.content.split('\n').filter(line => line.trim() !== '');
      setArtigosCitados(lista);
    } catch (err) { setArtigosCitados(["Erro ao carregar legislação."]); }
    finally { setLoadingVade(false); }
  }

  // AÇÃO NO MODAL: Análise profunda de um artigo específico
  async function explicarArtigoNoVade(artigo) {
    setLoadingVade(true);
    try {
      const res = await groq.chat.completions.create({
        messages: [
          { role: "system", content: "Compare a doutrina e jurisprudência deste artigo especificamente, citando autores populares da OAB." },
          { role: "user", content: artigo }
        ],
        model: "llama-3.3-70b-versatile",
      });
      setExplicacao(res.choices[0].message.content);
    } catch (err) { setExplicacao("Erro na análise doutrinária."); }
    finally { setLoadingVade(false); }
  }

  const validarResposta = (letra) => {
    if (respondida) return;
    const foiAcerto = letra === questao.resposta_correta;
    setOpcaoSelecionada(letra); setRespondida(true);
    salvarProgresso(foiAcerto);
  };

  return (
    <View style={styles.safeContainer}>
      <VadeModal 
        visivel={modalVade} 
        fechar={() => setModalVade(false)} 
        artigos={artigosCitados}
        aoExplicarArtigo={explicarArtigoNoVade}
        loadingArtigo={loadingVade}
        conteudo={explicacao}
      />

      <View style={styles.headerFiltros}>
        <FlatList 
          data={DISCIPLINAS}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[styles.filtroBadge, filtro === item.id && styles.filtroAtivo]} 
              onPress={() => setFiltro(item.id)}
            >
              <Text style={[styles.filtroLabel, filtro === item.id && styles.filtroLabelAtivo]}>{item.label}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtrosList}
        />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.center}><ActivityIndicator size="large" color="#4F46E5" /></View>
        ) : !questao ? (
          <View style={styles.center}><Text style={styles.emptyText}>⚖️ Nenhuma questão encontrada.</Text></View>
        ) : (
          <>
            <View style={styles.metaContainer}>
              <Text style={styles.origemText}>{questao.origem} • {questao.disciplina}</Text>
            </View>

            <View style={styles.enunciadoCard}>
              <Text style={styles.enunciadoTexto}>{questao.enunciado}</Text>
            </View>

            <View style={styles.alternativasWrapper}>
              {['A', 'B', 'C', 'D'].map((letra) => {
                const isCorreta = respondida && letra === questao.resposta_correta;
                const isErrada = respondida && opcaoSelecionada === letra && letra !== questao.resposta_correta;
                return (
                  <TouchableOpacity 
                    key={letra} 
                    onPress={() => validarResposta(letra)}
                    style={[
                      styles.opcaoCard,
                      opcaoSelecionada === letra && styles.opcaoFoco,
                      isCorreta && styles.opcaoSucesso,
                      isErrada && styles.opcaoFalha,
                      respondida && letra !== questao.resposta_correta && letra !== opcaoSelecionada && { opacity: 0.4 }
                    ]}
                  >
                    <View style={[styles.letraContainer, isCorreta && styles.letraSucesso, isErrada && styles.letraFalha]}>
                      <Text style={[styles.letraLabel, (isCorreta || isErrada) && {color: '#FFF'}]}>{letra}</Text>
                    </View>
                    <Text style={styles.opcaoTexto}>{questao[`alternativa_${letra.toLowerCase()}`]}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {respondida && (
              <View style={styles.actionsContainer}>
                <View style={styles.rowButtons}>
                  <TouchableOpacity style={[styles.btnAction, { backgroundColor: '#8B5CF6' }]} onPress={pedirLuraExplica} disabled={loadingAI}>
                    {loadingAI ? <ActivityIndicator color="#FFF" /> : <Text style={styles.btnActionText}>✨ LURA EXPLICA</Text>}
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={[styles.btnAction, { backgroundColor: '#10B981' }]} onPress={abrirVademecum}>
                    <Text style={styles.btnActionText}>📚 LEI SECA</Text>
                  </TouchableOpacity>
                </View>

                {explicacao && !modalVade && (
                   <View style={styles.quickExplicacao}>
                      <Text style={styles.quickText}>{explicacao}</Text>
                   </View>
                )}

                <TouchableOpacity style={styles.btnNext} onPress={fetchQuestao}>
                  <Text style={styles.btnNextText}>PRÓXIMA QUESTÃO</Text>
                </TouchableOpacity>
              </View>
            )}
            <View style={{height: 40}} />
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: '#F8FAFC' },
  headerFiltros: { backgroundColor: '#FFF', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  filtrosList: { paddingHorizontal: 20, gap: 8 },
  filtroBadge: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#E2E8F0' },
  filtroAtivo: { backgroundColor: '#4F46E5', borderColor: '#4F46E5' },
  filtroLabel: { fontSize: 11, fontWeight: '800', color: '#64748B' },
  filtroLabelAtivo: { color: '#FFF' },
  container: { flex: 1, paddingHorizontal: 20 },
  center: { height: 500, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 15, fontWeight: 'bold', color: '#64748B' },
  metaContainer: { marginTop: 20, marginBottom: 10 },
  origemText: { fontSize: 12, color: '#94A3B8', fontWeight: '700' },
  enunciadoCard: { marginBottom: 25 },
  enunciadoTexto: { fontSize: 17, color: '#1E293B', lineHeight: 26 },
  alternativasWrapper: { gap: 10 },
  opcaoCard: { flexDirection: 'row', backgroundColor: '#FFF', padding: 16, borderRadius: 14, borderWidth: 1.5, borderColor: '#F1F5F9', alignItems: 'center' },
  opcaoFoco: { borderColor: '#4F46E5' },
  opcaoSucesso: { borderColor: '#10B981', backgroundColor: '#F0FDF4' },
  opcaoFalha: { borderColor: '#EF4444', backgroundColor: '#FEF2F2' },
  letraContainer: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  letraSucesso: { backgroundColor: '#10B981' },
  letraFalha: { backgroundColor: '#EF4444' },
  letraLabel: { fontWeight: 'bold', color: '#64748B' },
  opcaoTexto: { flex: 1, fontSize: 15, color: '#334155', lineHeight: 20 },
  actionsContainer: { marginTop: 30, gap: 15 },
  rowButtons: { flexDirection: 'row', gap: 10 },
  btnAction: { flex: 1, padding: 18, borderRadius: 16, alignItems: 'center', justifyContent: 'center', elevation: 2 },
  btnActionText: { color: '#FFF', fontWeight: '800', fontSize: 12, letterSpacing: 1 },
  quickExplicacao: { backgroundColor: '#F5F3FF', padding: 15, borderRadius: 12, borderLeftWidth: 4, borderLeftColor: '#8B5CF6' },
  quickText: { color: '#4C1D95', fontSize: 14, lineHeight: 20 },
  btnNext: { backgroundColor: '#1E293B', padding: 18, borderRadius: 16, alignItems: 'center' },
  btnNextText: { color: '#FFF', fontWeight: '700' }
});