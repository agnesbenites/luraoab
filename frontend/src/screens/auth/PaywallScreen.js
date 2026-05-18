import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function PaywallScreen() {
  const { user } = useAuth();
  const [isAccepted, setIsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [planoSelecionado, setPlanoSelecionado] = useState('mensal');

  const handleAssinarAgora = async () => {
    if (!isAccepted) {
      Alert.alert('Aviso', 'Você precisa aceitar os Termos de Uso para prosseguir.');
      return;
    }

    if (!user) {
      Alert.alert('Erro', 'Usuário não identificado. Faça login novamente.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://192.168.3.76:3333/assinatura/criar-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          email: user.email,
          plano: planoSelecionado,
        }),
      });

      let data = null;
      const rawText = await response.text();

      try {
        data = rawText ? JSON.parse(rawText) : null;
      } catch {
        data = { error: rawText };
      }

      if (!response.ok) {
        throw new Error(
          data?.detalhe ||
            data?.error ||
            `Falha ao gerar link no servidor. Status: ${response.status}`
        );
      }

      if (!data?.checkoutUrl) {
        throw new Error('Checkout URL não retornada pelo servidor.');
      }

      const supported = await Linking.canOpenURL(data.checkoutUrl);

      if (!supported) {
        throw new Error('Não foi possível abrir a URL do checkout.');
      }

      await Linking.openURL(data.checkoutUrl);
    } catch (error) {
      Alert.alert(
        'Erro no checkout',
        error?.message || 'Não foi possível conectar ao back-end local.'
      );
      console.error('Erro ao assinar:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Seu plano de aprovação está pronto 🎯</Text>
        <Text style={styles.subtitle}>
          Desbloqueie acesso completo à Lura e comece a estudar do jeito certo.
        </Text>

        <TouchableOpacity
          style={[styles.planCard, planoSelecionado === 'mensal' && styles.selectedPlanCard]}
          activeOpacity={0.9}
          onPress={() => setPlanoSelecionado('mensal')}
        >
          <View style={styles.badgeMensal}>
            <Text style={styles.badgeText}>MAIS POPULAR</Text>
          </View>
          <Text style={styles.planTitle}>Premium Mensal</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.priceHighlight}>R$ 15,90</Text>
            <Text style={styles.pricePeriod}>/mês</Text>
          </View>
          <Text style={styles.planFooterText}>Cancele quando quiser</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.planCard, planoSelecionado === 'anual' && styles.selectedPlanCard]}
          activeOpacity={0.9}
          onPress={() => setPlanoSelecionado('anual')}
        >
          <View style={styles.badgeAnual}>
            <Text style={styles.badgeText}>37% DE DESCONTO</Text>
          </View>
          <Text style={styles.planTitle}>Premium Anual</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.priceHighlight}>R$ 119,90</Text>
            <Text style={styles.pricePeriod}>/ano</Text>
          </View>
          <Text style={styles.planFooterText}>Equivale a R$ 9,99/mês</Text>
        </TouchableOpacity>

        <View style={styles.benefitsList}>
          <Text style={styles.benefitItem}>✅ Questões ilimitadas com IA</Text>
          <Text style={styles.benefitItem}>✅ Diagnóstico personalizado</Text>
          <Text style={styles.benefitItem}>✅ Simulados completos</Text>
          <Text style={styles.benefitItem}>✅ Vade Mecum com marcações</Text>
          <Text style={styles.benefitItem}>✅ Relatórios de desempenho</Text>
        </View>

        <TouchableOpacity
          style={styles.consentRow}
          activeOpacity={0.8}
          onPress={() => setIsAccepted(!isAccepted)}
        >
          <View style={[styles.checkbox, isAccepted && styles.checked]}>
            {isAccepted && <Text style={styles.checkMark}>✓</Text>}
          </View>
          <Text style={styles.consentText}>
            Li, entendi e concordo com o Contrato de Adesão Eletrônico e as Políticas de
            Privacidade.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.payButton, (!isAccepted || isLoading) && styles.disabledButton]}
          disabled={!isAccepted || isLoading}
          onPress={handleAssinarAgora}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>
              {planoSelecionado === 'mensal'
                ? 'Assinar por R$ 15,90/mês'
                : 'Assinar por R$ 119,90/ano'}
            </Text>
          )}
        </TouchableOpacity>

        <Text style={styles.secureNotice}>
          🔒 Checkout seguro em ambiente criptografado Sandbox do Mercado Pago.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a' },
  scrollContainer: { padding: 24, alignItems: 'center' },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#a0a0a0',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  planCard: {
    backgroundColor: '#15142b',
    width: '100%',
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#25234c',
    alignItems: 'center',
    position: 'relative',
  },
  selectedPlanCard: { borderColor: '#7C3AED', backgroundColor: '#1b1936' },
  badgeMensal: {
    backgroundColor: '#7C3AED',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    position: 'absolute',
    top: -10,
  },
  badgeAnual: {
    backgroundColor: '#059669',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    position: 'absolute',
    top: -10,
  },
  badgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: '800' },
  planTitle: { fontSize: 18, fontWeight: '700', color: '#FFFFFF', marginTop: 4, marginBottom: 8 },
  priceContainer: { flexDirection: 'row', alignItems: 'baseline' },
  priceHighlight: { fontSize: 32, fontWeight: '800', color: '#7C3AED' },
  pricePeriod: { fontSize: 14, color: '#a0a0a0', marginLeft: 4 },
  planFooterText: { fontSize: 12, color: '#6b6a8a', marginTop: 6 },
  benefitsList: { width: '100%', paddingHorizontal: 12, marginBottom: 24 },
  benefitItem: { color: '#b5b5c6', fontSize: 14, marginBottom: 8, fontWeight: '500' },
  consentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
    paddingHorizontal: 8,
    width: '100%',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#4a4a4a',
    borderRadius: 6,
    marginRight: 12,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: { backgroundColor: '#7C3AED', borderColor: '#7C3AED' },
  checkMark: { color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' },
  consentText: { fontSize: 12, color: '#8c8c8c', flex: 1, lineHeight: 18 },
  payButton: {
    backgroundColor: '#7C3AED',
    width: '100%',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: { backgroundColor: '#2d2b4a', opacity: 0.5 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  secureNotice: { fontSize: 11, color: '#4a4a6a', marginTop: 16, textAlign: 'center' },
});