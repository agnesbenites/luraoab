import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert, ActivityIndicator } from 'react-native';
import { LegalConsent } from '../src/components/ui/LegalConsent';
import { supabase } from '../src/lib/supabase';

export default function ActivateScreen() {
  const [isAccepted, setIsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlePaymentRedirect = async () => {
    if (!isAccepted) return;

    setIsLoading(true);
    try {
      // 1. Captura o usuário logado no Supabase
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        Alert.alert('Erro', 'Usuário não autenticado. Faça login novamente.');
        return;
      }

      // 2. Grava o log jurídico de consentimento no banco de dados
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          terms_accepted: true, 
          terms_accepted_at: new Date().toISOString() 
        })
        .eq('id', user.id);

      if (updateError) {
        throw new Error(updateError.message);
      }

      // 3. Abre o link do Mercado Pago no navegador nativo do celular
      // Substitua pelo seu link gerado no painel do Mercado Pago
      const checkoutUrl = "https://link-do-seu-checkout-no-mercado-pago.com";
      await Linking.openURL(checkoutUrl);
      
    } catch (error: any) {
      Alert.alert('Erro no Servidor', 'Não foi possível registrar o termo de adesão eletrônico.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Ative sua assinatura premium</Text>
        <Text style={styles.subtitle}>
          Tenha acesso ilimitado à IA jurídica, banco de questões e Vade Mecum inteligente.
        </Text>

        <View style={styles.priceBox}>
          <Text style={styles.currency}>R$</Text>
          <Text style={styles.price}>15,90</Text>
          <Text style={styles.period}>/mês</Text>
        </View>

        <LegalConsent onAcceptChange={(accepted) => setIsAccepted(accepted)} />

        <TouchableOpacity
          style={[styles.payButton, (!isAccepted || isLoading) && styles.disabledButton]}
          disabled={!isAccepted || isLoading}
          onPress={handlePaymentRedirect}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Ir para o Mercado Pago</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.secureNotice}>
          🔒 Ambiente de pagamento seguro e criptografado via Mercado Pago.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Alinhado ao tema escuro sóbrio do app
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#A0A0A0',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  priceBox: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 24,
  },
  currency: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 4,
  },
  price: {
    fontSize: 48,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  period: {
    fontSize: 16,
    color: '#A0A0A0',
    marginLeft: 4,
  },
  payButton: {
    backgroundColor: '#b794ff',
    width: '100%',
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  disabledButton: {
    backgroundColor: '#4A3E66',
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secureNotice: {
    fontSize: 11,
    color: '#666666',
    marginTop: 16,
    textAlign: 'center',
  },
});
