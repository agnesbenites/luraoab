import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Linking,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { supabase } from '../lib/supabase';
import { theme2fase as t } from '../constants/theme2fase';
import { areas2fase } from '../constants/areas2fase';

// ─── tipos ──────────────────────────────────────────────────────────────────

type Perfil = {
  id: string;
  nome: string | null;
  area_segunda_fase: string | null;
  total_simulados: number;
  acertos_total: number;
  questoes_total: number;
};

type ModalTipo = 'email' | 'senha' | 'area' | 'reiniciar' | null;

export default function Perfil() {
  const navigation = useNavigation<any>();

  const [user, setUser] = useState<any>(null);
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const [modal, setModal] = useState<ModalTipo>(null);

  // campos editáveis
  const [novoEmail, setNovoEmail] = useState('');
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [areaSelecionada, setAreaSelecionada] = useState('');

  // ── carregamento ─────────────────────────────────────────────────────────

  const carregar = async () => {
    setLoading(true);

    const { data: { user: u } } = await supabase.auth.getUser();
    if (!u) { setLoading(false); return; }
    setUser(u);

    const { data } = await supabase
      .from('perfis')
      .select('id, nome, area_segunda_fase, total_simulados, acertos_total, questoes_total')
      .eq('id', u.id)
      .single();

    if (data) {
      setPerfil(data as Perfil);
      setAreaSelecionada(data.area_segunda_fase ?? '');
    }

    setLoading(false);
  };

  useEffect(() => { carregar(); }, []);
  useFocusEffect(useCallback(() => { carregar(); }, []));

  // ── helpers ──────────────────────────────────────────────────────────────

  const fecharModal = () => {
    setModal(null);
    setNovoEmail('');
    setSenhaAtual('');
    setNovaSenha('');
    setConfirmarSenha('');
  };

  const taxaAcerto = () => {
    if (!perfil || perfil.questoes_total === 0) return '—';
    return `${Math.round((perfil.acertos_total / perfil.questoes_total) * 100)}%`;
  };

  const nomeArea = (id: string | null) => {
    if (!id) return 'Não definida';
    return areas2fase.find((a) => a.id === id)?.nome ?? id;
  };

  // ── ações ────────────────────────────────────────────────────────────────

  const salvarEmail = async () => {
    if (!novoEmail.trim()) return Alert.alert('Informe o novo e-mail.');
    setSalvando(true);
    const { error } = await supabase.auth.updateUser({ email: novoEmail.trim() });
    setSalvando(false);
    if (error) return Alert.alert('Erro', error.message);
    fecharModal();
    Alert.alert('Confirmação enviada', 'Verifique o novo e-mail para confirmar a alteração.');
  };

  const salvarSenha = async () => {
    if (!novaSenha || !confirmarSenha)
      return Alert.alert('Preencha todos os campos.');
    if (novaSenha !== confirmarSenha)
      return Alert.alert('As senhas não coincidem.');
    if (novaSenha.length < 6)
      return Alert.alert('A senha precisa ter pelo menos 6 caracteres.');
    setSalvando(true);
    const { error } = await supabase.auth.updateUser({ password: novaSenha });
    setSalvando(false);
    if (error) return Alert.alert('Erro', error.message);
    fecharModal();
    Alert.alert('Senha alterada com sucesso!');
  };

  const salvarArea = async () => {
    if (!user || !areaSelecionada) return;
    setSalvando(true);
    const { error } = await supabase
      .from('perfis')
      .update({ area_segunda_fase: areaSelecionada })
      .eq('id', user.id);
    setSalvando(false);
    if (error) return Alert.alert('Erro', error.message);
    fecharModal();
    carregar();
    Alert.alert('Área updated!');
  };

  const reiniciarMetricas = () => {
    Alert.alert(
      'Reiniciar métricas',
      'Isso vai zerar todos os seus simulados e estatísticas. Não é possível desfazer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sim, reiniciar',
          style: 'destructive',
          onPress: async () => {
            if (!user) return;
            setSalvando(true);
            await supabase
              .from('perfis')
              .update({ total_simulados: 0, acertos_total: 0, questoes_total: 0 })
              .eq('id', user.id);
            await supabase.from('respostas_usuario').delete().eq('user_id', user.id);
            setSalvando(false);
            fecharModal();
            carregar();
            Alert.alert('Métricas reiniciadas.');
          },
        },
      ]
    );
  };

  const sair = () => {
    Alert.alert('Sair da conta', 'Deseja encerrar sua sessão?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          await supabase.auth.signOut();
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        },
      },
    ]);
  };

  // LINK AJUSTADO PARA APONTAR DIRETO PARA A ROTA LEGAL DA LANDING PAGE
  const handleOpenLegal = () => {
    // Em produção você altera para 'https://luraoab.com.br/legal'
    Linking.openURL('http://localhost:3000/legal'); 
  };

  // ── render ───────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <SafeAreaView style={styles.centerFull}>
        <ActivityIndicator size="large" color={t.accent} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={t.background} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Cabeçalho */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarLetter}>
              {perfil?.nome?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? '?'}
            </Text>
          </View>
          <Text style={styles.nome}>{perfil?.nome ?? 'Meu perfil'}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        {/* Progresso */}
        <Text style={styles.sectionLabel}>Seu progresso</Text>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{perfil?.total_simulados ?? 0}</Text>
            <Text style={styles.statLabel}>Simulados</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{perfil?.questoes_total ?? 0}</Text>
            <Text style={styles.statLabel}>Questões</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{taxaAcerto()}</Text>
            <Text style={styles.statLabel}>Acertos</Text>
          </View>
        </View>

        {/* 2ª Fase */}
        <Text style={styles.sectionLabel}>2ª Fase</Text>
        <TouchableOpacity style={styles.row} onPress={() => setModal('area')} activeOpacity={0.85}>
          <View style={styles.rowLeft}>
            <Text style={styles.rowTitle}>Área escolhida</Text>
            <Text style={styles.rowValue}>{nomeArea(perfil?.area_segunda_fase ?? null)}</Text>
          </View>
          <Text style={styles.rowChevron}>›</Text>
        </TouchableOpacity>

        {/* Conta */}
        <Text style={styles.sectionLabel}>Conta</Text>

        <TouchableOpacity style={styles.row} onPress={() => setModal('email')} activeOpacity={0.85}>
          <View style={styles.rowLeft}>
            <Text style={styles.rowTitle}>Alterar e-mail</Text>
            <Text style={styles.rowValue}>{user?.email}</Text>
          </View>
          <Text style={styles.rowChevron}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.row} onPress={() => setModal('senha')} activeOpacity={0.85}>
          <View style={styles.rowLeft}>
            <Text style={styles.rowTitle}>Alterar senha</Text>
            <Text style={styles.rowValue}>••••••••</Text>
          </View>
          <Text style={styles.rowChevron}>›</Text>
        </TouchableOpacity>

        {/* BOTÃO DOS TERMOS INTEGRADO COM SEU ESTILO ORIGINAL */}
        <TouchableOpacity style={styles.row} onPress={handleOpenLegal} activeOpacity={0.85}>
          <View style={styles.rowLeft}>
            <Text style={styles.rowTitle}>Termos e Políticas Legais</Text>
            <Text style={styles.rowValue}>Documentos de privacidade e LGPD</Text>
          </View>
          <Text style={styles.rowChevron}>›</Text>
        </TouchableOpacity>

        {/* Zona de Perigo */}
        <Text style={styles.sectionLabel}>Zona de perigo</Text>

        <TouchableOpacity style={styles.rowDestructive} onPress={reiniciarMetricas} activeOpacity={0.85}>
          <Text style={styles.rowDestructiveText}>Reiniciar métricas</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.rowDestructive} onPress={sair} activeOpacity={0.85}>
          <Text style={styles.rowDestructiveText}>Sair da conta</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Modais mantidos idênticos... */}
      <Modal visible={modal === 'email'} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Alterar e-mail</Text>
            <Text style={styles.modalSub}>Um link de confirmação será enviado para o novo endereço.</Text>
            <TextInput
              style={styles.input}
              placeholder="Novo e-mail"
              placeholderTextColor={t.textMuted}
              value={novoEmail}
              onChangeText={setNovoEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.btnSecondary} onPress={fecharModal}>
                <Text style={styles.btnSecondaryText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnPrimary} onPress={salvarEmail} disabled={salvando}>
                {salvando ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.btnPrimaryText}>Confirmar</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={modal === 'senha'} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Alterar senha</Text>
            <TextInput
              style={styles.input}
              placeholder="Nova senha"
              placeholderTextColor={t.textMuted}
              value={novaSenha}
              onChangeText={setNovaSenha}
              secureTextEntry
            />
            <TextInput
              style={[styles.input, { marginTop: 10 }]}
              placeholder="Confirmar nova senha"
              placeholderTextColor={t.textMuted}
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
              secureTextEntry
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.btnSecondary} onPress={fecharModal}>
                <Text style={styles.btnSecondaryText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnPrimary} onPress={salvarSenha} disabled={salvando}>
                {salvando ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.btnPrimaryText}>Salvar</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={modal === 'area'} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Área da 2ª fase</Text>
            <Text style={styles.modalSub}>Escolha a matéria que você vai fazer na prova.</Text>
            <ScrollView style={{ maxHeight: 320 }} showsVerticalScrollIndicator={false}>
              {areas2fase.map((area) => {
                const ativa = areaSelecionada === area.id;
                return (
                  <TouchableOpacity
                    key={area.id}
                    style={[styles.areaOption, ativa && styles.areaOptionAtiva]}
                    onPress={() => setAreaSelecionada(area.id)}
                    activeOpacity={0.85}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.areaOptionNome, ativa && styles.areaOptionNomeAtivo]}>{area.nome}</Text>
                      <Text style={styles.areaOptionDesc}>{area.descricao}</Text>
                    </View>
                    {ativa && <Text style={styles.areaCheck}>✓</Text>}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            <View style={[styles.modalActions, { marginTop: 16 }]}>
              <TouchableOpacity style={styles.btnSecondary} onPress={fecharModal}>
                <Text style={styles.btnSecondaryText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnPrimary} onPress={salvarArea} disabled={salvando}>
                {salvando ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.btnPrimaryText}>Salvar</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: t.background },
  centerFull: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: t.background },
  scroll: { padding: 24, paddingTop: 20, paddingBottom: 48 },
  header: { alignItems: 'center', marginBottom: 32 },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: t.surface,
    borderWidth: 1,
    borderColor: t.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarLetter: { fontSize: 28, fontWeight: '700', color: t.accent },
  nome: { fontSize: 20, fontWeight: '700', color: t.textPrimary, marginBottom: 4 },
  email: { fontSize: 13, color: t.textSecondary },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: t.textMuted,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    marginBottom: 8,
    marginTop: 24,
  },
  statsRow: { flexDirection: 'row', gap: 10 },
  statCard: {
    flex: 1,
    backgroundColor: t.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: t.border,
    paddingVertical: 16,
    alignItems: 'center',
  },
  statValue: { fontSize: 22, fontWeight: '700', color: t.textPrimary, marginBottom: 4 },
  statLabel: { fontSize: 12, color: t.textMuted },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: t.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: t.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 8,
  },
  rowLeft: { flex: 1 },
  rowTitle: { fontSize: 14, fontWeight: '600', color: t.textPrimary, marginBottom: 3 },
  rowValue: { fontSize: 13, color: t.textSecondary },
  rowChevron: { fontSize: 20, color: t.textMuted, marginLeft: 8 },
  rowDestructive: {
    backgroundColor: t.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: t.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 8,
  },
  rowDestructiveText: { fontSize: 14, fontWeight: '600', color: '#e05a5a' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' },
  modalBox: { backgroundColor: t.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, paddingBottom: 36 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: t.textPrimary, marginBottom: 6 },
  modalSub: { fontSize: 13, color: t.textSecondary, lineHeight: 20, marginBottom: 16 },
  input: { backgroundColor: t.background, borderWidth: 1, borderColor: t.border, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: t.textPrimary },
  modalActions: { flexDirection: 'row', gap: 10, marginTop: 16 },
  btnSecondary: { flex: 1, backgroundColor: t.background, borderWidth: 1, borderColor: t.border, borderRadius: 12, paddingVertical: 13, alignItems: 'center' },
  btnSecondaryText: { fontSize: 14, fontWeight: '700', color: t.textSecondary },
  btnPrimary: { flex: 1, backgroundColor: t.accent, borderRadius: 12, paddingVertical: 13, alignItems: 'center' },
  btnPrimaryText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  areaOption: { flexDirection: 'row', alignItems: 'center', backgroundColor: t.background, borderRadius: 12, borderWidth: 1, borderColor: t.border, padding: 14, marginBottom: 8 },
  areaOptionAtiva: { borderColor: t.accent, backgroundColor: t.surface },
  areaOptionNome: { fontSize: 14, fontWeight: '600', color: t.textPrimary, marginBottom: 3 },
  areaOptionNomeAtivo: { color: t.accent },
  areaOptionDesc: { fontSize: 12, color: t.textMuted, lineHeight: 18 },
  areaCheck: { fontSize: 16, color: t.accent, fontWeight: '700', marginLeft: 10 },
});