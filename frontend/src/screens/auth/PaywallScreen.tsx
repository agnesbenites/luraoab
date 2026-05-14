import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Alert, ActivityIndicator, Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  iniciarIAP, encerrarIAP, buscarAssinaturas,
  assinar, ouvirCompras, PRODUCT_IDS
} from '../../lib/iap';
import { api } from '../../lib/api';

export default function PaywallScreen() {
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(true);
  const [assinando, setAssinando] = useState(false);
  const [precos, setPrecos] = useState<{ mensal?: string; anual?: string }>({});

  useEffect(() => {
    setup();
    const limpar = ouvirCompras(
      async (purchase) => {
        // Compra realizada com sucesso
        try {
          const token = await AsyncStorage.getItem('@lura_token');
          await api.post('/assinatura/validar', {
            purchaseToken: purchase.purchaseToken,
            productId: purchase.productId,
          }, token ?? undefined);

          await AsyncStorage.setItem('@lura_assinatura', 'ativa');
          Alert.alert('✅ Assinatura ativada!', 'Bem-vinda ao Lura Premium!', [
            { text: 'Começar', onPress: () => navigation.navigate('App') }
          ]);
        } catch (e) {
          Alert.alert('Erro', 'Compra realizada mas erro ao ativar. Contate o suporte.');
        } finally {
          setAssinando(false);
        }
      },
      (error) => {
        if ((error as any).code !== 'E_USER_CANCELLED') {
          Alert.alert('Erro na compra', error.message);
        }
        setAssinando(false);
      }
    );

    return () => {
      limpar();
      encerrarIAP();
    };
  }, []);

  async function setup() {
    await iniciarIAP();
    const subs = await buscarAssinaturas();

    const novosPrecos: { mensal?: string; anual?: string } = {};
    subs.forEach((sub: any) => {
      const preco = sub.localizedPrice ?? sub.subscriptionOfferDetails?.[0]?.pricingPhases?.pricingPhaseList?.[0]?.formattedPrice;
      if (sub.productId === PRODUCT_IDS.mensal) novosPrecos.mensal = preco;
      if (sub.productId === PRODUCT_IDS.anual) novosPrecos.anual = preco;
    });

    // Fallback para preços fixos se Google Play não retornar (ex: em desenvolvimento)
    if (!novosPrecos.mensal) novosPrecos.mensal = 'R$ 15,90';
    if (!novosPrecos.anual) novosPrecos.anual = 'R$ 119,90';

    setPrecos(novosPrecos);
    setLoading(false);
  }

  async function handleAssinar(tipo: 'mensal' | 'anual') {
    setAssinando(true);
    try {
      await assinar(PRODUCT_IDS[tipo]);
    } catch (e: any) {
      if (e.code !== 'E_USER_CANCELLED') {
        Alert.alert('Erro', 'Não foi possível iniciar a compra. Tente novamente.');
      }
      setAssinando(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#7C3AED" />
        <Text style={styles.loadingText}>Carregando planos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Seu plano de aprovação está pronto 🎯</Text>
      <Text style={styles.subtitulo}>
        Desbloqueie acesso completo à Lura e comece a estudar do jeito certo.
      </Text>

      {/* Plano Mensal */}
      <TouchableOpacity
        style={[styles.card, styles.cardDestaque]}
        onPress={() => handleAssinar('mensal')}
        disabled={assinando}
      >
        <View style={styles.badge}><Text style={styles.badgeText}>MAIS POPULAR</Text></View>
        <Text style={styles.planoNome}>Premium Mensal</Text>
        <Text style={styles.preco}>{precos.mensal}<Text style={styles.precoSub}>/mês</Text></Text>
        <Text style={styles.precoInfo}>Cancele quando quiser</Text>
        <View style={styles.btnAssinar}>
          <Text style={styles.btnAssinarText}>
            {assinando ? 'Processando...' : `Assinar por ${precos.mensal}/mês`}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Plano Anual */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => handleAssinar('anual')}
        disabled={assinando}
      >
        <View style={[styles.badge, { backgroundColor: '#059669' }]}>
          <Text style={styles.badgeText}>37% DE DESCONTO</Text>
        </View>
        <Text style={styles.planoNome}>Premium Anual</Text>
        <Text style={styles.preco}>{precos.anual}<Text style={styles.precoSub}>/ano</Text></Text>
        <Text style={styles.precoInfo}>Equivale a R$ 9,99/mês</Text>
        <View style={[styles.btnAssinar, { backgroundColor: '#059669' }]}>
          <Text style={styles.btnAssinarText}>
            {assinando ? 'Processando...' : `Assinar por ${precos.anual}/ano`}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Benefícios */}
      <View style={styles.beneficios}>
        {[
          '✅ Questões ilimitadas com IA',
          '✅ Diagnóstico personalizado',
          '✅ Simulados completos',
          '✅ Vade Mecum com marcações',
          '✅ Relatórios de desempenho',
        ].map((item, i) => (
          <Text key={i} style={styles.item}>{item}</Text>
        ))}
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('App')} style={styles.trial}>
        <Text style={styles.trialText}>Experimentar 7 dias grátis</Text>
      </TouchableOpacity>

      <Text style={styles.rodape}>
        Cobrado via Google Play. Cancele a qualquer momento nas configurações da sua conta.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a', padding: 24, justifyContent: 'center' },
  loadingText: { color: '#aaa', textAlign: 'center', marginTop: 12 },
  titulo: { fontSize: 22, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 8 },
  subtitulo: { color: '#aaa', textAlign: 'center', fontSize: 14, marginBottom: 20, lineHeight: 20 },
  card: { backgroundColor: '#1a1a2e', borderRadius: 20, padding: 20,
    borderWidth: 1, borderColor: '#2a2a3e', marginBottom: 12 },
  cardDestaque: { borderColor: '#7C3AED', borderWidth: 2 },
  badge: { backgroundColor: '#7C3AED', borderRadius: 20, paddingHorizontal: 12,
    paddingVertical: 4, alignSelf: 'center', marginBottom: 12 },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: 'bold', letterSpacing: 1 },
  planoNome: { color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  preco: { color: '#7C3AED', fontSize: 36, fontWeight: 'bold', textAlign: 'center', marginTop: 6 },
  precoSub: { fontSize: 16, color: '#aaa' },
  precoInfo: { color: '#666', textAlign: 'center', fontSize: 12, marginBottom: 14 },
  btnAssinar: { backgroundColor: '#7C3AED', borderRadius: 12, padding: 14, alignItems: 'center' },
  btnAssinarText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  beneficios: { marginVertical: 16 },
  item: { color: '#ccc', fontSize: 14, marginBottom: 6 },
  trial: { alignItems: 'center', marginBottom: 12 },
  trialText: { color: '#7C3AED', fontSize: 15, fontWeight: '600' },
  rodape: { color: '#444', fontSize: 11, textAlign: 'center', lineHeight: 16 },
});
