import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, ActivityIndicator, Modal, Share, Alert
} from 'react-native';
import Groq from 'groq-sdk';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const groq = new Groq({
  apiKey: process.env.EXPO_PUBLIC_GROQ_API_KEY,
  dangerouslyAllowBrowser: true
});

const LEIS = [
  { id: 'CF', label: '📜 Constituição Federal', desc: 'CF/88' },
  { id: 'CC', label: '🤝 Código Civil', desc: 'Lei 10.406/02' },
  { id: 'CPC', label: '📋 Código de Processo Civil', desc: 'Lei 13.105/15' },
  { id: 'CP', label: '🔒 Código Penal', desc: 'Decreto-Lei 2.848/40' },
  { id: 'CPP', label: '🔍 Código de Processo Penal', desc: 'Decreto-Lei 3.689/41' },
  { id: 'CLT', label: '👷 CLT', desc: 'Decreto-Lei 5.452/43' },
  { id: 'CDC', label: '🛒 Código de Defesa do Consumidor', desc: 'Lei 8.078/90' },
  { id: 'CTN', label: '💰 Código Tributário Nacional', desc: 'Lei 5.172/66' },
  { id: 'ECA', label: '👶 ECA', desc: 'Lei 8.069/90' },
  { id: 'EOAB', label: '⚖️ Estatuto da OAB', desc: 'Lei 8.906/94' },
  { id: 'LEI_AMBIENTAL', label: '🌿 Lei de Crimes Ambientais', desc: 'Lei 9.605/98' },
  { id: 'LGPD', label: '🔐 LGPD', desc: 'Lei 13.709/18' },
];

const CORES = [
  { cor: 'amarelo', emoji: '🟡', tipo: 'Amarelo', uso: 'Artigos fundamentais / conceitos-base' },
  { cor: 'laranja', emoji: '🟠', tipo: 'Laranja', uso: 'Prazos e requisitos processuais' },
  { cor: 'azul', emoji: '🔵', tipo: 'Azul', uso: 'Competência (União, Estado, Município)' },
  { cor: 'verde', emoji: '🟢', tipo: 'Verde', uso: 'Exceções e ressalvas' },
  { cor: 'vermelho', emoji: '🔴', tipo: 'Vermelho', uso: 'Vedações e proibições' },
  { cor: 'roxo', emoji: '🟣', tipo: 'Roxo', uso: 'Súmulas e enunciados vinculados' },
];

const CLIPS = [
  { cor: '🔴', materia: 'Direito Constitucional' },
  { cor: '🔵', materia: 'Direito Civil / Processo Civil' },
  { cor: '🟢', materia: 'Direito do Trabalho / Proc. Trabalho' },
  { cor: '🟡', materia: 'Direito Penal / Proc. Penal' },
  { cor: '🟠', materia: 'Direito Empresarial' },
  { cor: '🟣', materia: 'Legislação Especial (CDC, ECA...)' },
];

const ARTIGOS_ESTRATEGICOS = [
  {
    disciplina: '📜 Constitucional',
    artigos: ['Art. 5º — Direitos e garantias fundamentais', 'Art. 22-24 — Competências legislativas', 'Art. 37 — Administração Pública', 'Art. 102 — Competências do STF', 'Art. 60 — Cláusulas pétreas / PEC'],
  },
  {
    disciplina: '🤝 Civil',
    artigos: ['Art. 186/927 — Responsabilidade civil', 'Art. 421 — Função social do contrato', 'Art. 1.228 — Direito de propriedade', 'Art. 1.521 — Responsabilidade por ato de terceiro', 'Art. 1.784 — Abertura da sucessão'],
  },
  {
    disciplina: '🔒 Penal',
    artigos: ['Art. 14 — Crime tentado', 'Art. 18 — Dolo e culpa', 'Art. 23 — Excludentes de ilicitude', 'Art. 59 — Dosimetria da pena', 'Art. 107 — Extinção da punibilidade'],
  },
  {
    disciplina: '👷 Trabalho',
    artigos: ['Art. 2º CLT — Conceito de empregador', 'Art. 3º CLT — Conceito de empregado', 'Art. 443 — Modalidades de contrato', 'Art. 477 — Rescisão contratual', 'Art. 818 — Ônus da prova'],
  },
  {
    disciplina: '📋 Proc. Civil',
    artigos: ['Art. 294-311 — Tutelas provisórias', 'Art. 319 — Requisitos da petição inicial', 'Art. 485-487 — Extinção do processo', 'Art. 966 — Ação rescisória', 'Art. 1.015 — Agravo de instrumento'],
  },
  {
    disciplina: '🔍 Proc. Penal',
    artigos: ['Art. 41 — Denúncia e queixa', 'Art. 312 — Prisão preventiva', 'Art. 563 — Princípio das nulidades', 'Art. 617 — Reformatio in pejus', 'Art. 647 — Habeas corpus'],
  },
];

