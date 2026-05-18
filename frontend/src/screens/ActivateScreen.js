import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Styleheet, 
  TouchableOpacity, 
  Linking, 
  Alert, 
  ActivityIndicator, 
  SafeAreaView 
} from 'react-native';
import { supabase } from '../lib/supabase';
import { theme2fase as t } from '../constants/theme2fase';

export default function ActivateScreen({ navigation }) {
  const [isAccepted, setIsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Busca o usuário logado para passar ao back-end
    async function getUsuario() {
      const { data: { user: u } } = await supabase.auth.getUser();
      if (u) setUser(u);
    }
    getUsuario();
  }, []);

  const handlePaymentRedirect = async () => {
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
      // ATENÇÃO: Substitua 'localhost' pelo seu IP da rede local (ex: 192.168.x.x) 
      // se estiver testando em um celular físico conectado ao mesmo Wi-Fi!
      const response = await fetch('http://localhost:3333/assinatura/criar-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          email: user.email,
        }),
      });

      if (!response.ok) {
        throw new Error('Falha ao gerar link de pagamento no servidor.');
      }

      const data = await response.json();

      if (data.checkoutUrl) {
        // Abre o navegador padrão do celular com o checkout do Mercado Pago
        await Linking.openURL(data.checkoutUrl);
      } else {
        throw new Error('URL de checkout não retornada.');
      }
      
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível conectar ao servidor de pagamento.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Aprovação sem excessos</Text>
        <Text style={styles.subtitle}>
          Ative sua assinatura premium para liberar a IA jurídica, correção de peças e o Vade Mecum inteligente.
        </Text>

        <View style={styles.priceBox}>
          <Text style={styles.currency}>R$</Text>
          <Text style={styles.price}>15,90</Text>
          <Text style={styles.period}>/mês</Text>
        </View>

        {/* Checkbox de Consentimento Eletrônico */}
        <TouchableOpacity 
          style={styles.consentRow} 
          activeOpacity={0.8} 
          onPress={() => setIsAccepted(!isAccepted)}
        >
          <View style={[styles.checkbox, isAccepted && styles.checked]}>
            {isAccepted && <Text style={styles.checkMark}>✓</Text>}
          </View>
          <Text style={styles.consentText}>
            Li, entendi e concordo com o Contrato de Adesão Eletrônico e as Políticas de Privacidade.
          </Text>
        </TouchableOpacity>

        {/* Botão de Ação */}
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
          🔒 Checkout seguro processado em ambiente criptografado do Mercado Pago.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c0a0f', // Mantendo o tom escuro premium
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#131118',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#a0a0a0',
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 20,
  },
  priceBox: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 32,
  },
  currency: {
    fontSize: 18,
    fontWeight: '600',
    color: '#b794ff',
    marginRight: 4,
  },
  price: {
    fontSize: 54,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  period: {
    fontSize: 16,
    color: '#a0a0a0',
    marginLeft: 4,
  },
  consentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
    paddingHorizontal: 4,
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
  checked: {
    backgroundColor: '#b794ff',
    borderColor: '#b794ff',
  },
  checkMark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  consentText: {
    fontSize: 12,
    color: '#8c8c8c',
    flex: 1,
    lineHeight: 18,
  },
  payButton: {
    backgroundColor: '#b794ff',
    width: '100%',
    height: 54,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#322846',
    opacity: 0.5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  secureNotice: {
    fontSize: 11,
    color: '#555555',
    marginTop: 16,
    textAlign: 'center',
  },
});