export default function VadeMecumScreen() {
  const { user } = useAuth();
  const [aba, setAba] = useState('busca');

  // Busca livre
  const [busca, setBusca] = useState('');
  const [resultado, setResultado] = useState('');
  const [loadingBusca, setLoadingBusca] = useState(false);

  // Por lei
  const [leiSelecionada, setLeiSelecionada] = useState(null);
  const [perguntaLei, setPerguntaLei] = useState('');
  const [respostaLei, setRespostaLei] = useState('');
  const [loadingLei, setLoadingLei] = useState(false);
  const [articuloExpandido, setArticuloExpandido] = useState(null);

  // Marcações
  const [marcacoes, setMarcacoes] = useState([]);
  const [loadingMarcacoes, setLoadingMarcacoes] = useState(false);
  const [modalMarcar, setModalMarcar] = useState(false);
  const [novaLei, setNovaLei] = useState('');
  const [novoArtigo, setNovoArtigo] = useState('');
  const [novaDescricao, setNovaDescricao] = useState('');
  const [corSelecionada, setCorSelecionada] = useState(null);
  const [salvando, setSalvando] = useState(false);
  const [filtroLei, setFiltroLei] = useState('todas');

  // Debounce do modal
  const [previewArtigo, setPreviewArtigo] = useState('');
  const [loadingPreview, setLoadingPreview] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (aba === 'minhas') carregarMarcacoes();
  }, [aba]);

  async function carregarMarcacoes() {
    setLoadingMarcacoes(true);
    const { data } = await supabase
      .from('marcacoes_vade')
      .select('*')
      .eq('user_id', user.id)
      .order('lei', { ascending: true })
      .order('criado_em', { ascending: false });
    setMarcacoes(data ?? []);
    setLoadingMarcacoes(false);
  }

  async function salvarMarcacao() {
    if (!novaLei.trim() || !novoArtigo.trim() || !corSelecionada) return;
    setSalvando(true);
    const { error } = await supabase.from('marcacoes_vade').insert([{
      user_id: user.id,
      lei: novaLei.trim().toUpperCase(),
      artigo: novoArtigo.trim(),
      cor: corSelecionada.cor,
      cor_emoji: corSelecionada.emoji,
      descricao: novaDescricao.trim() || null,
    }]);
    if (!error) {
      setModalMarcar(false);
      setNovaLei('');
      setNovoArtigo('');
      setNovaDescricao('');
      setCorSelecionada(null);
      setPreviewArtigo('');
      carregarMarcacoes();
    }
    setSalvando(false);
  }

  async function excluirMarcacao(id) {
    Alert.alert('Remover marcação', 'Deseja remover este artigo da sua lista?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover', style: 'destructive', onPress: async () => {
          await supabase.from('marcacoes_vade').delete().eq('id', id);
          carregarMarcacoes();
        }
      }
    ]);
  }

  async function exportarLista() {
    const leisFiltradas = filtroLei === 'todas'
      ? marcacoes
      : marcacoes.filter(m => m.lei === filtroLei);

    const agrupado = leisFiltradas.reduce((acc, m) => {
      if (!acc[m.lei]) acc[m.lei] = [];
      acc[m.lei].push(m);
      return acc;
    }, {});

    const texto = Object.entries(agrupado).map(([lei, arts]) =>
      `📚 ${lei}\n` + arts.map(a =>
        `  ${a.cor_emoji} ${a.artigo}${a.descricao ? ` — ${a.descricao}` : ''}`
      ).join('\n')
    ).join('\n\n');

    await Share.share({
      message: `🖊️ Meus artigos para marcar no Vade Mecum\n\n${texto}\n\nGerado pelo app OAB Study`,
    });
  }

  async function buscarLivre() {
    if (!busca.trim()) return;
    setLoadingBusca(true);
    setResultado('');
    try {
      const res = await groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `Você é um assistente jurídico especializado na legislação brasileira atualizada.
Quando o usuário buscar um artigo ou tema:
1. Transcreva o artigo atualizado (com redações mais recentes)
2. Explique o que ele significa em linguagem simples
3. Cite 1-2 súmulas ou entendimentos relevantes se houver
4. Indique se há pegadinha frequente na OAB sobre esse artigo
Seja preciso e conciso. Use emojis para organizar.`
          },
          { role: 'user', content: busca }
        ],
        model: 'llama-3.3-70b-versatile',
      });
      setResultado(res.choices[0].message.content);
    } catch {
      setResultado('Erro na busca. Tente novamente.');
    } finally {
      setLoadingBusca(false);
    }
  }

  async function consultarLei() {
    if (!perguntaLei.trim() || !leiSelecionada) return;
    setLoadingLei(true);
    setRespostaLei('');
    try {
      const res = await groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `Você é um especialista em ${leiSelecionada.label}. 
Responda sobre artigos, institutos e dúvidas específicas dessa legislação.
Sempre cite o artigo exato, sua redação atualizada e o que a FGV costuma cobrar sobre ele.`
          },
          { role: 'user', content: perguntaLei }
        ],
        model: 'llama-3.3-70b-versatile',
      });
      setRespostaLei(res.choices[0].message.content);
    } catch {
      setRespostaLei('Erro na consulta. Tente novamente.');
    } finally {
      setLoadingLei(false);
    }
  }

  function onChangeArtigo(texto) {
    setNovoArtigo(texto);
    setPreviewArtigo('');
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!novaLei.trim() || !texto.trim()) return;
    debounceRef.current = setTimeout(() => buscarPreviewArtigo(novaLei, texto), 600);
  }

  async function buscarPreviewArtigo(lei, artigo) {
    setLoadingPreview(true);
    try {
      const res = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: 'Responda em no máximo 2 linhas o que diz este artigo, de forma direta e sem formatação.' },
          { role: 'user', content: `O que diz o ${artigo} da ${lei}?` }
        ],
        model: 'llama-3.3-70b-versatile',
      });
      setPreviewArtigo(res.choices[0].message.content);
    } catch {
      setPreviewArtigo('');
    } finally {
      setLoadingPreview(false);
    }
  }

  // Leis únicas para filtro
  const leisUnicas = ['todas', ...new Set(marcacoes.map(m => m.lei))];
  const marcacoesFiltradas = filtroLei === 'todas'
    ? marcacoes
    : marcacoes.filter(m => m.lei === filtroLei);

  // Agrupa por lei para exibição
  const marcacoesAgrupadas = marcacoesFiltradas.reduce((acc, m) => {
    if (!acc[m.lei]) acc[m.lei] = [];
    acc[m.lei].push(m);
    return acc;
  }, {});

  return (
    <View style={styles.container}>

      {/* Banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerText}>
          ⚠️ 1ª fase: sem consulta ao Vade. Use esta aba só para estudo!
          Esses são os principais artigos de cada legislação, se quiser outros artigos, utilize o campo para pesquisar
        </Text>
      </View>

      {/* Abas */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.abasScroll}
        contentContainerStyle={styles.abasContent}
      >
        {[
          { key: 'busca', label: '🔍 Busca' },
          { key: 'leis', label: '📚 Por Lei' },
          { key: 'minhas', label: '🖊️ Marcações' },
          { key: 'marcacao', label: '📖 Técnica' },
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
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>

        {/* ABA: BUSCA LIVRE */}
        {aba === 'busca' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Busca Livre</Text>
            <Text style={styles.sectionDesc}>Digite um artigo, lei, instituto ou dúvida jurídica.</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder='Ex: "Art. 5º CF", "prazo HC", "dolo eventual"'
                placeholderTextColor="#94A3B8"
                value={busca}
                onChangeText={setBusca}
                onSubmitEditing={buscarLivre}
                returnKeyType="search"
              />
              <TouchableOpacity style={styles.btnBuscar} onPress={buscarLivre} disabled={loadingBusca}>
                {loadingBusca
                  ? <ActivityIndicator color="#FFF" size="small" />
                  : <Text style={styles.btnBuscarText}>→</Text>
                }
              </TouchableOpacity>
            </View>
            {resultado !== '' && (
              <View style={styles.resultadoCard}>
                <Text style={styles.resultadoText}>{resultado}</Text>
              </View>
            )}
          </View>
        )}

        {/* ABA: POR LEI */}
        {aba === 'leis' && !leiSelecionada && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Escolha a Legislação</Text>
            {LEIS.map(lei => (
              <TouchableOpacity
                key={lei.id}
                style={styles.leiCard}
                onPress={() => { setLeiSelecionada(lei); setRespostaLei(''); setPerguntaLei(''); }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.leiLabel}>{lei.label}</Text>
                  <Text style={styles.leiDesc}>{lei.desc}</Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {aba === 'leis' && leiSelecionada && (
          <View style={styles.section}>
            <TouchableOpacity onPress={() => setLeiSelecionada(null)} style={styles.btnVoltar}>
              <Text style={styles.btnVoltarText}>← Voltar</Text>
            </TouchableOpacity>
            <Text style={styles.sectionTitle}>{leiSelecionada.label}</Text>
            {ARTIGOS_ESTRATEGICOS.filter(a =>
              leiSelecionada.label.toLowerCase().includes(
                a.disciplina.split(' ').slice(1).join(' ').toLowerCase().split('/')[0].trim()
              )
            ).map((bloco, i) => (
              <View key={i} style={styles.artigosCard}>
                <Text style={styles.artigosTitle}>⭐ Artigos estratégicos — toque para marcar</Text>
                {bloco.artigos.map((art, j) => {
                  // Extrai só "Art. Xº" do texto completo
                  const numero = art.split('—')[0].trim();
                  return (
                    <TouchableOpacity
                      key={j}
                      style={styles.artigoItemRow}
                      onPress={() => {
                        setNovaLei(leiSelecionada.id);
                        setNovoArtigo(numero);
                        setNovaDescricao(art.split('—')[1]?.trim() ?? '');
                        setPreviewArtigo('');
                        setCorSelecionada(null);
                        setModalMarcar(true);
                      }}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={styles.artigoItem}>• {art}</Text>
                      </View>
                      <Text style={styles.artigoMarcarBtn}>🖊️</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
            <Text style={styles.sectionDesc}>Digite sua dúvida sobre {leiSelecionada.desc}:</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder={`Ex: "O que diz o Art. 5º, LXVIII?"`}
                placeholderTextColor="#94A3B8"
                value={perguntaLei}
                onChangeText={setPerguntaLei}
                onSubmitEditing={consultarLei}
                returnKeyType="search"
              />
              <TouchableOpacity style={styles.btnBuscar} onPress={consultarLei} disabled={loadingLei}>
                {loadingLei
                  ? <ActivityIndicator color="#FFF" size="small" />
                  : <Text style={styles.btnBuscarText}>→</Text>
                }
              </TouchableOpacity>
            </View>
            {respostaLei !== '' && (
              <View style={styles.resultadoCard}>
                <Text style={styles.resultadoText}>{respostaLei}</Text>
              </View>
            )}
          </View>
        )}

        {/* ABA: MINHAS MARCAÇÕES */}
        {aba === 'minhas' && (
          <View style={styles.section}>
            <View style={styles.marcacoesHeader}>
              <View>
                <Text style={styles.sectionTitle}>Minhas Marcações</Text>
                <Text style={styles.sectionDesc}>
                  {marcacoes.length} artigo{marcacoes.length !== 1 ? 's' : ''} salvo{marcacoes.length !== 1 ? 's' : ''}
                </Text>
              </View>
              <TouchableOpacity style={styles.btnNovaMarc} onPress={() => setModalMarcar(true)}>
                <Text style={styles.btnNovaMarcText}>+ Marcar</Text>
              </TouchableOpacity>
            </View>

            {/* Filtro por lei */}
            {marcacoes.length > 0 && (
              <>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    {leisUnicas.map(l => (
                      <TouchableOpacity
                        key={l}
                        style={[styles.filtroBadge, filtroLei === l && styles.filtroBadgeAtivo]}
                        onPress={() => setFiltroLei(l)}
                      >
                        <Text style={[styles.filtroBadgeText, filtroLei === l && { color: '#FFF' }]}>
                          {l === 'todas' ? 'Todas' : l}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>

                {/* Botão exportar */}
                <TouchableOpacity style={styles.btnExportar} onPress={exportarLista}>
                  <Text style={styles.btnExportarText}>📤 Exportar lista para o vade físico</Text>
                </TouchableOpacity>
              </>
            )}

            {loadingMarcacoes ? (
              <ActivityIndicator color="#4F46E5" style={{ marginTop: 40 }} />
            ) : marcacoes.length === 0 ? (
              <View style={styles.emptyMarcacoes}>
                <Text style={styles.emptyIcon}>🖊️</Text>
                <Text style={styles.emptyTitle}>Nenhuma marcação ainda</Text>
                <Text style={styles.emptyDesc}>
                  Conforme for estudando e respondendo questões, marque os artigos que usar para criar sua lista de marcação no vade físico.
                </Text>
                <TouchableOpacity style={styles.btnNovaMarc} onPress={() => setModalMarcar(true)}>
                  <Text style={styles.btnNovaMarcText}>+ Adicionar primeiro artigo</Text>
                </TouchableOpacity>
              </View>
            ) : (
              Object.entries(marcacoesAgrupadas).map(([lei, arts]) => (
                <View key={lei} style={styles.grupoCard}>
                  <Text style={styles.grupoTitulo}>📚 {lei}</Text>
                  {arts.map(m => (
                    <View key={m.id} style={styles.marcacaoItem}>
                      <Text style={styles.marcacaoEmoji}>{m.cor_emoji}</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.marcacaoArtigo}>{m.artigo}</Text>
                        {m.descricao && (
                          <Text style={styles.marcacaoDesc}>{m.descricao}</Text>
                        )}
                        <Text style={styles.marcacaoCor}>
                          {CORES.find(c => c.cor === m.cor)?.uso ?? ''}
                        </Text>
                      </View>
                      <TouchableOpacity onPress={() => excluirMarcacao(m.id)} style={styles.btnExcluir}>
                        <Text style={styles.btnExcluirText}>✕</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              ))
            )}
          </View>
        )}

        {/* ABA: TÉCNICA */}
        {aba === 'marcacao' && (
          <View style={styles.section}>
            <View style={styles.alertCard}>
              <Text style={styles.alertTitle}>📋 Regras do Edital OAB</Text>
              <Text style={styles.alertItem}>✅ Grifos coloridos com marca-texto</Text>
              <Text style={styles.alertItem}>✅ Clips coloridos nas páginas</Text>
              <Text style={styles.alertItem}>✅ Remissões simples: → art. 5º CF</Text>
              <Text style={styles.alertItem}>✅ Marca-texto em GEL (não mancha)</Text>
              <Text style={[styles.alertItem, { color: '#EF4444' }]}>❌ Post-its com anotações</Text>
              <Text style={[styles.alertItem, { color: '#EF4444' }]}>❌ Roteiros de peças nas margens</Text>
              <Text style={[styles.alertItem, { color: '#EF4444' }]}>❌ Remissões que estruturem resposta</Text>
            </View>

            <Text style={styles.sectionTitle}>🖇️ Clips por Matéria</Text>
            <Text style={styles.sectionDesc}>Mini clips coloridos na lateral para navegar rápido na prova.</Text>
            {CLIPS.map((c, i) => (
              <View key={i} style={styles.clipCard}>
                <Text style={styles.clipCor}>{c.cor}</Text>
                <Text style={styles.clipMateria}>{c.materia}</Text>
              </View>
            ))}

            <Text style={[styles.sectionTitle, { marginTop: 24 }]}>🖊️ Marca-texto em Gel</Text>
            <Text style={styles.sectionDesc}>Gel não borra o papel. Cada cor com uma função específica.</Text>
            {CORES.map((m, i) => (
              <View key={i} style={styles.marcadorCard}>
                <Text style={styles.marcadorCor}>{m.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.marcadorTipo}>{m.tipo}</Text>
                  <Text style={styles.marcadorUso}>{m.uso}</Text>
                </View>
              </View>
            ))}

            <Text style={[styles.sectionTitle, { marginTop: 24 }]}>🔄 Ciclo de Marcação</Text>
            <Text style={styles.sectionDesc}>Marcar conforme pratica — não antes.</Text>
            {[
              { num: '1', text: 'Responda a questão dissertativa ou peça prática' },
              { num: '2', text: 'Pesquise o artigo/súmula que fundamentou sua resposta' },
              { num: '3', text: 'Registre no app (aba Marcações) com a cor correta' },
              { num: '4', text: 'Exporte a lista e marque no vade físico' },
              { num: '5', text: 'Na prova: você já sabe onde cada artigo está' },
            ].map((p, i) => (
              <View key={i} style={styles.cicloItem}>
                <View style={styles.cicloNum}>
                  <Text style={styles.cicloNumText}>{p.num}</Text>
                </View>
                <Text style={styles.cicloText}>{p.text}</Text>
              </View>
            ))}

            <Text style={[styles.sectionTitle, { marginTop: 24 }]}>⭐ Artigos Estratégicos</Text>
            <Text style={styles.sectionDesc}>Aparecem com mais frequência nas peças práticas.</Text>
            {ARTIGOS_ESTRATEGICOS.map((bloco, i) => (
              <TouchableOpacity
                key={i}
                style={styles.blocoCard}
                onPress={() => setArticuloExpandido(articuloExpandido === i ? null : i)}
              >
                <View style={styles.blocoHeader}>
                  <Text style={styles.blocoTitulo}>{bloco.disciplina}</Text>
                  <Text style={styles.chevron}>{articuloExpandido === i ? '↑' : '↓'}</Text>
                </View>
                {articuloExpandido === i && bloco.artigos.map((art, j) => (
                  <Text key={j} style={styles.artigoItem}>• {art}</Text>
                ))}
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={{ height: 60 }} />
      </ScrollView>

      {/* Modal: Nova Marcação */}
      <Modal visible={modalMarcar} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitulo}>🖊️ Marcar Artigo</Text>

            <Text style={styles.labelInput}>Legislação (ex: CF, CP, CLT)</Text>
            <TextInput
              style={styles.inputModal}
              placeholder="Ex: CF, CPC, CLT..."
              placeholderTextColor="#94A3B8"
              value={novaLei}
              onChangeText={t => setNovaLei(t.toUpperCase())}
              autoCapitalize="characters"
            />

            <Text style={styles.labelInput}>Artigo</Text>
            <TextInput
              style={styles.inputModal}
              placeholder="Ex: Art. 5º, II"
              placeholderTextColor="#94A3B8"
              value={novoArtigo}
              onChangeText={onChangeArtigo}
            />
            {loadingPreview && (
              <ActivityIndicator size="small" color="#4F46E5" style={{ marginTop: 8, alignSelf: 'flex-start' }} />
            )}
            {previewArtigo !== '' && (
              <View style={styles.previewCard}>
                <Text style={styles.previewText}>📖 {previewArtigo}</Text>
              </View>
            )}

            <Text style={styles.labelInput}>Observação (opcional)</Text>
            <TextInput
              style={[styles.inputModal, { height: 64 }]}
              placeholder="Ex: Base da ação popular"
              placeholderTextColor="#94A3B8"
              value={novaDescricao}
              onChangeText={setNovaDescricao}
              multiline
            />

            <Text style={styles.labelInput}>Cor do marca-texto</Text>
            <View style={styles.coresRow}>
              {CORES.map(c => (
                <TouchableOpacity
                  key={c.cor}
                  style={[
                    styles.corBotao,
                    corSelecionada?.cor === c.cor && styles.corBotaoAtivo
                  ]}
                  onPress={() => setCorSelecionada(c)}
                >
                  <Text style={{ fontSize: 24 }}>{c.emoji}</Text>
                  <Text style={styles.corLabel}>{c.tipo}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {corSelecionada && (
              <Text style={styles.corUso}>📌 {corSelecionada.uso}</Text>
            )}

            <View style={styles.modalBotoes}>
              <TouchableOpacity
                style={styles.btnCancelar}
                onPress={() => {
                  setModalMarcar(false);
                  setNovaLei(''); setNovoArtigo('');
                  setNovaDescricao(''); setCorSelecionada(null);
                  setPreviewArtigo('');
                }}
              >
                <Text style={styles.btnCancelarText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.btnSalvar,
                  (!novaLei || !novoArtigo || !corSelecionada) && { opacity: 0.4 }
                ]}
                onPress={salvarMarcacao}
                disabled={!novaLei || !novoArtigo || !corSelecionada || salvando}
              >
                {salvando
                  ? <ActivityIndicator color="#FFF" />
                  : <Text style={styles.btnSalvarText}>Salvar</Text>
                }
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', paddingTop: 52 },
  banner: {
    backgroundColor: '#FEF3C7', paddingVertical: 10, paddingHorizontal: 20,
    borderBottomWidth: 1, borderBottomColor: '#FCD34D',
  },
  bannerText: { fontSize: 12, fontWeight: '700', color: '#92400E', textAlign: 'center' },
  abasScroll: { backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  abasContent: { paddingHorizontal: 20, paddingVertical: 14, gap: 8 },
  aba: {
    paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12,
    backgroundColor: '#F1F5F9', alignItems: 'center',
  },
  abaAtiva: { backgroundColor: '#4F46E5' },
  abaText: { fontSize: 12, fontWeight: '700', color: '#64748B' },
  abaTextAtiva: { color: '#FFF' },
  scroll: { flex: 1 },
  section: { paddingHorizontal: 20, paddingTop: 24 },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: '#1E293B', marginBottom: 6 },
  sectionDesc: { fontSize: 13, color: '#64748B', marginBottom: 16, lineHeight: 20 },
  inputRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  input: {
    flex: 1, backgroundColor: '#FFF', borderRadius: 14, paddingHorizontal: 16,
    paddingVertical: 14, fontSize: 14, color: '#1E293B', borderWidth: 1, borderColor: '#E2E8F0',
  },
  btnBuscar: {
    backgroundColor: '#4F46E5', borderRadius: 14, width: 50,
    justifyContent: 'center', alignItems: 'center',
  },
  btnBuscarText: { color: '#FFF', fontSize: 20, fontWeight: '700' },
  resultadoCard: {
    backgroundColor: '#F5F3FF', borderRadius: 16, padding: 20,
    borderLeftWidth: 4, borderLeftColor: '#4F46E5', marginBottom: 16,
  },
  resultadoText: { fontSize: 14, color: '#1E293B', lineHeight: 22 },
  leiCard: {
    backgroundColor: '#FFF', borderRadius: 16, padding: 18, flexDirection: 'row',
    alignItems: 'center', marginBottom: 10, borderWidth: 1, borderColor: '#F1F5F9', elevation: 1,
  },
  leiLabel: { fontSize: 15, fontWeight: '700', color: '#1E293B' },
  leiDesc: { fontSize: 12, color: '#94A3B8', marginTop: 2 },
  chevron: { fontSize: 22, color: '#CBD5E1' },
  btnVoltar: { marginBottom: 16 },
  btnVoltarText: { fontSize: 14, fontWeight: '700', color: '#4F46E5' },
  artigosCard: {
    backgroundColor: '#FFF7ED', borderRadius: 14, padding: 16,
    marginBottom: 16, borderLeftWidth: 4, borderLeftColor: '#F59E0B',
  },
  artigosTitle: { fontSize: 13, fontWeight: '800', color: '#92400E', marginBottom: 8 },
  artigoItem: { fontSize: 13, color: '#334155', lineHeight: 22 },
  artigoItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  artigoMarcarBtn: { fontSize: 18, paddingLeft: 8 },
  previewCard: {
    backgroundColor: '#EEF2FF', borderRadius: 10, padding: 12,
    marginTop: 8, borderLeftWidth: 3, borderLeftColor: '#4F46E5',
  },
  previewText: { fontSize: 13, color: '#3730A3', lineHeight: 18 },

  // Marcações
  marcacoesHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: 16,
  },
  btnNovaMarc: {
    backgroundColor: '#4F46E5', paddingVertical: 10, paddingHorizontal: 18,
    borderRadius: 12,
  },
  btnNovaMarcText: { color: '#FFF', fontWeight: '800', fontSize: 13 },
  filtroBadge: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#E2E8F0',
  },
  filtroBadgeAtivo: { backgroundColor: '#4F46E5', borderColor: '#4F46E5' },
  filtroBadgeText: { fontSize: 12, fontWeight: '700', color: '#64748B' },
  btnExportar: {
    backgroundColor: '#F0FDF4', borderRadius: 14, padding: 16,
    alignItems: 'center', marginBottom: 20, borderWidth: 1, borderColor: '#BBF7D0',
  },
  btnExportarText: { color: '#059669', fontWeight: '800', fontSize: 14 },
  emptyMarcacoes: { marginTop: 40, alignItems: 'center', gap: 12, paddingHorizontal: 20 },
  emptyIcon: { fontSize: 48 },
  emptyTitle: { fontSize: 17, fontWeight: '800', color: '#1E293B' },
  emptyDesc: { fontSize: 13, color: '#94A3B8', textAlign: 'center', lineHeight: 20 },
  grupoCard: {
    backgroundColor: '#FFF', borderRadius: 16, padding: 16,
    marginBottom: 14, borderWidth: 1, borderColor: '#F1F5F9',
  },
  grupoTitulo: { fontSize: 15, fontWeight: '800', color: '#1E293B', marginBottom: 12 },
  marcacaoItem: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#F8FAFC',
  },
  marcacaoEmoji: { fontSize: 22, marginTop: 2 },
  marcacaoArtigo: { fontSize: 14, fontWeight: '700', color: '#1E293B' },
  marcacaoDesc: { fontSize: 13, color: '#64748B', marginTop: 2 },
  marcacaoCor: { fontSize: 11, color: '#94A3B8', marginTop: 4, fontWeight: '600' },
  btnExcluir: {
    width: 28, height: 28, borderRadius: 8, backgroundColor: '#FEE2E2',
    justifyContent: 'center', alignItems: 'center',
  },
  btnExcluirText: { color: '#EF4444', fontWeight: '800', fontSize: 12 },

  // Técnica
  alertCard: {
    backgroundColor: '#FFF', borderRadius: 16, padding: 18,
    marginBottom: 24, borderWidth: 1.5, borderColor: '#E2E8F0',
  },
  alertTitle: { fontSize: 14, fontWeight: '800', color: '#1E293B', marginBottom: 10 },
  alertItem: { fontSize: 13, color: '#334155', lineHeight: 26, fontWeight: '600' },
  clipCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF',
    borderRadius: 12, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: '#F1F5F9', gap: 14,
  },
  clipCor: { fontSize: 24 },
  clipMateria: { fontSize: 14, fontWeight: '600', color: '#334155' },
  marcadorCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF',
    borderRadius: 12, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: '#F1F5F9', gap: 14,
  },
  marcadorCor: { fontSize: 24 },
  marcadorTipo: { fontSize: 13, fontWeight: '800', color: '#1E293B' },
  marcadorUso: { fontSize: 12, color: '#64748B', marginTop: 2 },
  cicloItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 14, marginBottom: 14 },
  cicloNum: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: '#4F46E5',
    justifyContent: 'center', alignItems: 'center',
  },
  cicloNumText: { color: '#FFF', fontWeight: '800', fontSize: 14 },
  cicloText: { flex: 1, fontSize: 14, color: '#334155', lineHeight: 22, paddingTop: 4 },
  blocoCard: {
    backgroundColor: '#FFF', borderRadius: 14, padding: 16,
    marginBottom: 10, borderWidth: 1, borderColor: '#F1F5F9',
  },
  blocoHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  blocoTitulo: { fontSize: 14, fontWeight: '800', color: '#1E293B' },

  // Modal
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, maxHeight: '90%',
  },
  modalTitulo: { fontSize: 18, fontWeight: '800', color: '#1E293B', marginBottom: 20 },
  labelInput: { fontSize: 12, fontWeight: '700', color: '#64748B', marginBottom: 6, marginTop: 12 },
  inputModal: {
    backgroundColor: '#F8FAFC', borderRadius: 12, paddingHorizontal: 14,
    paddingVertical: 12, fontSize: 14, color: '#1E293B', borderWidth: 1, borderColor: '#E2E8F0',
  },
  coresRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 8 },
  corBotao: {
    alignItems: 'center', padding: 10, borderRadius: 12,
    borderWidth: 2, borderColor: '#F1F5F9', backgroundColor: '#F8FAFC', width: '30%',
  },
  corBotaoAtivo: { borderColor: '#4F46E5', backgroundColor: '#EEF2FF' },
  corLabel: { fontSize: 10, fontWeight: '700', color: '#64748B', marginTop: 4 },
  corUso: { fontSize: 12, color: '#6366F1', fontWeight: '600', marginTop: 8 },
  modalBotoes: { flexDirection: 'row', gap: 12, marginTop: 24 },
  btnCancelar: {
    flex: 1, padding: 16, backgroundColor: '#F1F5F9', borderRadius: 14, alignItems: 'center',
  },
  btnCancelarText: { color: '#64748B', fontWeight: '700' },
  btnSalvar: {
    flex: 1, padding: 16, backgroundColor: '#4F46E5', borderRadius: 14, alignItems: 'center',
  },
  btnSalvarText: { color: '#FFF', fontWeight: '800' },
});